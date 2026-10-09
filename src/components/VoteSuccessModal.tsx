import { CheckCircle2, ShieldCheck, Download, Printer, ArrowRight, Lock, Hash } from 'lucide-react';

interface VoteSuccessModalProps {
  isOpen: boolean;
  electionTitle: string;
  receiptCode: string;
  timestamp: string;
  onClose: () => void;
}

export default function VoteSuccessModal({
  isOpen,
  electionTitle,
  receiptCode,
  timestamp,
  onClose,
}: VoteSuccessModalProps) {
  if (!isOpen) return null;

  const formattedDate = new Date(timestamp).toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const textContent = `SECURE ONLINE VOTING SYSTEM - BALLOT RECEIPT
===================================================
THANK YOU FOR VOTING!
Your vote has been officially recorded in the election.

Project: Ensuring Authenticity through OTP Verification
Institution: Academic Campus Election Board

Status: CONFIRMED & DEPOSITED
Election: ${electionTitle}
Receipt Reference: ${receiptCode}
Timestamp: ${formattedDate}

PRIVACY GUARANTEE:
In compliance with cryptographic secret-ballot privacy standards,
your chosen candidate is NOT recorded on this receipt nor linked
to your voter profile in the system database.

Verification Hash: SHA256-ANON-BALLOT-VALIDATED
===================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ballot_Receipt_${receiptCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top green confirmation bar */}
        <div className="bg-emerald-600 p-6 text-white text-center">
          <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Thank you for voting!</h2>
          <p className="text-emerald-100 text-xs mt-1.5 font-medium">
            Your vote has been successfully recorded and anonymously deposited.
          </p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans">Election</span>
              <span className="font-semibold text-slate-900 font-sans text-right max-w-[240px]">
                {electionTitle}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans">Receipt Reference ID</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-sm tracking-wider">
                {receiptCode}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans">Timestamp</span>
              <span className="text-slate-800 tabular-nums">
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-sans">Ballot Security</span>
              <span className="text-emerald-700 font-semibold font-sans flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Decoupled & Encrypted
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-950 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Voter Privacy Guarantee</p>
              <p className="text-slate-600 mt-0.5">
                Notice: Your selected candidate is deliberately <strong>not shown</strong> on this receipt. In accordance with voting system privacy rules, voter identities are recorded separately from cast ballots.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              onClick={handleDownload}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Slip (.txt)</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Return to Voter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
