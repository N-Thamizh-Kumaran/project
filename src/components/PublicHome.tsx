import { Election, User } from '../types';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Vote,
  Calendar,
  ChevronRight,
  Sparkles,
  Award,
  Users,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface PublicHomeProps {
  elections: Election[];
  onOpenAuth: () => void;
  onOpenAdminAuth: () => void;
  onOpenDocs: () => void;
  onQuickLoginVoter: (email: string, studentId: string) => void;
  onQuickLoginAdmin: () => void;
  onSelectElection: (election: Election) => void;
}

export default function PublicHome({
  elections,
  onOpenAuth,
  onOpenAdminAuth,
  onOpenDocs,
  onQuickLoginVoter,
  onQuickLoginAdmin,
  onSelectElection,
}: PublicHomeProps) {
  const activeElections = elections.filter(e => e.status === 'ACTIVE');

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Academic Mini-Project Prototype &middot; Campus &amp; Club Elections</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Secure Online Voting System
        </h1>

        <p className="text-lg sm:text-xl font-medium text-indigo-700 max-w-2xl mx-auto">
          Ensuring Authenticity through OTP Verification
        </p>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A modern, transparent election platform designed for student councils, university clubs, and institutional associations. Authenticate via institutional credentials and a temporary 6-digit OTP, ensuring one vote per eligible voter with complete secret-ballot privacy.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Vote className="w-4 h-4 text-indigo-400" />
            <span>Cast Your Ballot</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Academic Docs &amp; Architecture</span>
          </button>
        </div>

        {/* Evaluator Quick Launch Bar */}
        <div className="max-w-3xl mx-auto mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs text-xs space-y-3">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-bold flex items-center gap-1.5 text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Evaluator 1-Click Role Switcher:
            </span>
            <span className="text-[11px] text-slate-400">
              Test full authentication without typing credentials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => onQuickLoginVoter('voter.elena@student.edu', 'CS-2024-042')}
              className="p-2.5 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs group-hover:text-indigo-600">
                  Elena Vance
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Unvoted
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: CS-2024-042</p>
            </button>

            <button
              onClick={() => onQuickLoginVoter('voter.alex@student.edu', 'EC-2023-118')}
              className="p-2.5 bg-white border border-slate-200 hover:border-amber-400 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs group-hover:text-amber-700">
                  Alex Chen
                </span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                  Already Voted
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID: EC-2023-118</p>
            </button>

            <button
              onClick={onQuickLoginAdmin}
              className="p-2.5 bg-white border border-slate-200 hover:border-slate-800 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs group-hover:text-slate-700">
                  Dr. Sarah Jenkins
                </span>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                  Admin Officer
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Super Admin Console</p>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Security & Authenticity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Core Security Architecture
          </h2>
          <p className="text-xs text-slate-500">
            Engineered around four principles of authenticity, privacy, and integrity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              2-Factor OTP Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every voter must authenticate with institutional credentials plus a short-lived 6-digit OTP (300s expiration, 3 attempt lockout), preventing impersonation.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Decoupled Anonymous Ballot
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Voter identity and candidate selection are strictly stored in separated relational tables. Even administrators cannot trace who voted for whom.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              One-Vote-Per-Voter Constraint
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unique database constraints on <code>(election_id, voter_id)</code> guarantee that each verified voter can submit their ballot exactly once.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Audit Logging &amp; Receipts
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Voters receive an unforgeable confirmation reference ID (e.g. <code>VOTE-REC-2026-X8F93A</code>) while all critical events are chronologically audited.
            </p>
          </div>
        </div>
      </section>

      {/* Active Elections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Currently Active Campus Elections
            </h2>
            <p className="text-xs text-slate-500">
              Verified voters may login to cast anonymous ballots
            </p>
          </div>
          <button
            onClick={onOpenAuth}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Access Voter Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeElections.map((election) => (
            <div
              key={election.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {election.category}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Open Ballot
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {election.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {election.description}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Voting Ends:
                    </span>
                    <span className="font-mono text-slate-800">
                      {new Date(election.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Candidates:</span>
                    <span className="font-semibold text-slate-800">
                      {election.candidatesCount || 0} Registered
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <button
                  onClick={() => onSelectElection(election)}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Vote className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Vote in this Election</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-slate-50 py-10 rounded-3xl border border-slate-200/80">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">
            How The Voting System Works
          </h2>
          <p className="text-xs text-slate-500">
            Four simple steps from institutional sign-in to verified receipt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold font-mono text-indigo-600 block">
              Step 01
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Institutional Login
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Voter logs in using their registered student ID or email along with their secure password.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold font-mono text-indigo-600 block">
              Step 02
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              OTP Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A 6-digit one-time passcode is dispatched to their email or mobile phone with a 5-minute expiry timer.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold font-mono text-indigo-600 block">
              Step 03
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Anonymous Ballot
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Voter reviews candidate manifestos, selects their candidate, and confirms their vote choice.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold font-mono text-indigo-600 block">
              Step 04
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Receipt &amp; Audit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              System records participation, deposits the anonymous vote, and produces a cryptographic confirmation receipt.
            </p>
          </div>
        </div>
      </section>

      {/* Scope Limitations Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-amber-950 text-sm">
              Academic Project Scope Statement
            </h3>
            <p className="text-slate-600 max-w-3xl leading-relaxed">
              This application has been developed as an academic software engineering mini-project demonstrating two-factor authentication, database integrity, and secret ballot decoupling. It is intended for small and medium-scale campus environments (colleges, universities, student bodies, associations) and does NOT claim compliance for government or national general elections.
            </p>
          </div>

          <button
            onClick={onOpenDocs}
            className="px-4 py-2 font-bold text-amber-950 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            Read Specifications
          </button>
        </div>
      </section>
    </div>
  );
}
