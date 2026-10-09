import {
  User,
  Admin,
  Election,
  Candidate,
  VotingStatusRecord,
  AnonymousVote,
  OtpVerificationRecord,
  AuditLog,
  SimulatedMessage,
  ElectionAnalytics,
  ElectionResultItem,
} from '../types';

// Storage Keys
const USERS_KEY = 'sovs_users_v2';
const ADMINS_KEY = 'sovs_admins_v2';
const ELECTIONS_KEY = 'sovs_elections_v2';
const CANDIDATES_KEY = 'sovs_candidates_v2';
const VOTING_STATUS_KEY = 'sovs_voting_status_v2';
const VOTES_KEY = 'sovs_anonymous_votes_v2';
const OTP_RECORDS_KEY = 'sovs_otp_records_v2';
const AUDIT_LOGS_KEY = 'sovs_audit_logs_v2';
const SIMULATED_INBOX_KEY = 'sovs_simulated_inbox_v2';

// Cryptographic hash helper (SHA-256)
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate random receipt code
export function generateReceiptCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let segment = '';
  for (let i = 0; i < 6; i++) {
    segment += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `VOTE-REC-${year}-${segment}`;
}

// Generate 6 digit numeric OTP
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Default Seed Data
const DEFAULT_ADMIN: Admin = {
  id: 'admin-01',
  username: 'admin',
  email: 'admin@campus.edu',
  fullName: 'Dr. Sarah Jenkins',
  role: 'SUPER_ADMIN',
};

const DEFAULT_USERS: User[] = [
  {
    id: 'user-01',
    fullName: 'Elena Vance',
    studentId: 'CS-2024-042',
    email: 'voter.elena@student.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science & Engineering',
    isVerified: true,
    isActive: true,
    registeredAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'user-02',
    fullName: 'Alex Chen',
    studentId: 'EC-2023-118',
    email: 'voter.alex@student.edu',
    phone: '+1 (555) 345-6789',
    department: 'Electronics & Communication',
    isVerified: true,
    isActive: true,
    registeredAt: '2026-09-16T11:30:00Z',
  },
  {
    id: 'user-03',
    fullName: 'Jordan Taylor',
    studentId: 'ME-2024-089',
    email: 'jordan.taylor@student.edu',
    phone: '+1 (555) 456-7890',
    department: 'Mechanical Engineering',
    isVerified: false, // Pending verification demo
    isActive: true,
    registeredAt: '2026-10-01T08:15:00Z',
  },
  {
    id: 'user-04',
    fullName: 'Maya Patel',
    studentId: 'IT-2025-015',
    email: 'maya.patel@student.edu',
    phone: '+1 (555) 567-8901',
    department: 'Information Technology',
    isVerified: true,
    isActive: true,
    registeredAt: '2026-09-20T14:40:00Z',
  },
  {
    id: 'user-05',
    fullName: 'Liam O\'Connor',
    studentId: 'BT-2023-064',
    email: 'liam.oconnor@student.edu',
    phone: '+1 (555) 678-9012',
    department: 'Biotechnology',
    isVerified: true,
    isActive: false, // Disabled account demo
    registeredAt: '2026-09-22T09:10:00Z',
  },
];

const DEFAULT_ELECTIONS: Election[] = [
  {
    id: 'elec-01',
    title: 'Student Council General Election 2026',
    description: 'Annual democratic election to elect the Student Council President representing 4,500 students across undergraduate and postgraduate faculties.',
    category: 'Student Council',
    status: 'ACTIVE',
    startDate: '2026-10-01T08:00:00Z',
    endDate: '2026-10-31T20:00:00Z',
    createdAt: '2026-09-25T12:00:00Z',
  },
  {
    id: 'elec-02',
    title: 'Computer Science Club Executive Election',
    description: 'Elections for the Technical Club Secretary overseeing hackathons, guest seminars, and open source campus projects.',
    category: 'Club',
    status: 'ACTIVE',
    startDate: '2026-10-05T09:00:00Z',
    endDate: '2026-10-25T18:00:00Z',
    createdAt: '2026-10-01T15:00:00Z',
  },
  {
    id: 'elec-03',
    title: 'Inter-College Sports Committee Representative',
    description: 'Selection of student sports committee representative for inter-university athletic meets and facility governance.',
    category: 'Faculty',
    status: 'UPCOMING',
    startDate: '2026-11-01T08:00:00Z',
    endDate: '2026-11-05T18:00:00Z',
    createdAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'elec-04',
    title: 'Alumni Association Student Liaison 2025',
    description: 'Concluded election for student liaison coordinator with the global alumni network and endowment program.',
    category: 'Student Council',
    status: 'CLOSED',
    startDate: '2025-11-10T08:00:00Z',
    endDate: '2025-11-15T18:00:00Z',
    createdAt: '2025-11-01T10:00:00Z',
  },
];

