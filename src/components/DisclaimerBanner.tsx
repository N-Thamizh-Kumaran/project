import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <p className="font-medium text-amber-950">
            <span className="font-bold">Academic Mini-Project Prototype:</span> Designed for small/medium-scale elections (e.g., student councils, campus clubs, local associations).
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 transition-colors cursor-pointer"
          >
            <span>{expanded ? 'Hide Scope Limitations' : 'View Scope Limitations'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto px-4 pb-3 pt-1 text-slate-700 text-xs border-t border-amber-500/15">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <p className="font-semibold text-slate-900 mb-0.5">Target Use Case</p>
              <p className="text-slate-600">
                Institutional student bodies, university departments, student unions, and community clubs with authenticated member rosters.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-0.5">Explicit System Boundary</p>
              <p className="text-slate-600">
                This academic prototype does NOT claim compliance with national election standards or high-stakes civic ballot requirements.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-0.5">Security Architecture</p>
              <p className="text-slate-600">
                Implements OTP dual-factor authorization, separate anonymous ballot box tables, audit logging, and single-vote transaction enforcement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
