import React, { useState } from 'react';
import { Admin } from '../types';
import { logAuditEvent } from '../services/storage';
import { Shield, Lock, User as UserIcon, X, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (admin: Admin) => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminLoginModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setIdentifier('admin@campus.edu');
    setPassword('Admin@2026');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Validate credentials against default admin
      const isUsernameMatch =
        identifier.trim().toLowerCase() === 'admin' ||
        identifier.trim().toLowerCase() === 'admin@campus.edu';
      const isPasswordMatch = password === 'Admin@2026';

      if (isUsernameMatch && isPasswordMatch) {
        const admin: Admin = {
          id: 'admin-01',
          username: 'admin',
          email: 'admin@campus.edu',
          fullName: 'Dr. Sarah Jenkins',
          role: 'SUPER_ADMIN',
        };

        logAuditEvent(
          'ADMIN_LOGIN_SUCCESS',
          'ADMIN',
          'admin-01 (Dr. Sarah Jenkins)',
          'Authenticated to administrator console via privileged credentials.'
        );

        setLoading(false);
        onSuccess(admin);
      } else {
        setLoading(false);
        setError('Invalid administrative credentials. Use the demo credentials provided below.');
        logAuditEvent(
          'ADMIN_LOGIN_FAILED',
          'ADMIN',
          identifier,
          'Unauthorized attempt to access admin console.'
        );
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Election Officer Portal
              </h2>
              <p className="text-xs text-slate-500">
                Authorized Administrator Sign In
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Demo Autofill Callout */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Demo Officer Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="font-semibold text-amber-900 underline hover:text-amber-950 cursor-pointer"
              >
                1-Click Autofill
              </button>
            </div>
            <p className="text-amber-900 font-mono text-[11px]">
              Email: admin@campus.edu &middot; Pass: Admin@2026
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Officer Email or Username
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="admin@campus.edu"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full pl-9.5 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9.5 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating Officer...</span>
            ) : (
              <span>Sign In to Admin Console</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
