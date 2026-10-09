import React, { useState } from 'react';
import { User } from '../types';
import { getUserByEmailOrStudentId, registerUser } from '../services/storage';
import { requestOtp } from '../services/otpService';
import { X, Lock, Mail, User as UserIcon, Phone, BookOpen, AlertCircle, ShieldCheck, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOtpRequired: (identifier: string, user: User, channel: 'EMAIL' | 'SMS') => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onOtpRequired,
}: AuthModalProps) {
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [preferredChannel, setPreferredChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register state
  const [regFullName, setRegFullName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Demo Quick-Fill
  const handleQuickFill = (email: string, studentId: string) => {
    setLoginIdentifier(studentId);
    setLoginPassword('Voter@2026');
    setLoginError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your Institutional ID, Email, or Phone.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const user = getUserByEmailOrStudentId(loginIdentifier);
      if (!user) {
        setIsSubmitting(false);
        setLoginError('No registered voter found matching those credentials.');
        return;
      }

      if (!user.isActive) {
        setIsSubmitting(false);
        setLoginError('This voter account has been disabled by the Election Officer.');
        return;
      }

      // Initiate OTP step
      const targetIdentifier = preferredChannel === 'SMS' ? user.phone : user.email;
      const otpRes = requestOtp(targetIdentifier, preferredChannel);

      setIsSubmitting(false);

      if (otpRes.success) {
        onOtpRequired(targetIdentifier, user, preferredChannel);
      } else {
        setLoginError(otpRes.message);
      }
    }, 350);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFullName.trim() || !regStudentId.trim() || !regEmail.trim() || !regPhone.trim()) {
      setRegError('All fields are required.');
      return;
    }

    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setRegError('Please provide a valid institutional email address.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (!regAgreeTerms) {
      setRegError('You must agree to the institutional election code of conduct.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = registerUser({
        fullName: regFullName,
        studentId: regStudentId,
        email: regEmail,
        phone: regPhone,
        department: regDepartment,
      });

      setIsSubmitting(false);

      if (!res.success || !res.user) {
        setRegError(res.error || 'Registration failed.');
        return;
      }

      // Trigger OTP dispatch for newly registered user
      const targetIdentifier = preferredChannel === 'SMS' ? res.user.phone : res.user.email;
      requestOtp(targetIdentifier, preferredChannel);
      onOtpRequired(targetIdentifier, res.user, preferredChannel);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Voter Authentication Portal
              </h2>
              <p className="text-xs text-slate-500">
                Academic 2-Factor Credential & OTP Verification
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/60 p-1.5 gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('LOGIN')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              tab === 'LOGIN'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Voter Login
          </button>
          <button
            type="button"
            onClick={() => setTab('REGISTER')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              tab === 'REGISTER'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Voter Registration
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Demo Account Fill Helper */}
              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs space-y-2">
                <span className="font-semibold text-indigo-900 block">
                  Quick Demo Accounts (1-Click Fill):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('voter.elena@student.edu', 'CS-2024-042')}
                    className="px-2.5 py-1 bg-white border border-indigo-200 rounded-md font-medium text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer text-[11px]"
                  >
                    Elena Vance (Unvoted &middot; CS-2024-042)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('voter.alex@student.edu', 'EC-2023-118')}
                    className="px-2.5 py-1 bg-white border border-indigo-200 rounded-md font-medium text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer text-[11px]"
                  >
                    Alex Chen (Already Voted &middot; EC-2023-118)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional ID, Email, or Phone
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-2024-042 or voter.elena@student.edu"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9.5 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter voter password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-9.5 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              {/* Delivery channel radio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Receive OTP Code Via
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredChannel('EMAIL')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      preferredChannel === 'EMAIL'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredChannel('SMS')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      preferredChannel === 'SMS'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>SMS OTP</span>
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <span>Continue to OTP Verification</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student / Institutional ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-2025-104"
                    value={regStudentId}
                    onChange={e => setRegStudentId(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={regDepartment}
                    onChange={e => setRegDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Electronics & Communication</option>
                    <option>Information Technology</option>
                    <option>Mechanical Engineering</option>
                    <option>Biotechnology & Health Sciences</option>
                    <option>Business & Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              {/* Consent checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regAgreeTerms}
                    onChange={e => setRegAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    I certify that this institutional ID belongs to me and I agree to the election terms. I understand that duplicate voting is strictly prohibited and monitored by audit logs.
                  </span>
                </label>
              </div>

              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>{regError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Registering Voter...</span>
                ) : (
                  <span>Create Account & Verify via OTP</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
