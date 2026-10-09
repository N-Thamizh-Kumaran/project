import { useState, useEffect } from 'react';
import { SimulatedMessage } from '../types';
import { getSimulatedMessages } from '../services/storage';
import { Mail, Smartphone, Copy, Check, Trash2, X, RefreshCw, ShieldCheck } from 'lucide-react';

interface SimulatedInboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoFillOtp?: (code: string) => void;
}

export default function SimulatedInboxDrawer({
  isOpen,
  onClose,
  onAutoFillOtp,
}: SimulatedInboxDrawerProps) {
  const [messages, setMessages] = useState<SimulatedMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshMessages = () => {
    setMessages(getSimulatedMessages());
  };

  useEffect(() => {
    if (isOpen) {
      refreshMessages();
    }
  }, [isOpen]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onAutoFillOtp) {
      onAutoFillOtp(code);
    }
  };

  const handleClear = () => {
    localStorage.setItem('sovs_simulated_inbox_v2', JSON.stringify([]));
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Simulated Gateway Inbox
              </h3>
              <p className="text-[11px] text-slate-500">
                Academic Development Mode OTP Dispatcher
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={refreshMessages}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/60 cursor-pointer"
              title="Refresh Inbox"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
              title="Clear Inbox"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice */}
        <div className="p-3 bg-indigo-50/70 border-b border-indigo-100/60 text-xs text-indigo-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p>
            In production, OTPs are delivered via external Twilio SMS or institutional SMTP. Here, simulated deliveries are captured for testing and academic grading.
          </p>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Mail className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No OTP messages yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Trigger a voter login or registration to simulate an SMS/Email OTP delivery.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const sentDate = new Date(msg.sentAt).toLocaleTimeString();
              const isCopied = copiedId === msg.id;

              return (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 transition-colors shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      {msg.channel === 'SMS' ? (
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      )}
                      {msg.channel} &middot; {msg.recipient}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums">{sentDate}</span>
                  </div>

                  <div className="bg-slate-50 rounded p-2.5 border border-slate-100 text-xs font-mono text-slate-700 leading-relaxed break-words mb-3">
                    {msg.content}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">OTP Code:</span>
                      <span className="text-sm font-bold font-mono tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {msg.otpCode}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(msg.otpCode, msg.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900 text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy & Fill</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex justify-between items-center">
          <span>AES-256 / SHA-256 Mocked Engine</span>
          <span className="font-mono">Retention: 20 msgs</span>
        </div>
      </div>
    </div>
  );
}