const DEFAULT_CANDIDATES: Candidate[] = [
  // Candidates for Student Council General Election (elec-01)
  {
    id: 'cand-01',
    electionId: 'elec-01',
    name: 'Candidate A: Elena Vance',
    position: 'Student Council President',
    department: 'Computer Science & Engineering',
    year: 'Final Year (Senior)',
    manifesto: 'Promoting student welfare, transparent budgeting of campus activity funds, 24/7 access to library collaborative workspaces, and subsidized student transit passes.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'cand-02',
    electionId: 'elec-01',
    name: 'Candidate B: Marcus Sterling',
    position: 'Student Council President',
    department: 'Business & Management',
    year: 'Third Year (Junior)',
    manifesto: 'Focusing on green campus initiatives, solar-powered study hubs, expanding mental health counselling walk-in hours, and organizing campus career incubation fairs.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'cand-03',
    electionId: 'elec-01',
    name: 'Candidate C: Priya Sharma',
    position: 'Student Council President',
    department: 'Biotechnology & Health Sciences',
    year: 'Final Year (Senior)',
    manifesto: 'Dedicated to interdisciplinary research grants for undergraduates, modern cafeteria nutrition standards, and equal athletic equipment funding for women teams.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
  // Candidates for CS Club (elec-02)
  {
    id: 'cand-04',
    electionId: 'elec-02',
    name: 'David Kim',
    position: 'Technical Club Secretary',
    department: 'Information Technology',
    year: 'Third Year',
    manifesto: 'Hosting monthly weekend game jams, cloud certification study circles, and pairing freshmen with senior software industry mentors.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'cand-05',
    electionId: 'elec-02',
    name: 'Sophia Rodriguez',
    position: 'Technical Club Secretary',
    department: 'Computer Science',
    year: 'Second Year',
    manifesto: 'Increasing algorithmic competitive programming workshops, open-source sponsorship for student tools, and women in tech leadership panels.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
  // Candidates for Concluded Election (elec-04)
  {
    id: 'cand-06',
    electionId: 'elec-04',
    name: 'Liam Zhang',
    position: 'Alumni Liaison',
    department: 'Mechanical Engineering',
    year: 'Graduate',
    manifesto: 'Secured 35 paid summer mentorship internships across top engineering consultancies.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'cand-07',
    electionId: 'elec-04',
    name: 'Aisha Al-Mansoor',
    position: 'Alumni Liaison',
    department: 'Economics',
    year: 'Graduate',
    manifesto: 'Established young alumni networking mixers in New York, London, and Singapore.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
];

// Pre-existing voting statuses (e.g. Alex Chen has already voted in Student Council)
const DEFAULT_VOTING_STATUS: VotingStatusRecord[] = [
  {
    id: 'vs-01',
    electionId: 'elec-01',
    voterId: 'user-02', // Alex Chen
    studentId: 'EC-2023-118',
    hasVoted: true,
    votedAt: '2026-10-06T14:22:10Z',
    receiptCode: 'VOTE-REC-2026-K7M9X4',
  },
  {
    id: 'vs-02',
    electionId: 'elec-04',
    voterId: 'user-01',
    studentId: 'CS-2024-042',
    hasVoted: true,
    votedAt: '2025-11-12T10:15:00Z',
    receiptCode: 'VOTE-REC-2025-Q3P8W1',
  },
  {
    id: 'vs-03',
    electionId: 'elec-04',
    voterId: 'user-02',
    studentId: 'EC-2023-118',
    hasVoted: true,
    votedAt: '2025-11-12T11:45:00Z',
    receiptCode: 'VOTE-REC-2025-T9L2R5',
  },
];

// Anonymous ballots (Notice: NO voterId or studentId here!)
const DEFAULT_ANONYMOUS_VOTES: AnonymousVote[] = [
  {
    id: 'vote-01',
    electionId: 'elec-01',
    candidateId: 'cand-02', // 1 vote for Marcus Sterling
    ballotToken: 'ballot_token_e6d42189a0f4',
    timestamp: '2026-10-06T14:22:10Z',
  },
  {
    id: 'vote-02',
    electionId: 'elec-04',
    candidateId: 'cand-06',
    ballotToken: 'ballot_token_c8192a34bb12',
    timestamp: '2025-11-12T10:15:00Z',
  },
  {
    id: 'vote-03',
    electionId: 'elec-04',
    candidateId: 'cand-06',
    ballotToken: 'ballot_token_f9019aa12cc3',
    timestamp: '2025-11-12T11:45:00Z',
  },
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-10-01T08:00:00Z',
    action: 'ELECTION_STATUS_CHANGED',
    actorRole: 'ADMIN',
    actorId: 'admin-01 (Dr. Sarah Jenkins)',
    details: 'Election "Student Council General Election 2026" transitioned from UPCOMING to ACTIVE.',
    ipAddress: '192.168.1.10',
  },
  {
    id: 'log-02',
    timestamp: '2026-10-06T14:20:05Z',
    action: 'VOTER_LOGIN_OTP_REQUESTED',
    actorRole: 'VOTER',
    actorId: 'EC-2023-118',
    details: '6-digit OTP dispatched to registered email voter.alex@student.edu (Expires in 300s).',
    ipAddress: '10.0.4.88',
  },
  {
    id: 'log-03',
    timestamp: '2026-10-06T14:21:12Z',
    action: 'VOTER_OTP_VERIFIED',
    actorRole: 'VOTER',
    actorId: 'EC-2023-118',
    details: 'Successful two-factor OTP authentication. Session token issued.',
    ipAddress: '10.0.4.88',
  },
  {
    id: 'log-04',
    timestamp: '2026-10-06T14:22:10Z',
    action: 'BALLOT_CAST_SUCCESS',
    actorRole: 'VOTER',
    actorId: 'EC-2023-118 (Voter Participation Recorded)',
    details: 'Decoupled ballot token recorded in election elec-01. Receipt VOTE-REC-2026-K7M9X4 generated.',
    ipAddress: '10.0.4.88',
  },
];

// Initialize Storage if empty
export function initStorage(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(ADMINS_KEY)) {
    localStorage.setItem(ADMINS_KEY, JSON.stringify([DEFAULT_ADMIN]));
  }
  if (!localStorage.getItem(ELECTIONS_KEY)) {
    localStorage.setItem(ELECTIONS_KEY, JSON.stringify(DEFAULT_ELECTIONS));
  }
  if (!localStorage.getItem(CANDIDATES_KEY)) {
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(DEFAULT_CANDIDATES));
  }
  if (!localStorage.getItem(VOTING_STATUS_KEY)) {
    localStorage.setItem(VOTING_STATUS_KEY, JSON.stringify(DEFAULT_VOTING_STATUS));
  }
  if (!localStorage.getItem(VOTES_KEY)) {
    localStorage.setItem(VOTES_KEY, JSON.stringify(DEFAULT_ANONYMOUS_VOTES));
  }
  if (!localStorage.getItem(AUDIT_LOGS_KEY)) {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(DEFAULT_AUDIT_LOGS));
  }
  if (!localStorage.getItem(SIMULATED_INBOX_KEY)) {
    localStorage.setItem(SIMULATED_INBOX_KEY, JSON.stringify([]));
  }
}

