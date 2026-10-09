import { useState } from 'react';
import { User, Election } from '../types';
import { getElections, hasUserVoted, getUserVotingRecord } from '../services/storage';
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  Hash,
  ChevronRight,
  Info,
} from 'lucide-react';

interface VoterDashboardProps {
  currentUser: User;
  onSelectElectionToVote: (election: Election) => void;
  onViewReceipt: (electionTitle: string, receiptCode: string, timestamp: string) => void;
}

export default function VoterDashboard({
  currentUser,
  onSelectElectionToVote,
  onViewReceipt,
}: VoterDashboardProps) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'UPCOMING' | 'CLOSED'>('ALL');
  const elections = getElections();

  const filteredElections = elections.filter(e => {
    if (filter === 'ALL') return true;
    return e.status === filter;
  });

  const activeCount = elections.filter(e => e.status === 'ACTIVE').length;
  const completedCount = elections.filter(e => e.status === 'CLOSED').length;
  const upcomingCount = elections.filter(e => e.status === 'UPCOMING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Voter Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {currentUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome, {currentUser.fullName}
                </h1>
                {currentUser.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Voter
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1 font-mono">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  ID: <strong className="text-slate-800">{currentUser.studentId}</strong>
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.department}
                </span>
                <span>&middot;</span>
                <span>{currentUser.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-w-[90px] text-center">
              <span className="text-[11px] text-slate-500 block">Active</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {activeCount}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-w-[90px] text-center">
              <span className="text-[11px] text-slate-500 block">Upcoming</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {upcomingCount}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 min-w-[90px] text-center">
              <span className="text-[11px] text-slate-500 block">Completed</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {completedCount}
              </span>
            </div>
          </div>
        </div>

        {!currentUser.isVerified && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Your account registration is awaiting confirmation by the Election Officer. You can browse active elections, but casting ballots requires institutional ID verification.
            </p>
          </div>
        )}
      </div>

      {/* Elections Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Campus Elections & Ballots
            </h2>
            <p className="text-xs text-slate-500">
              Participate in active ballots and review past election records
            </p>
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Elections
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'ACTIVE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('UPCOMING')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'UPCOMING'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setFilter('CLOSED')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'CLOSED'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concluded ({completedCount})
            </button>
          </div>
        </div>

        {/* Elections Grid */}
        {filteredElections.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Vote className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-slate-700">No elections match the filter</p>
            <p className="text-xs text-slate-400 mt-1">Try switching to &quot;All Elections&quot; to see available records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredElections.map((election) => {
              const voted = hasUserVoted(election.id, currentUser.id);
              const record = voted ? getUserVotingRecord(election.id, currentUser.id) : null;

              return (
                <div
                  key={election.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {election.category}
                      </span>

                      {election.status === 'ACTIVE' ? (
                        <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active Voting
                        </span>
                      ) : election.status === 'UPCOMING' ? (
                        <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                          Upcoming
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          Concluded
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {election.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {election.description}
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          End Date:
                        </span>
                        <span className="font-mono text-slate-800">
                          {new Date(election.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Candidates:</span>
                        <span className="font-semibold text-slate-800">
                          {election.candidatesCount || 0} Contenders
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                    {voted ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                          <span className="font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Ballot Cast
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {record?.receiptCode ? record.receiptCode.slice(0, 16) : 'Recorded'}
                          </span>
                        </div>

                        {record && (
                          <button
                            onClick={() =>
                              onViewReceipt(election.title, record.receiptCode, record.votedAt)
                            }
                            className="w-full py-1.5 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>View Ballot Receipt</span>
                          </button>
                        )}
                      </div>
                    ) : election.status === 'ACTIVE' ? (
                      <button
                        onClick={() => onSelectElectionToVote(election)}
                        disabled={!currentUser.isVerified}
                        className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Vote className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Cast Your Vote</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : election.status === 'UPCOMING' ? (
                      <div className="text-center py-1.5 text-xs text-slate-500 font-medium">
                        Voting opens {new Date(election.startDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-center py-1.5 text-xs text-slate-500 font-medium">
                        Election has concluded
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
