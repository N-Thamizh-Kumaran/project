import React, { useState, useEffect, useRef } from 'react';
import { verifyOtp, requestOtp, maskRecipient } from '../services/otpService';
import { ShieldCheck, Clock, RefreshCw, AlertCircle, CheckCircle, Mail, KeyRound, X } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  identifier: string; // email or phone
  channel: 'EMAIL' | 'SMS';
  onClose: () => void;
  onSuccess: () => void;
  onOpenInbox: () => void;
}

export default function OtpModal({
  isOpen,
  identifier,
  channel,
  onClose,
  onSuccess,
  onOpenInbox,
}: OtpModalProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Expiration countdown (300 seconds)
  const [expiresSeconds, setExpiresSeconds] = useState(300);
  // Resend cooldown countdown (30 seconds)
  const [cooldownSeconds, setCooldownSeconds] = useState(30);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize and tick timers
  useEffect(() => {
    if (!isOpen) {
      setDigits(['', '', '', '', '', '']);
      setError(null);
      setSuccess(false);
      return;
    }

    setExpiresSeconds(300);
    setCooldownSeconds(30);

    const timer = setInterval(() => {
      setExpiresSeconds(prev => (prev > 0 ? prev - 1 : 0));
      setCooldownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Auto focus first input
    setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of whole OTP
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const nextDigits = [...digits];
        for (let i = 0; i < 6; i++) {
          nextDigits[i] = pasted[i] || '';
        }
        setDigits(nextDigits);
        const focusIdx = Math.min(pasted.length, 5);
        inputsRef.current[focusIdx]?.focus();
        if (pasted.length === 6) {
          submitOtp(pasted);
        }
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    setDigits(nextDigits);
    setError(null);

    // Advance focus
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    const fullCode = nextDigits.join('');
    if (fullCode.length === 6 && nextDigits.every(d => d !== '')) {
      submitOtp(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const nextDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        nextDigits[i] = pasted[i] || '';
      }
      setDigits(nextDigits);
      if (pasted.length === 6) {
        submitOtp(pasted);
      } else {
        inputsRef.current[pasted.length]?.focus();
      }
    }
  };

  const submitOtp = (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    // Small simulated network latency
    setTimeout(() => {
      const result = verifyOtp(identifier, code);
      setLoading(false);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        setError(result.message);
        // Clear digits on error
        setDigits(['', '', '', '', '', '']);
        inputsRef.current[0]?.focus();
      }
    }, 450);
  };

  const handleResend = () => {
    if (cooldownSeconds > 0) return;

    const res = requestOtp(identifier, channel);
    if (res.success) {
      setCooldownSeconds(30);
      setExpiresSeconds(300);
      setDigits(['', '', '', '', '', '']);
      setError(null);
      inputsRef.current[0]?.focus();
    } else {
      setError(res.message);
    }
  };

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Two-Factor OTP Verification
              </h2>
              <p className="text-xs text-slate-500">
                Ensuring authenticity of voter credential
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="text-center">
            <p className="text-sm text-slate-600">
              We sent a 6-digit one-time passcode to:
            </p>
            <p className="text-sm font-semibold text-slate-900 font-mono mt-0.5">
              {maskRecipient(identifier)}
            </p>
          </div>

          {/* 6 Digit Inputs */}
          <div className="flex justify-center items-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={el => { inputsRef.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                disabled={loading || success || expiresSeconds === 0}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border transition-all outline-none ${
                  error
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900'
                    : digit
                    ? 'border-indigo-600 bg-indigo-50/20 text-indigo-900 shadow-xs ring-2 ring-indigo-500/10'
                    : 'border-slate-300 bg-slate-50/50 text-slate-900 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                }`}
              />
            ))}
          </div>

          {/* Countdown & Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex items-center gap-1.5 font-mono tabular-nums">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Expires in:</span>
              <span className={`font-semibold ${expiresSeconds < 60 ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                {formatTimer(expiresSeconds)}
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              Max 3 incorrect attempts
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="font-medium">OTP Verified! Authenticating voter session...</p>
            </div>
          )}

          {/* Submit Action */}
          <button
            onClick={() => submitOtp()}
            disabled={loading || success || digits.join('').length !== 6 || expiresSeconds === 0}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Cryptographic OTP...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Proceed to Ballot</span>
              </>
            )}
          </button>

          {/* Resend & Dev Inbox Helpers */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <button
              onClick={handleResend}
              disabled={cooldownSeconds > 0}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 disabled:text-slate-400 font-medium cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3 h-3 ${cooldownSeconds > 0 ? 'opacity-40' : ''}`} />
              <span>
                {cooldownSeconds > 0
                  ? `Resend available in ${cooldownSeconds}s`
                  : 'Resend Verification Code'}
              </span>
            </button>

            <button
              onClick={onOpenInbox}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Simulated Inbox (Dev Mode)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
