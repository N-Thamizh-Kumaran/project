import { useState } from 'react';
import { Election, Candidate, User } from '../types';
import { getCandidatesByElection, castVote, hasUserVoted } from '../services/storage';
import {
  Vote,
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  User as UserIcon,
  HelpCircle,
  Award,
} from 'lucide-react';

interface BallotViewProps {
  election: Election;
  voter: User;
  onBack: () => void;
  onVoteCastSuccess: (receiptCode: string, timestamp: string) => void;
}

export default function BallotView({
  election,
  voter,
  onBack,
  onVoteCastSuccess,
}: BallotViewProps) {
  const candidates = getCandidatesByElection(election.id);
  const alreadyVoted = hasUserVoted(election.id, voter.id);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  const handleOpenConfirm = () => {
    if (!selectedCandidateId) {
      setErrorMessage('Please select one candidate before proceeding to submit.');
      return;
    }
    setErrorMessage(null);
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!selectedCandidateId) return;

    setSubmitting(true);
    setErrorMessage(null);

    const result = await castVote({
      electionId: election.id,
      voter,
      candidateId: selectedCandidateId,
    });

    setSubmitting(false);

    if (result.success && result.receiptCode) {
      setShowConfirmModal(false);
      onVoteCastSuccess(result.receiptCode, new Date().toISOString());
    } else {
      setShowConfirmModal(false);
      setErrorMessage(result.error || 'Failed to submit vote. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Voter Dashboard</span>
        </button>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>Voter ID:</span>
          <span className="font-mono font-semibold text-slate-800">{voter.studentId}</span>
          <span>&middot;</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authenticated Session
          </span>
        </div>
      </div>

      {/* Election Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
            {election.category}
          </span>
          <div className="flex items-center gap-1.5 font-mono tabular-nums">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Voting Window: {new Date(election.startDate).toLocaleDateString()} &ndash;{' '}
              {new Date(election.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">{election.title}</h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {election.description}
          </p>
        </div>

        {/* Voting Rules Reassurance */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-600 shrink-0" />
            <span>
              <strong>Cryptographic Secret Ballot:</strong> Your vote is decoupled from your identity. Nobody, including the system administrator, can trace your choice back to your account.
            </span>
          </div>
          <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
            One Vote Only
          </span>
        </div>
      </div>

      {/* Already Voted Banner if applicable */}
      {alreadyVoted ? (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="text-lg font-bold">You Have Already Voted in this Election</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            Our system has recorded your participation in the voter registry to prevent duplicate voting. Your ballot has already been anonymized and counted.
          </p>
          <div className="pt-2">
            <button
              onClick={onBack}
              className="px-4 py-2 text-xs font-semibold bg-white border border-amber-300 text-amber-900 rounded-lg hover:bg-amber-100/50 cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Candidates Selection Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Official Candidates ({candidates.length})
              </h2>
              <span className="text-xs text-slate-500">
                Select exactly one candidate
              </span>
            </div>

            {candidates.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                No candidates have been registered for this election yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {candidates.map((candidate) => {
                  const isSelected = selectedCandidateId === candidate.id;

                  return (
                    <div
                      key={candidate.id}
                      onClick={() => setSelectedCandidateId(candidate.id)}
                      className={`relative bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Selection Top Indicator */}
                      <div className="p-4 pb-0 flex items-start justify-between">
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {candidate.position}
                        </span>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      {/* Candidate Avatar & Bio */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={candidate.photoUrl}
                            alt={candidate.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Resilient fallback container if external host blocked
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">
                              {candidate.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {candidate.department}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {candidate.year}
                            </p>
                          </div>
                        </div>

                        {/* Manifesto Excerpt */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex-1">
                          <p className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            Campaign Manifesto
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                            &ldquo;{candidate.manifesto}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Select Button at card bottom */}
                      <div className="p-3 bg-slate-50/80 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidateId(candidate.id);
                          }}
                          className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? 'Candidate Selected' : 'Choose this Candidate'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submission Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {selectedCandidate ? (
                <div className="text-xs">
                  <span className="text-slate-500">Currently Selected: </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedCandidate.name}
                  </span>
                  <span className="text-slate-400 block mt-0.5">
                    Position: {selectedCandidate.position} &middot; {selectedCandidate.department}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Please click on a candidate card above to make your selection.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 sm:flex-none py-2.5 px-4 text-xs font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleOpenConfirm}
                disabled={!selectedCandidateId}
                className="flex-1 sm:flex-none py-2.5 px-6 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Vote className="w-4 h-4 text-indigo-400" />
                <span>Submit My Ballot</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Ballot Submission
                </h3>
                <p className="text-xs text-slate-500">
                  Permanent democratic decision
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700">
                Are you sure you want to submit your vote for:
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="text-base font-bold text-slate-900">
                  {selectedCandidate.name}
                </p>
                <p className="text-xs text-indigo-700 font-medium">
                  {selectedCandidate.position}
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedCandidate.department} &middot; {selectedCandidate.year}
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  Irreversible Action Warning:
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Once submitted, your vote is recorded in the anonymous ballot box and your voter ID is flagged as having voted. <strong>This vote cannot be changed, re-submitted, or canceled.</strong>
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <span>Depositing Ballot...</span>
                  ) : (
                    <span>Yes, Submit My Vote</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
