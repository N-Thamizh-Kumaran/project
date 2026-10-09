export type UserRole = 'VOTER' | 'ADMIN';

export type ElectionStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'CLOSED';

export interface User {
  id: string;
  fullName: string;
  studentId: string; // institutional ID
  email: string;
  phone: string;
  department: string;
  isVerified: boolean; // Approved by admin
  isActive: boolean; // Account enabled/disabled
  registeredAt: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ELECTION_OFFICER';
}

export interface Candidate {
  id: string;
  electionId: string;
  name: string;
  position: string;
  manifesto: string;
  photoUrl: string;
  department: string;
  year: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  category: 'Student Council' | 'Department' | 'Club' | 'Faculty';
  status: ElectionStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  candidatesCount?: number;
  totalVotes?: number;
}

// Voting status tracks WHO voted to prevent duplicates WITHOUT recording WHO they voted for
export interface VotingStatusRecord {
  id: string;
  electionId: string;
  voterId: string;
  studentId: string;
  hasVoted: boolean;
  votedAt: string;
  receiptCode: string; // Non-sensitive confirmation reference
}

// Anonymized ballot box: Stores votes completely decoupled from voter identity
export interface AnonymousVote {
  id: string;
  electionId: string;
  candidateId: string;
  ballotToken: string; // Cryptographic random ballot receipt hash
  timestamp: string;
}

export interface OtpVerificationRecord {
  id: string;
  identifier: string; // email or phone
  code: string;
  expiresAt: number; // epoch ms
  attempts: number;
  maxAttempts: number;
  isUsed: boolean;
  createdAt: number;
  channel: 'EMAIL' | 'SMS';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorRole: 'VOTER' | 'ADMIN' | 'SYSTEM';
  actorId: string;
  details: string;
  ipAddress: string;
}

export interface SimulatedMessage {
  id: string;
  recipient: string;
  channel: 'EMAIL' | 'SMS';
  otpCode: string;
  sentAt: string;
  expiresAt: string;
  content: string;
}

export interface ElectionResultItem {
  candidateId: string;
  candidateName: string;
  position: string;
  photoUrl: string;
  department: string;
  votesCount: number;
  percentage: number;
}

export interface ElectionAnalytics {
  electionId: string;
  electionTitle: string;
  status: ElectionStatus;
  totalEligible: number;
  totalVotesCast: number;
  votesRemaining: number;
  turnoutPercentage: number;
  candidatesResults: ElectionResultItem[];
  winnerCandidate?: ElectionResultItem;
}
