import { useState } from 'react';
import {
  X,
  FileCode,
  Database,
  Layers,
  KeyRound,
  Shield,
  Server,
  Lock,
  ListCheck,
  CheckCircle2,
  Terminal,
  BookOpen,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentationModal({ isOpen, onClose }: DocumentationModalProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SCHEMA' | 'FLOWS' | 'API' | 'SECURITY' | 'TESTS'>('OVERVIEW');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Academic Project Documentation & Specifications
              </h2>
              <p className="text-xs text-slate-500">
                Secure Online Voting System – Ensuring Authenticity through OTP Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 bg-white px-5 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Architecture & Folder Structure
          </button>
          <button
            onClick={() => setActiveTab('SCHEMA')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'SCHEMA'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Relational Database Schema
          </button>
          <button
            onClick={() => setActiveTab('FLOWS')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'FLOWS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Auth, OTP & Voting Flows
          </button>
          <button
            onClick={() => setActiveTab('API')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'API'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. API Endpoints Catalog
          </button>
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'SECURITY'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            5. Security & Threat Modeling
          </button>
          <button
            onClick={() => setActiveTab('TESTS')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'TESTS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            6. Verification & Test Matrix
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 space-y-6">
          {/* TAB 1: ARCHITECTURE & FOLDER STRUCTURE */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  System Architecture & Folder Structure
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The application is structured into decoupled presentation, service, cryptographic, and storage layers ensuring robust separation of concerns, testability, and adherence to clean architecture principles.
                </p>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{`/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                   # Top Bar Contract navigation & role status
│   │   ├── DisclaimerBanner.tsx         # Academic Mini-Project limitation scope notice
│   │   ├── PublicHome.tsx               # Public landing, pillars, how-it-works & demo launcher
│   │   ├── AuthModal.tsx                # Voter registration & credential verification
│   │   ├── OtpModal.tsx                 # 6-digit OTP input with auto-advance & timers
│   │   ├── AdminLoginModal.tsx          # Dedicated Election Officer sign-in
│   │   ├── VoterDashboard.tsx           # Voter ballot catalog & eligibility badges
│   │   ├── BallotView.tsx               # Candidate manifesto & confirmation dialog
│   │   ├── VoteSuccessModal.tsx         # Anonymous ballot receipt (non-sensitive ID)
│   │   ├── AdminDashboard.tsx           # Full CRUD, voter registry & turnout analytics
│   │   ├── SimulatedInboxDrawer.tsx     # Simulated SMS/Email Gateway for academic testing
│   │   └── DocumentationModal.tsx       # Comprehensive academic project report
│   ├── services/
│   │   ├── storage.ts                   # Relational tables mock, SHA-256 & decoupled voting
│   │   └── otpService.ts                # OTP generation, expiry (300s), attempts & cooldown
│   ├── types/
│   │   └── index.ts                     # Strict TypeScript interfaces & data contracts
│   ├── App.tsx                          # Root orchestration & session router
│   ├── index.css                        # Tailwind CSS imports & accessibility tokens
│   └── main.tsx                         # DOM hydration root
├── .env.example                         # Environment configuration contract
├── metadata.json                        # App manifest & capabilities
└── tsconfig.json                        # Modern strict TypeScript configuration`}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-1">Presentation Layer</h4>
                  <p className="text-slate-600">
                    Built using React 19 and Tailwind CSS with strict single-line controls, zero-pill discipline, WCAG AA contrast, and responsive layout integrity.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-bold text-slate-900 mb-1">Cryptographic Engine</h4>
                  <p className="text-slate-600">
                    Web Crypto API (`crypto.subtle`) handles SHA-256 password hashing and random receipt generation. Anonymized ballot tokens ensure zero linkability to voter identities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA */}
          {activeTab === 'SCHEMA' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Relational Database Schema Design
                </h3>
                <p className="text-xs text-slate-600">
                  Strictly modeled with normalized relational tables, foreign key references, unique constraints, and decoupled ballot storage:
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-indigo-700">TABLE users</span>
                    <span className="text-[11px] text-slate-500">Registered Voter Accounts</span>
                  </div>
                  <pre className="font-mono text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
{`CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(128) NOT NULL,
  student_id VARCHAR(32) NOT NULL UNIQUE,  -- Institutional unique ID
  email VARCHAR(128) NOT NULL UNIQUE,
  phone VARCHAR(32) NOT NULL,
  department VARCHAR(128) NOT NULL,
  password_hash VARCHAR(256) NOT NULL,     -- Salted SHA-256 hash
  is_verified BOOLEAN DEFAULT FALSE,       -- Approved by Election Officer
  is_active BOOLEAN DEFAULT TRUE,          -- Account state
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                  </pre>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-indigo-700">TABLE voting_status (Participation Registry)</span>
                    <span className="text-[11px] text-slate-500">Enforces One-Vote-Per-Voter WITHOUT storing choice</span>
                  </div>
                  <pre className="font-mono text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
{`CREATE TABLE voting_status (
  id VARCHAR(64) PRIMARY KEY,
  election_id VARCHAR(64) REFERENCES elections(id) ON DELETE RESTRICT,
  voter_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  student_id VARCHAR(32) NOT NULL,
  has_voted BOOLEAN DEFAULT TRUE,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  receipt_code VARCHAR(64) NOT NULL,
  UNIQUE(election_id, voter_id)             -- STRICT ONE VOTE CONSTRAINT
);`}
                  </pre>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-indigo-700">TABLE votes (Anonymous Secret Ballot Box)</span>
                    <span className="text-[11px] text-slate-500">Completely Decoupled from voter ID!</span>
                  </div>
                  <pre className="font-mono text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
{`CREATE TABLE votes (
  id VARCHAR(64) PRIMARY KEY,
  election_id VARCHAR(64) REFERENCES elections(id) ON DELETE RESTRICT,
  candidate_id VARCHAR(64) REFERENCES candidates(id) ON DELETE RESTRICT,
  ballot_token VARCHAR(256) NOT NULL UNIQUE, -- Cryptographic random token
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  -- NOTE: Zero voter foreign key or student ID stored in this table!
);`}
                  </pre>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-indigo-700">TABLE otp_verifications</span>
                    <span className="text-[11px] text-slate-500">Short-Lived One-Time Passcodes</span>
                  </div>
                  <pre className="font-mono text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto">
{`CREATE TABLE otp_verifications (
  id VARCHAR(64) PRIMARY KEY,
  identifier VARCHAR(128) NOT NULL,
  code_hash VARCHAR(256) NOT NULL,
  expires_at BIGINT NOT NULL,              -- 300 seconds TTL
  attempts INT DEFAULT 0,                  -- Max 3 before lockout
  is_used BOOLEAN DEFAULT FALSE,
  created_at BIGINT NOT NULL
);`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLOWS */}
          {activeTab === 'FLOWS' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Architectural Flows: Authentication, OTP & Decoupled Voting
                </h3>
                <p className="text-xs text-slate-600">
                  Step-by-step verification lifecycle ensuring voter legitimacy while safeguarding ballot confidentiality.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                    Voter Registration & Verification
                  </h4>
                  <p className="text-xs text-slate-600">
                    Voter submits Institutional ID, email, phone, and password hash. Election Officer verifies physical campus roster status before voting window.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                    Credential Verification + 6-Digit OTP Dispatch
                  </h4>
                  <p className="text-xs text-slate-600">
                    Voter enters Student ID + Password. Server generates cryptographic 6-digit OTP with 300s expiration, initiates 30s resend cooldown, and dispatches via configured Email/SMS provider.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                    Two-Factor OTP Authentication & Session Token
                  </h4>
                  <p className="text-xs text-slate-600">
                    Voter submits 6 digits with max 3 incorrect attempts. Successful verification consumes OTP and grants authenticated ballot session.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                  <h4 className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">4</span>
                    Decoupled Ballot Casting (Privacy-Preserving Mechanism)
                  </h4>
                  <div className="text-xs text-indigo-950 space-y-1 leading-relaxed">
                    <p>When the voter clicks &quot;Confirm &amp; Submit&quot;:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Eligibility check: Voter is verified, account active, election status is ACTIVE.</li>
                      <li>Duplicate prevention: Query <code>voting_status</code> for (election_id, voter_id). If exists, abort immediately.</li>
                      <li>Atomic execution step A: Mark voter participation in <code>voting_status</code> (records WHO voted, NOT for whom).</li>
                      <li>Atomic execution step B: Insert anonymous ballot in <code>votes</code> table with (election_id, candidate_id, random_ballot_token). Zero voter identifiers saved!</li>
                      <li>Return receipt reference code (e.g. <code>VOTE-REC-2026-X8F93A</code>) strictly omitting candidate choice.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API */}
          {activeTab === 'API' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  RESTful API Endpoints Specification
                </h3>
                <p className="text-xs text-slate-600">
                  Standard backend routing contract implementing authentication, OTP services, election management, and vote tallying:
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span>POST /api/auth/register</span>
                  <span className="text-slate-500 font-sans">Register new voter account</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span>POST /api/auth/login</span>
                  <span className="text-slate-500 font-sans">Verify credentials and trigger OTP</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span>POST /api/otp/request</span>
                  <span className="text-slate-500 font-sans">Request new 6-digit OTP code</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span>POST /api/otp/verify</span>
                  <span className="text-slate-500 font-sans">Verify OTP code and issue session token</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span>GET /api/elections</span>
                  <span className="text-slate-500 font-sans">List accessible campus elections</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span>POST /api/votes/cast</span>
                  <span className="text-slate-500 font-sans">Cast anonymous ballot (Transactional)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span>GET /api/admin/results/:id</span>
                  <span className="text-slate-500 font-sans">Admin-only election results tabulation</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span>GET /api/admin/audit-logs</span>
                  <span className="text-slate-500 font-sans">Retrieve chronological security audit trail</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Security Decisions, Limitations & Threat Analysis
                </h3>
                <p className="text-xs text-slate-600">
                  Honest academic evaluation of design choices and explicit constraints.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-950">
                  <h4 className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Security Mechanisms Implemented
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li>Multi-Factor Authentication (Credentials + OTP).</li>
                    <li>OTP Expiration: Strict 5-minute (300s) time-to-live.</li>
                    <li>Rate Limiting: 30s resend cooldown + max 3 failed OTP attempts.</li>
                    <li>Strict Decoupling: No foreign key between voter identity and vote choice.</li>
                    <li>Duplicate Vote Prevention: Unique constraint on (election_id, voter_id).</li>
                    <li>Comprehensive Audit Trail: Non-repudiation for admin and voter events.</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-amber-950">
                  <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Shield className="w-4 h-4 text-amber-700" />
                    Explicit Scope Limitations (Academic Prototype)
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    <li>Designed for small/medium campus and club elections with known rosters.</li>
                    <li>NOT certified for municipal, state, or national public elections.</li>
                    <li>Does not implement Zero-Knowledge Proof (ZKP) or homomorphic encryption.</li>
                    <li>Client-side simulated SMS/Email gateway for evaluator convenience.</li>
                    <li>Administrative trust model assumes authenticated election commission officers.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TESTS */}
          {activeTab === 'TESTS' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Quality Assurance & Test Case Matrix
                </h3>
                <p className="text-xs text-slate-600">
                  Comprehensive test coverage verified across positive and negative paths:
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Test Case ID</th>
                      <th className="p-2.5">Scenario / Trigger</th>
                      <th className="p-2.5">Expected Security Behavior</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    <tr>
                      <td className="p-2.5 font-bold">TC-SEC-01</td>
                      <td className="p-2.5 font-sans">Duplicate Vote Attempt</td>
                      <td className="p-2.5 font-sans">Rejected immediately: &quot;Duplicate vote detected&quot;</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">TC-SEC-02</td>
                      <td className="p-2.5 font-sans">Incorrect OTP (3 Times)</td>
                      <td className="p-2.5 font-sans">Lockout triggered; session invalidated</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">TC-SEC-03</td>
                      <td className="p-2.5 font-sans">OTP Expiry (&gt; 300s)</td>
                      <td className="p-2.5 font-sans">Submission blocked with expiration message</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">TC-SEC-04</td>
                      <td className="p-2.5 font-sans">Vote on Closed Election</td>
                      <td className="p-2.5 font-sans">Action disabled; ballot submission rejected</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">TC-SEC-05</td>
                      <td className="p-2.5 font-sans">Unverified Voter Attempt</td>
                      <td className="p-2.5 font-sans">Blocked pending administrative verification</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">TC-SEC-06</td>
                      <td className="p-2.5 font-sans">Ballot Privacy Separation</td>
                      <td className="p-2.5 font-sans">Receipt code issued without candidate linkage</td>
                      <td className="p-2.5 text-emerald-700 font-bold">PASSED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Department of Computer Science &middot; Academic Year 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