// Reset Storage to clean Demo State
export function resetDemoState(): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  localStorage.setItem(ADMINS_KEY, JSON.stringify([DEFAULT_ADMIN]));
  localStorage.setItem(ELECTIONS_KEY, JSON.stringify(DEFAULT_ELECTIONS));
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(DEFAULT_CANDIDATES));
  localStorage.setItem(VOTING_STATUS_KEY, JSON.stringify(DEFAULT_VOTING_STATUS));
  localStorage.setItem(VOTES_KEY, JSON.stringify(DEFAULT_ANONYMOUS_VOTES));
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(DEFAULT_AUDIT_LOGS));
  localStorage.setItem(OTP_RECORDS_KEY, JSON.stringify([]));
  localStorage.setItem(SIMULATED_INBOX_KEY, JSON.stringify([]));
}

// Audit Logger
export function logAuditEvent(
  action: string,
  actorRole: 'VOTER' | 'ADMIN' | 'SYSTEM',
  actorId: string,
  details: string,
  ipAddress = '127.0.0.1'
): void {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    const logs: AuditLog[] = raw ? JSON.parse(raw) : [];
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      actorRole,
      actorId,
      details,
      ipAddress,
    };
    logs.unshift(newLog);
    // Keep last 150 logs
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 150)));
  } catch (err) {
    console.error('Audit log failed', err);
  }
}

