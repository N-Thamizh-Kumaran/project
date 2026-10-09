import React, { useState } from 'react';
import { Admin, Election, Candidate, User, ElectionStatus } from '../types';
import {
  getElections,
  createElection,
  updateElection,
  deleteElection,
  getCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getUsers,
  toggleUserVerification,
  toggleUserActive,
  getAnonymousVotes,
  getVotingStatuses,
  getAuditLogs,
  getElectionAnalytics,
  exportResultsToCsv,
  resetDemoState,
} from '../services/storage';
import {
  BarChart3,
  Users,
  Vote,
  Calendar,
  Shield,
  Download,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Award,
  Clock,
  KeyRound,
  FileText,
  UserCheck,
  UserX,
  X,
  Check,
} from 'lucide-react';

interface AdminDashboardProps {
  currentAdmin: Admin;
}

export default function AdminDashboard({ currentAdmin }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ELECTIONS' | 'CANDIDATES' | 'VOTERS' | 'RESULTS' | 'AUDIT'>('OVERVIEW');
  const [refreshKey, setRefreshKey] = useState(0);

  // Data fetching
  const elections = getElections();
  const candidates = getCandidates();
  const users = getUsers();
  const votes = getAnonymousVotes();
  const auditLogs = getAuditLogs();

  // Metrics
  const totalElections = elections.length;
  const activeElections = elections.filter(e => e.status === 'ACTIVE').length;
  const completedElections = elections.filter(e => e.status === 'CLOSED').length;
  const totalVoters = users.length;
  const eligibleVoters = users.filter(u => u.isVerified && u.isActive).length;
  const totalVotesCast = votes.length;
  const overallTurnout = eligibleVoters > 0 ? Math.round((totalVotesCast / eligibleVoters) * 1000) / 10 : 0;

  // Selected Election for Results
  const [selectedResultElectionId, setSelectedResultElectionId] = useState<string>(
    elections.length > 0 ? elections[0].id : ''
  );

  // Search & Filters for Voter Directory
  const [voterSearch, setVoterSearch] = useState('');
  const [voterFilter, setVoterFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING' | 'DISABLED'>('ALL');

  // Search for Audit Logs
  const [auditSearch, setAuditSearch] = useState('');

  // Modals for CRUD
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);

  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [candidateFilterElectionId, setCandidateFilterElectionId] = useState<string>(
    elections.length > 0 ? elections[0].id : ''
  );

  // Form states for Election Modal
  const [elecTitle, setElecTitle] = useState('');
  const [elecDesc, setElecDesc] = useState('');
  const [elecCategory, setElecCategory] = useState<'Student Council' | 'Department' | 'Club' | 'Faculty'>('Student Council');
  const [elecStatus, setElecStatus] = useState<ElectionStatus>('ACTIVE');
  const [elecStartDate, setElecStartDate] = useState('');
  const [elecEndDate, setElecEndDate] = useState('');

  // Form states for Candidate Modal
  const [candName, setCandName] = useState('');
  const [candPosition, setCandPosition] = useState('');
  const [candDepartment, setCandDepartment] = useState('');
  const [candYear, setCandYear] = useState('');
  const [candManifesto, setCandManifesto] = useState('');
  const [candPhotoUrl, setCandPhotoUrl] = useState('');
  const [candElectionId, setCandElectionId] = useState('');

  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleResetDemo = () => {
    if (confirm('Reset database to clean default academic demonstration state?')) {
      resetDemoState();
      triggerRefresh();
      setActionMessage({ type: 'success', text: 'System database restored to initial demo state.' });
    }
  };

  // Open Election Create/Edit
  const handleOpenCreateElection = () => {
    setEditingElection(null);
    setElecTitle('');
    setElecDesc('');
    setElecCategory('Student Council');
    setElecStatus('ACTIVE');
    const now = new Date();
    const end = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    setElecStartDate(now.toISOString().split('T')[0]);
    setElecEndDate(end.toISOString().split('T')[0]);
    setIsElectionModalOpen(true);
  };

  const handleOpenEditElection = (election: Election) => {
    setEditingElection(election);
    setElecTitle(election.title);
    setElecDesc(election.description);
    setElecCategory(election.category);
    setElecStatus(election.status);
    setElecStartDate(new Date(election.startDate).toISOString().split('T')[0]);
    setElecEndDate(new Date(election.endDate).toISOString().split('T')[0]);
    setIsElectionModalOpen(true);
  };

  const handleSaveElection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!elecTitle.trim() || !elecDesc.trim()) {
      alert('Title and description are required.');
      return;
    }

    if (editingElection) {
      updateElection(editingElection.id, {
        title: elecTitle,
        description: elecDesc,
        category: elecCategory,
        status: elecStatus,
        startDate: new Date(elecStartDate).toISOString(),
        endDate: new Date(elecEndDate).toISOString(),
      });
      setActionMessage({ type: 'success', text: `Election "${elecTitle}" updated successfully.` });
    } else {
      createElection({
        title: elecTitle,
        description: elecDesc,
        category: elecCategory,
        status: elecStatus,
        startDate: new Date(elecStartDate).toISOString(),
        endDate: new Date(elecEndDate).toISOString(),
      });
      setActionMessage({ type: 'success', text: `Election "${elecTitle}" created successfully.` });
    }

    setIsElectionModalOpen(false);
    triggerRefresh();
  };

  const handleDeleteElection = (electionId: string) => {
    if (confirm('Are you sure you want to delete this election?')) {
      const res = deleteElection(electionId);
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message });
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
      triggerRefresh();
    }
  };

  // Open Candidate Create/Edit
  const handleOpenAddCandidate = () => {
    setEditingCandidate(null);
    setCandName('');
    setCandPosition('President');
    setCandDepartment('Computer Science');
    setCandYear('Senior');
    setCandManifesto('');
    setCandPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
    setCandElectionId(candidateFilterElectionId || (elections[0]?.id || ''));
    setIsCandidateModalOpen(true);
  };

  const handleOpenEditCandidate = (cand: Candidate) => {
    setEditingCandidate(cand);
    setCandName(cand.name);
    setCandPosition(cand.position);
    setCandDepartment(cand.department);
    setCandYear(cand.year);
    setCandManifesto(cand.manifesto);
    setCandPhotoUrl(cand.photoUrl);
    setCandElectionId(cand.electionId);
    setIsCandidateModalOpen(true);
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName.trim() || !candManifesto.trim()) {
      alert('Name and manifesto are required.');
      return;
    }

    if (editingCandidate) {
      updateCandidate(editingCandidate.id, {
        name: candName,
        position: candPosition,
        department: candDepartment,
        year: candYear,
        manifesto: candManifesto,
        photoUrl: candPhotoUrl,
        electionId: candElectionId,
      });
      setActionMessage({ type: 'success', text: `Candidate "${candName}" updated.` });
    } else {
      addCandidate({
        name: candName,
        position: candPosition,
        department: candDepartment,
        year: candYear,
        manifesto: candManifesto,
        photoUrl: candPhotoUrl,
        electionId: candElectionId,
      });
      setActionMessage({ type: 'success', text: `Candidate "${candName}" registered.` });
    }

    setIsCandidateModalOpen(false);
    triggerRefresh();
  };

  const handleDeleteCandidate = (candId: string) => {
    if (confirm('Delete this candidate from the election?')) {
      const res = deleteCandidate(candId);
      if (res.success) {
        setActionMessage({ type: 'success', text: res.message });
      } else {
        setActionMessage({ type: 'error', text: res.message });
      }
      triggerRefresh();
    }
  };

  // Filtered Voters
  const filteredUsers = users.filter(u => {
    const query = voterSearch.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(query) ||
      u.studentId.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.department.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (voterFilter === 'VERIFIED') return u.isVerified && u.isActive;
    if (voterFilter === 'PENDING') return !u.isVerified;
    if (voterFilter === 'DISABLED') return !u.isActive;
    return true;
  });

  // Filtered Audit Logs
  const filteredLogs = auditLogs.filter(l => {
    const q = auditSearch.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.actorId.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q)
    );
  });

  // Active Result Analytics
  const currentAnalytics = getElectionAnalytics(selectedResultElectionId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Officer Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Authorized Election Officer
            </span>
            <span className="text-xs text-slate-400">&middot;</span>
            <span className="text-xs text-slate-500 font-mono">
              Session ID: {currentAdmin.id}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Academic Election Management Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Officer: {currentAdmin.fullName} &middot; Role: {currentAdmin.role}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDemo}
            className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title="Reset to default demo data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>

          <button
            onClick={handleOpenCreateElection}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Election</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Elections</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block tabular-nums">
            {totalElections}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{activeElections} currently active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Active Ballots</span>
          <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block tabular-nums">
            {activeElections}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{completedElections} concluded</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Registered Voters</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block tabular-nums">
            {totalVoters}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Campus roster</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Verified Voters</span>
          <span className="text-xl font-bold font-mono text-indigo-600 mt-1 block tabular-nums">
            {eligibleVoters}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">ID confirmed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Ballots Cast</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block tabular-nums">
            {totalVotesCast}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Anonymized votes</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Turnout Rate</span>
          <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block tabular-nums">
            {overallTurnout}%
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Campus engagement</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('ELECTIONS')}
          className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'ELECTIONS'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Elections ({elections.length})
        </button>
        <button
          onClick={() => setActiveTab('CANDIDATES')}
          className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'CANDIDATES'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Candidates ({candidates.length})
        </button>
        <button
          onClick={() => setActiveTab('VOTERS')}
          className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'VOTERS'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Voter Directory ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('RESULTS')}
          className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'RESULTS'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Official Results & Analytics
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'AUDIT'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Elections Quick Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Active Elections in Progress
                </h3>
                <span className="text-xs text-indigo-600 font-semibold cursor-pointer" onClick={() => setActiveTab('ELECTIONS')}>
                  Manage all &rarr;
                </span>
              </div>

              <div className="space-y-3">
                {elections.filter(e => e.status === 'ACTIVE').map(election => (
                  <div key={election.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{election.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {election.category} &middot; Ends {new Date(election.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-800 block tabular-nums">
                        {election.totalVotes || 0} votes
                      </span>
                      <button
                        onClick={() => {
                          setSelectedResultElectionId(election.id);
                          setActiveTab('RESULTS');
                        }}
                        className="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                      >
                        View Live Tally
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voter Verification Queue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Voter Verification Roster
                </h3>
                <span className="text-xs text-indigo-600 font-semibold cursor-pointer" onClick={() => setActiveTab('VOTERS')}>
                  View all &rarr;
                </span>
              </div>

              <div className="space-y-2.5">
                {users.slice(0, 4).map(user => (
                  <div key={user.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{user.studentId} &middot; {user.department}</p>
                    </div>
                    <button
                      onClick={() => {
                        toggleUserVerification(user.id);
                        triggerRefresh();
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg cursor-pointer ${
                        user.isVerified
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {user.isVerified ? 'Verified' : 'Approve ID'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ELECTIONS */}
      {activeTab === 'ELECTIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Elections Catalog
              </h3>
              <p className="text-xs text-slate-500">
                Configure voting timelines, activation states, and candidate rosters
              </p>
            </div>
            <button
              onClick={handleOpenCreateElection}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Election</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Title & Category</th>
                  <th className="p-3.5">Voting Window</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Candidates</th>
                  <th className="p-3.5">Votes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {elections.map((elec) => (
                  <tr key={elec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{elec.title}</p>
                      <p className="text-[11px] text-indigo-700 font-medium">{elec.category}</p>
                    </td>
                    <td className="p-3.5 font-mono tabular-nums text-slate-600">
                      {new Date(elec.startDate).toLocaleDateString()} &ndash;{' '}
                      {new Date(elec.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={elec.status}
                        onChange={(e) => {
                          updateElection(elec.id, { status: e.target.value as ElectionStatus });
                          triggerRefresh();
                        }}
                        className="py-1 px-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white cursor-pointer"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800">
                      {elec.candidatesCount || 0}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900 tabular-nums">
                      {elec.totalVotes || 0}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditElection(elec)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit Election"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteElection(elec.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Election"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: CANDIDATES */}
      {activeTab === 'CANDIDATES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Candidates & Contenders
              </h3>
              <p className="text-xs text-slate-500">
                Register candidates and manage candidate profiles per election
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={candidateFilterElectionId}
                onChange={(e) => setCandidateFilterElectionId(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-medium"
              >
                {elections.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.title}
                  </option>
                ))}
              </select>

              <button
                onClick={handleOpenAddCandidate}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Candidate</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates
              .filter(c => !candidateFilterElectionId || c.electionId === candidateFilterElectionId)
              .map((cand) => (
                <div key={cand.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={cand.photoUrl}
                      alt={cand.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {cand.position}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                        {cand.name}
                      </h4>
                      <p className="text-xs text-slate-500">{cand.department} &middot; {cand.year}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    &ldquo;{cand.manifesto}&rdquo;
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditCandidate(cand)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCandidate(cand.id)}
                      className="px-2.5 py-1 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 4: VOTERS DIRECTORY */}
      {activeTab === 'VOTERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Institutional Voter Registry
              </h3>
              <p className="text-xs text-slate-500">
                Approve ID verification and manage voter authorization status
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, email..."
                  value={voterSearch}
                  onChange={e => setVoterSearch(e.target.value)}
                  className="pl-8.5 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-indigo-600 w-full sm:w-64"
                />
              </div>

              <select
                value={voterFilter}
                onChange={e => setVoterFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-medium"
              >
                <option value="ALL">All Voters ({users.length})</option>
                <option value="VERIFIED">Verified Only</option>
                <option value="PENDING">Pending Approval</option>
                <option value="DISABLED">Suspended Accounts</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Student / Institutional ID</th>
                  <th className="p-3.5">Voter Name</th>
                  <th className="p-3.5">Contact Details</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">ID Verification</th>
                  <th className="p-3.5">Account State</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {user.studentId}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {user.fullName}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      <div>{user.email}</div>
                      <div className="font-mono text-[11px] text-slate-400">{user.phone}</div>
                    </td>
                    <td className="p-3.5 text-slate-600">{user.department}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => {
                          toggleUserVerification(user.id);
                          triggerRefresh();
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                          user.isVerified
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {user.isVerified ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => {
                          toggleUserActive(user.id);
                          triggerRefresh();
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          user.isActive
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          toggleUserVerification(user.id);
                          triggerRefresh();
                        }}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      >
                        {user.isVerified ? 'Revoke ID' : 'Approve ID'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: RESULTS & ANALYTICS */}
      {activeTab === 'RESULTS' && (
        <div className="space-y-6">
          {/* Election Selector & Export */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Select Election to Audit
              </label>
              <select
                value={selectedResultElectionId}
                onChange={(e) => setSelectedResultElectionId(e.target.value)}
                className="px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white font-bold text-slate-900 min-w-[280px]"
              >
                {elections.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.title} ({el.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportResultsToCsv(selectedResultElectionId)}
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Export Tabulation (CSV)</span>
              </button>
            </div>
          </div>

          {currentAnalytics ? (
            <div className="space-y-6">
              {/* Turnout Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Eligible Voters</span>
                  <span className="text-xl font-bold font-mono text-slate-900 mt-1 block tabular-nums">
                    {currentAnalytics.totalEligible}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Ballots Cast</span>
                  <span className="text-xl font-bold font-mono text-indigo-600 mt-1 block tabular-nums">
                    {currentAnalytics.totalVotesCast}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Votes Remaining</span>
                  <span className="text-xl font-bold font-mono text-slate-700 mt-1 block tabular-nums">
                    {currentAnalytics.votesRemaining}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Turnout Rate</span>
                  <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block tabular-nums">
                    {currentAnalytics.turnoutPercentage}%
                  </span>
                </div>
              </div>

              {/* Concluded Winner Callout if status is CLOSED */}
              {currentAnalytics.status === 'CLOSED' && currentAnalytics.winnerCandidate && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-800">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Official Election Result Certified
                    </span>
                    <h3 className="text-base font-bold text-amber-950">
                      Winner: {currentAnalytics.winnerCandidate.candidateName}
                    </h3>
                    <p className="text-xs text-amber-900/80">
                      Secured {currentAnalytics.winnerCandidate.votesCount} votes ({currentAnalytics.winnerCandidate.percentage}% of cast ballots) for {currentAnalytics.winnerCandidate.position}.
                    </p>
                  </div>
                </div>
              )}

              {/* Candidate Vote Tally & Percentage Distribution Bars */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-900">
                  Candidate Vote Distribution & Breakdown
                </h3>

                <div className="space-y-4">
                  {currentAnalytics.candidatesResults.map((cand, idx) => (
                    <div key={cand.candidateId} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                          <span className="font-bold text-slate-900 text-sm">{cand.candidateName}</span>
                          <span className="text-slate-400">&middot;</span>
                          <span className="text-slate-500">{cand.department}</span>
                        </div>

                        <div className="flex items-center gap-2 font-mono tabular-nums">
                          <span className="font-bold text-slate-900">{cand.votesCount} votes</span>
                          <span className="text-slate-500 text-xs font-semibold">({cand.percentage}%)</span>
                        </div>
                      </div>

                      {/* Percentage Bar */}
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            idx === 0
                              ? 'bg-indigo-600'
                              : idx === 1
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(cand.percentage, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              No election selected.
            </div>
          )}
        </div>
      )}

      {/* Tab 6: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Immutable Security Audit Logs
              </h3>
              <p className="text-xs text-slate-500">
                Chronological record of authentication, vote submissions, and administrative events
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                className="pl-8.5 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none focus:border-indigo-600 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 font-sans">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Security Event</th>
                  <th className="p-3.5">Actor Role</th>
                  <th className="p-3.5">Actor ID / Recipient</th>
                  <th className="p-3.5">Audit Details</th>
                  <th className="p-3.5">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-slate-500 whitespace-nowrap tabular-nums">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans font-semibold">
                      {log.actorRole}
                    </td>
                    <td className="p-3.5 text-slate-800">
                      {log.actorId}
                    </td>
                    <td className="p-3.5 font-sans text-slate-600 max-w-md">
                      {log.details}
                    </td>
                    <td className="p-3.5 text-slate-400 tabular-nums">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Election Create/Edit Modal */}
      {isElectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingElection ? 'Edit Election' : 'Create New Election'}
              </h3>
              <button
                onClick={() => setIsElectionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveElection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Election Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Senate General Election"
                  value={elecTitle}
                  onChange={e => setElecTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={elecCategory}
                  onChange={e => setElecCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="Student Council">Student Council</option>
                  <option value="Department">Department</option>
                  <option value="Club">Club</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Election purpose, eligibility, and rules..."
                  value={elecDesc}
                  onChange={e => setElecDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={elecStartDate}
                    onChange={e => setElecStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={elecEndDate}
                    onChange={e => setElecEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Election Status
                </label>
                <select
                  value={elecStatus}
                  onChange={e => setElecStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 bg-white font-semibold"
                >
                  <option value="DRAFT">DRAFT (Drafting)</option>
                  <option value="UPCOMING">UPCOMING (Pre-announcement)</option>
                  <option value="ACTIVE">ACTIVE (Voting Open)</option>
                  <option value="CLOSED">CLOSED (Concluded)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsElectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  {editingElection ? 'Save Changes' : 'Create Election'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      {isCandidateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingCandidate ? 'Edit Candidate' : 'Add Candidate'}
              </h3>
              <button
                onClick={() => setIsCandidateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Election
                </label>
                <select
                  value={candElectionId}
                  onChange={e => setCandElectionId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600 bg-white"
                >
                  {elections.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Sterling"
                  value={candName}
                  onChange={e => setCandName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Position / Office
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Council President"
                    value={candPosition}
                    onChange={e => setCandPosition(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={candDepartment}
                    onChange={e => setCandDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Final Year (Senior)"
                  value={candYear}
                  onChange={e => setCandYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campaign Manifesto
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Key pledges, goals, and student representation promises..."
                  value={candManifesto}
                  onChange={e => setCandManifesto(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={candPhotoUrl}
                  onChange={e => setCandPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCandidateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  {editingCandidate ? 'Save Candidate' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
