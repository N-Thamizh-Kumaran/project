import { OtpVerificationRecord, SimulatedMessage } from '../types';
import { generateOtpCode, addSimulatedMessage, logAuditEvent } from './storage';

const OTP_STORAGE_KEY = 'sovs_active_otps_v2';
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_ATTEMPTS = 3;

function getStoredOtps(): Record<string, OtpVerificationRecord> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(OTP_STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveStoredOtps(otps: Record<string, OtpVerificationRecord>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otps));
}

export interface RequestOtpResult {
  success: boolean;
  message: string;
  cooldownRemaining?: number;
  recipientMasked?: string;
  simulatedCode?: string; // Provided for developer mode display
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
}

// Mask recipient e.g. el***@student.edu or +1 (555) ***-5678
export function maskRecipient(identifier: string): string {
  if (identifier.includes('@')) {
    const [name, domain] = identifier.split('@');
    if (name.length <= 2) return `${name.charAt(0)}***@${domain}`;
    return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`;
  }
  // Phone or ID mask
  if (identifier.length > 5) {
    return `${identifier.slice(0, 3)}****${identifier.slice(-3)}`;
  }
  return identifier;
}

/**
 * Request or generate an OTP for a given user identifier (email or phone)
 */
export function requestOtp(identifier: string, channel: 'EMAIL' | 'SMS' = 'EMAIL'): RequestOtpResult {
  const cleanId = identifier.trim().toLowerCase();
  const otps = getStoredOtps();
  const now = Date.now();

  const existing = otps[cleanId];

  // Check resend cooldown
  if (existing && !existing.isUsed && now - existing.createdAt < OTP_RESEND_COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((OTP_RESEND_COOLDOWN_MS - (now - existing.createdAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${remainingSeconds}s before requesting a new verification code.`,
      cooldownRemaining: remainingSeconds,
    };
  }

  // Generate 6-digit code
  const code = generateOtpCode();
  const expiresAt = now + OTP_EXPIRY_MS;

  const record: OtpVerificationRecord = {
    id: `otp-${Date.now()}`,
    identifier: cleanId,
    code,
    expiresAt,
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    isUsed: false,
    createdAt: now,
    channel,
  };

  otps[cleanId] = record;
  saveStoredOtps(otps);

  // Dispatch simulated message to Virtual Inbox
  const simulatedMsg: SimulatedMessage = {
    id: `msg-${Date.now()}`,
    recipient: identifier,
    channel,
    otpCode: code,
    sentAt: new Date().toISOString(),
    expiresAt: new Date(expiresAt).toISOString(),
    content: `[SecureVote OTP Verification] Your one-time verification passcode is ${code}. Valid for 5 minutes. Do not share this code with anyone. Institutional Election Security Service.`,
  };
  addSimulatedMessage(simulatedMsg);

  // Log audit event
  logAuditEvent(
    'OTP_DISPATCHED',
    'SYSTEM',
    maskRecipient(identifier),
    `6-digit one-time password generated via ${channel}. Valid for 300s.`
  );

  return {
    success: true,
    message: `Verification code sent to ${maskRecipient(identifier)}.`,
    recipientMasked: maskRecipient(identifier),
    simulatedCode: code,
  };
}

/**
 * Verify submitted OTP against active record
 */
export function verifyOtp(identifier: string, inputCode: string): VerifyOtpResult {
  const cleanId = identifier.trim().toLowerCase();
  const otps = getStoredOtps();
  const now = Date.now();

  const record = otps[cleanId];

  if (!record) {
    return {
      success: false,
      message: 'No active OTP verification session found. Please request a new code.',
    };
  }

  if (record.isUsed) {
    return {
      success: false,
      message: 'This verification code has already been consumed. Please request a new code.',
    };
  }

  if (now > record.expiresAt) {
    return {
      success: false,
      message: 'This verification code has expired (validity is 5 minutes). Please click resend.',
    };
  }

  if (record.attempts >= record.maxAttempts) {
    return {
      success: false,
      message: 'Maximum verification attempts exceeded. For security, please request a new OTP.',
      attemptsRemaining: 0,
    };
  }

  // Check code match
  if (record.code !== inputCode.trim()) {
    record.attempts += 1;
    otps[cleanId] = record;
    saveStoredOtps(otps);

    const remaining = record.maxAttempts - record.attempts;

    logAuditEvent(
      'OTP_VERIFICATION_FAILED',
      'VOTER',
      maskRecipient(identifier),
      `Incorrect OTP attempt (${record.attempts}/${record.maxAttempts}).`
    );

    if (remaining <= 0) {
      return {
        success: false,
        message: 'Security lockout: Maximum incorrect attempts reached. Please request a new code.',
        attemptsRemaining: 0,
      };
    }

    return {
      success: false,
      message: `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before session lockout.`,
      attemptsRemaining: remaining,
    };
  }

  // Mark as consumed
  record.isUsed = true;
  otps[cleanId] = record;
  saveStoredOtps(otps);

  logAuditEvent(
    'OTP_VERIFIED_SUCCESS',
    'VOTER',
    maskRecipient(identifier),
    'Two-factor OTP verified successfully. Authenticated voter session authorized.'
  );

  return {
    success: true,
    message: 'OTP verified successfully.',
  };
}

/**
 * Check how much time remains on an active OTP (in seconds)
 */
export function getOtpRemainingSeconds(identifier: string): number {
  const cleanId = identifier.trim().toLowerCase();
  const otps = getStoredOtps();
  const record = otps[cleanId];
  if (!record || record.isUsed) return 0;
  const remaining = Math.max(0, Math.ceil((record.expiresAt - Date.now()) / 1000));
  return remaining;
}