export function getAuditLogs(): AuditLog[] {
  const raw = localStorage.getItem(AUDIT_LOGS_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_AUDIT_LOGS;
}

// Simulated Inbox for Dev/Demo
export function getSimulatedMessages(): SimulatedMessage[] {
  const raw = localStorage.getItem(SIMULATED_INBOX_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addSimulatedMessage(msg: SimulatedMessage): void {
  const msgs = getSimulatedMessages();
  msgs.unshift(msg);
  localStorage.setItem(SIMULATED_INBOX_KEY, JSON.stringify(msgs.slice(0, 20)));
}

// Users Service
export function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_USERS;
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByEmailOrStudentId(identifier: string): User | undefined {
  const clean = identifier.trim().toLowerCase();
  return getUsers().find(
    u => u.email.toLowerCase() === clean ||
         u.studentId.toLowerCase() === clean ||
         u.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
  );
}

export function registerUser(data: {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
}): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const existing = users.find(
    u => u.email.toLowerCase() === data.email.toLowerCase() ||
         u.studentId.toLowerCase() === data.studentId.toLowerCase()
  );

  if (existing) {
    return {
      success: false,
      error: existing.studentId.toLowerCase() === data.studentId.toLowerCase()
        ? 'A voter with this Institutional/Student ID is already registered.'
        : 'A voter with this email address is already registered.',
    };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    fullName: data.fullName.trim(),
    studentId: data.studentId.trim().toUpperCase(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    department: data.department.trim(),
    isVerified: true, // Auto-verified in academic demo mode so users can immediately test
    isActive: true,
    registeredAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  logAuditEvent(
    'USER_REGISTERED',
    'VOTER',
    newUser.studentId,
    `New voter account registered: ${newUser.fullName} (${newUser.department}). Auto-approved for academic demo.`
  );

  return { success: true, user: newUser };
}

export function toggleUserVerification(userId: string): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return false;

  users[index].isVerified = !users[index].isVerified;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  logAuditEvent(
    'VOTER_VERIFICATION_TOGGLED',
    'ADMIN',
    'admin-01',
    `Voter ${users[index].studentId} (${users[index].fullName}) verification state changed to: ${users[index].isVerified ? 'VERIFIED' : 'PENDING'}`
  );
  return true;
}

export function toggleUserActive(userId: string): boolean {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return false;

  users[index].isActive = !users[index].isActive;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  logAuditEvent(
    'VOTER_ACCOUNT_STATUS_TOGGLED',
    'ADMIN',
    'admin-01',
    `Voter ${users[index].studentId} account state toggled to: ${users[index].isActive ? 'ACTIVE' : 'DISABLED'}`
  );
  return true;
}

// Elections Service
export function getElections(): Election[] {
  const raw = localStorage.getItem(ELECTIONS_KEY);
  const elections: Election[] = raw ? JSON.parse(raw) : DEFAULT_ELECTIONS;
  const candidates = getCandidates();
  const votes = getAnonymousVotes();

  return elections.map(e => ({
    ...e,
    candidatesCount: candidates.filter(c => c.electionId === e.id).length,
    totalVotes: votes.filter(v => v.electionId === e.id).length,
  }));
}

export function getElectionById(id: string): Election | undefined {
  return getElections().find(e => e.id === id);
}

export function createElection(data: Omit<Election, 'id' | 'createdAt'>): Election {
  const elections = getElections();
  const newElection: Election = {
    ...data,
    id: `elec-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  elections.push(newElection);
  localStorage.setItem(ELECTIONS_KEY, JSON.stringify(elections));

  logAuditEvent(
    'ELECTION_CREATED',
    'ADMIN',
    'admin-01',
    `Created election "${newElection.title}" (${newElection.category}) in status ${newElection.status}.`
  );

  return newElection;
}

export function updateElection(id: string, updates: Partial<Election>): boolean {
  const raw = localStorage.getItem(ELECTIONS_KEY);
  const elections: Election[] = raw ? JSON.parse(raw) : DEFAULT_ELECTIONS;
  const index = elections.findIndex(e => e.id === id);
  if (index === -1) return false;

  const previousStatus = elections[index].status;
  elections[index] = { ...elections[index], ...updates };
  localStorage.setItem(ELECTIONS_KEY, JSON.stringify(elections));

  if (updates.status && updates.status !== previousStatus) {
    logAuditEvent(
      'ELECTION_STATUS_CHANGED',
      'ADMIN',
      'admin-01',
      `Election "${elections[index].title}" changed from ${previousStatus} to ${updates.status}.`
    );
  } else {
    logAuditEvent(
      'ELECTION_UPDATED',
      'ADMIN',
      'admin-01',
      `Updated settings for election "${elections[index].title}".`
    );
  }

  return true;
}

export function deleteElection(id: string): { success: boolean; message: string } {
  const raw = localStorage.getItem(ELECTIONS_KEY);
  const elections: Election[] = raw ? JSON.parse(raw) : DEFAULT_ELECTIONS;
  const election = elections.find(e => e.id === id);

  if (!election) return { success: false, message: 'Election not found.' };

  // Only DRAFT or closed elections without active voting can be deleted
  const votes = getAnonymousVotes().filter(v => v.electionId === id);
  if (votes.length > 0) {
    return {
      success: false,
      message: 'Cannot delete an election that contains cast ballots. Audit integrity requirement.',
    };
  }

  const updated = elections.filter(e => e.id !== id);
  localStorage.setItem(ELECTIONS_KEY, JSON.stringify(updated));

  // Also remove candidates for this election
  const candidates = getCandidates().filter(c => c.electionId !== id);
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));

  logAuditEvent(
    'ELECTION_DELETED',
    'ADMIN',
    'admin-01',
    `Deleted draft/empty election "${election.title}".`
  );

  return { success: true, message: 'Election successfully removed.' };
}

// Candidates Service
export function getCandidates(): Candidate[] {
  const raw = localStorage.getItem(CANDIDATES_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_CANDIDATES;
}

export function getCandidatesByElection(electionId: string): Candidate[] {
  return getCandidates().filter(c => c.electionId === electionId);
}

export function addCandidate(data: Omit<Candidate, 'id'>): Candidate {
  const candidates = getCandidates();
  const newCandidate: Candidate = {
    ...data,
    id: `cand-${Date.now()}`,
  };

  candidates.push(newCandidate);
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));

  logAuditEvent(
    'CANDIDATE_ADDED',
    'ADMIN',
    'admin-01',
    `Nominated candidate "${newCandidate.name}" for position "${newCandidate.position}" in election ${data.electionId}.`
  );

  return newCandidate;
}

export function updateCandidate(id: string, updates: Partial<Candidate>): boolean {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) return false;

  candidates[index] = { ...candidates[index], ...updates };
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));

  logAuditEvent(
    'CANDIDATE_UPDATED',
    'ADMIN',
    'admin-01',
    `Updated candidate profile for "${candidates[index].name}".`
  );

  return true;
}

export function deleteCandidate(id: string): { success: boolean; message: string } {
  const candidates = getCandidates();
  const candidate = candidates.find(c => c.id === id);
  if (!candidate) return { success: false, message: 'Candidate not found.' };

  // Check if candidate already has votes
  const votes = getAnonymousVotes().filter(v => v.candidateId === id);
  if (votes.length > 0) {
    return {
      success: false,
      message: 'Cannot delete candidate after votes have already been cast in their name.',
    };
  }

  const updated = candidates.filter(c => c.id !== id);
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));

  logAuditEvent(
    'CANDIDATE_REMOVED',
    'ADMIN',
    'admin-01',
    `Removed candidate "${candidate.name}" from election.`
  );

  return { success: true, message: 'Candidate removed.' };
}

// Voting Status & Anonymous Ballot Box
export function getVotingStatuses(): VotingStatusRecord[] {
  const raw = localStorage.getItem(VOTING_STATUS_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_VOTING_STATUS;
}

export function hasUserVoted(electionId: string, voterId: string): boolean {
  const records = getVotingStatuses();
  return records.some(r => r.electionId === electionId && r.voterId === voterId && r.hasVoted);
}

export function getUserVotingRecord(electionId: string, voterId: string): VotingStatusRecord | undefined {
  const records = getVotingStatuses();
  return records.find(r => r.electionId === electionId && r.voterId === voterId && r.hasVoted);
}

export function getAnonymousVotes(): AnonymousVote[] {
  const raw = localStorage.getItem(VOTES_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_ANONYMOUS_VOTES;
}

/**
 * CAST VOTE WITH COMPLETE PRIVACY SEPARATION:
 * 1. Validates voter eligibility & account active state.
 * 2. Checks election is ACTIVE and within date window.
 * 3. Checks if voter has ALREADY voted in this election.
 * 4. Stores voter participation in `voting_status` (voterId + hasVoted = true + receiptCode).
 * 5. Stores anonymous vote in `votes` table (candidateId + random ballotToken, ZERO voter identity info!).
 * 6. Logs audit event without candidate choice.
 */
export async function castVote(params: {
  electionId: string;
  voter: User;
  candidateId: string;
}): Promise<{ success: boolean; receiptCode?: string; error?: string }> {
  const { electionId, voter, candidateId } = params;

  // 1. Check voter validity
  if (!voter.isVerified) {
    return { success: false, error: 'Your account is pending institutional verification by the Election Officer.' };
  }
  if (!voter.isActive) {
    return { success: false, error: 'Your voter account has been suspended or deactivated.' };
  }

  // 2. Check election status & window
  const election = getElectionById(electionId);
  if (!election) {
    return { success: false, error: 'Election not found.' };
  }
  if (election.status !== 'ACTIVE') {
    return { success: false, error: `Voting is not open. Election status is ${election.status}.` };
  }

  const now = new Date().getTime();
  const start = new Date(election.startDate).getTime();
  const end = new Date(election.endDate).getTime();
  if (now < start) {
    return { success: false, error: 'Voting period has not started yet.' };
  }
  if (now > end) {
    return { success: false, error: 'Voting period for this election has ended.' };
  }

  // 3. Prevent duplicate voting
  if (hasUserVoted(electionId, voter.id)) {
    return { success: false, error: 'Duplicate vote detected! You have already submitted a ballot for this election.' };
  }

  // 4. Generate random cryptographic tokens
  const receiptCode = generateReceiptCode();
  const ballotToken = await sha256(`ballot-${Date.now()}-${Math.random()}`);

  // 5. Atomic state update (Simulated transactional database execution)
  const votingStatuses = getVotingStatuses();
  const newStatusRecord: VotingStatusRecord = {
    id: `vs-${Date.now()}`,
    electionId,
    voterId: voter.id,
    studentId: voter.studentId,
    hasVoted: true,
    votedAt: new Date().toISOString(),
    receiptCode,
  };
  votingStatuses.push(newStatusRecord);
  localStorage.setItem(VOTING_STATUS_KEY, JSON.stringify(votingStatuses));

  // 6. Record anonymous vote in separate table (NO voter ID stored!)
  const votes = getAnonymousVotes();
  const newAnonymousVote: AnonymousVote = {
    id: `vote-${Date.now()}`,
    electionId,
    candidateId,
    ballotToken,
    timestamp: new Date().toISOString(),
  };
  votes.push(newAnonymousVote);
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));

  // 7. Audit log (strictly omits candidate choice)
  logAuditEvent(
    'BALLOT_CAST_SUCCESS',
    'VOTER',
    `${voter.studentId} (Voter Status: Voted)`,
    `Anonymized ballot recorded for election "${election.title}". Receipt code issued: ${receiptCode}. No candidate linkage recorded.`,
    '10.0.4.92'
  );

  return { success: true, receiptCode };
}

// Result Analytics Calculation
export function getElectionAnalytics(electionId: string): ElectionAnalytics | null {
  const election = getElectionById(electionId);
  if (!election) return null;

  const candidates = getCandidatesByElection(electionId);
  const votes = getAnonymousVotes().filter(v => v.electionId === electionId);
  const eligibleVoters = getUsers().filter(u => u.isVerified && u.isActive);
  const totalEligible = eligibleVoters.length;
  const totalVotesCast = votes.length;
  const votesRemaining = Math.max(0, totalEligible - totalVotesCast);
  const turnoutPercentage = totalEligible > 0 ? Math.round((totalVotesCast / totalEligible) * 1000) / 10 : 0;

  const candidatesResults: ElectionResultItem[] = candidates.map(c => {
    const candidateVotes = votes.filter(v => v.candidateId === c.id).length;
    const percentage = totalVotesCast > 0 ? Math.round((candidateVotes / totalVotesCast) * 1000) / 10 : 0;
    return {
      candidateId: c.id,
      candidateName: c.name,
      position: c.position,
      photoUrl: c.photoUrl,
      department: c.department,
      votesCount: candidateVotes,
      percentage,
    };
  });

  // Sort by vote count descending
  candidatesResults.sort((a, b) => b.votesCount - a.votesCount);

  const winnerCandidate = candidatesResults.length > 0 && candidatesResults[0].votesCount > 0
    ? candidatesResults[0]
    : undefined;

  return {
    electionId,
    electionTitle: election.title,
    status: election.status,
    totalEligible,
    totalVotesCast,
    votesRemaining,
    turnoutPercentage,
    candidatesResults,
    winnerCandidate,
  };
}

// Export Results as CSV
export function exportResultsToCsv(electionId: string): void {
  const analytics = getElectionAnalytics(electionId);
  if (!analytics) return;

  const rows = [
    ['Election Title', `"${analytics.electionTitle}"`],
    ['Election Status', analytics.status],
    ['Report Generated', new Date().toISOString()],
    ['Total Eligible Voters', analytics.totalEligible],
    ['Total Ballots Cast', analytics.totalVotesCast],
    ['Votes Remaining', analytics.votesRemaining],
    ['Turnout Percentage', `${analytics.turnoutPercentage}%`],
    [],
    ['Candidate Name', 'Position', 'Department', 'Votes Received', 'Vote Percentage'],
    ...analytics.candidatesResults.map(c => [
      `"${c.candidateName}"`,
      `"${c.position}"`,
      `"${c.department}"`,
      c.votesCount,
      `${c.percentage}%`,
    ]),
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `election_results_${electionId}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  logAuditEvent(
    'RESULTS_EXPORTED_CSV',
    'ADMIN',
    'admin-01',
    `Exported official vote tabulation CSV for election "${analytics.electionTitle}".`
  );
}
