import { useState, useEffect } from 'react';
import { User, Admin, Election } from './types';
import {
  initStorage,
  getUsers,
  getElections,
  getUserById,
  getUserByEmailOrStudentId,
  logAuditEvent,
  getSimulatedMessages,
} from './services/storage';
import { requestOtp } from './services/otpService';

import DisclaimerBanner from './components/DisclaimerBanner';
import Navbar from './components/Navbar';
import PublicHome from './components/PublicHome';
import VoterDashboard from './components/VoterDashboard';
import BallotView from './components/BallotView';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import OtpModal from './components/OtpModal';
import AdminLoginModal from './components/AdminLoginModal';
import VoteSuccessModal from './components/VoteSuccessModal';
import DocumentationModal from './components/DocumentationModal';
import SimulatedInboxDrawer from './components/SimulatedInboxDrawer';

export default function App() {
  // Current session states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpPendingUser, setOtpPendingUser] = useState<User | null>(null);
  const [otpChannel, setOtpChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');

  const [isVoteSuccessModalOpen, setIsVoteSuccessModalOpen] = useState(false);
  const [voteReceiptDetails, setVoteReceiptDetails] = useState<{
    electionTitle: string;
    receiptCode: string;
    timestamp: string;
  } | null>(null);

  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isInboxDrawerOpen, setIsInboxDrawerOpen] = useState(false);
  const [unreadInboxCount, setUnreadInboxCount] = useState(0);

  // Initialize data on mount
  useEffect(() => {
    initStorage();
    updateInboxCount();
  }, []);

  const updateInboxCount = () => {
    const msgs = getSimulatedMessages();
    setUnreadInboxCount(msgs.length);
  };

  const handleLogout = () => {
    if (currentUser) {
      logAuditEvent('VOTER_LOGOUT', 'VOTER', currentUser.studentId, 'Voter session ended.');
    }
    if (currentAdmin) {
      logAuditEvent('ADMIN_LOGOUT', 'ADMIN', currentAdmin.id, 'Administrator logged out.');
    }
    setCurrentUser(null);
    setCurrentAdmin(null);
    setActiveView('home');
    setSelectedElection(null);
  };

  // 1-Click Evaluator Quick Switchers
  const handleQuickLoginVoter = (email: string, studentId: string) => {
    const user = getUserByEmailOrStudentId(studentId) || getUserByEmailOrStudentId(email);
    if (!user) return;

    // Trigger OTP flow to demonstrate authentic 2FA
    setOtpPendingUser(user);
    setOtpIdentifier(user.email);
    setOtpChannel('EMAIL');

    requestOtp(user.email, 'EMAIL');
    updateInboxCount();

    setIsOtpModalOpen(true);
  };

  const handleQuickLoginAdmin = () => {
    const admin: Admin = {
      id: 'admin-01',
      username: 'admin',
      email: 'admin@campus.edu',
      fullName: 'Dr. Sarah Jenkins',
      role: 'SUPER_ADMIN',
    };
    setCurrentAdmin(admin);
    setCurrentUser(null);
    setActiveView('admin-dashboard');

    logAuditEvent(
      'ADMIN_LOGIN_SUCCESS',
      'ADMIN',
      'admin-01',
      'Quick evaluation login for Dr. Sarah Jenkins (SUPER_ADMIN).'
    );
  };

  // Called when AuthModal validates credentials and needs OTP step
  const handleOtpRequired = (identifier: string, user: User, channel: 'EMAIL' | 'SMS') => {
    setIsAuthModalOpen(false);
    setOtpPendingUser(user);
    setOtpIdentifier(identifier);
    setOtpChannel(channel);
    setIsOtpModalOpen(true);
    updateInboxCount();
  };

  // Called when OTP verification succeeds
  const handleOtpSuccess = () => {
    setIsOtpModalOpen(false);
    if (otpPendingUser) {
      setCurrentUser(otpPendingUser);
      setCurrentAdmin(null);
      // Navigate to election if one was pre-selected, otherwise dashboard
      if (selectedElection) {
        setActiveView('ballot');
      } else {
        setActiveView('voter-dashboard');
      }
    }
  };

  // Admin login success
  const handleAdminSuccess = (admin: Admin) => {
    setIsAdminLoginModalOpen(false);
    setCurrentAdmin(admin);
    setCurrentUser(null);
    setActiveView('admin-dashboard');
  };

  // Vote Cast Success
  const handleVoteCastSuccess = (receiptCode: string, timestamp: string) => {
    if (selectedElection) {
      setVoteReceiptDetails({
        electionTitle: selectedElection.title,
        receiptCode,
        timestamp,
      });
      setIsVoteSuccessModalOpen(true);
    }
  };

  // When voter clicks an election on home or dashboard
  const handleSelectElection = (election: Election) => {
    setSelectedElection(election);
    if (currentUser) {
      setActiveView('ballot');
    } else {
      // Prompt sign in first
      setIsAuthModalOpen(true);
    }
  };

  const elections = getElections();

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Academic Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentAdmin={currentAdmin}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'elections') {
            if (currentUser) {
              setActiveView('voter-dashboard');
            } else {
              setActiveView('home');
              const el = document.getElementById('active-elections-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAdminAuth={() => setIsAdminLoginModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onOpenInbox={() => {
          updateInboxCount();
          setIsInboxDrawerOpen(true);
        }}
        onLogout={handleLogout}
        unreadInboxCount={unreadInboxCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          <PublicHome
            elections={elections}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenAdminAuth={() => setIsAdminLoginModalOpen(true)}
            onOpenDocs={() => setIsDocsModalOpen(true)}
            onQuickLoginVoter={handleQuickLoginVoter}
            onQuickLoginAdmin={handleQuickLoginAdmin}
            onSelectElection={handleSelectElection}
          />
        )}

        {activeView === 'how-it-works' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h1 className="text-3xl font-extrabold text-slate-900">
                How It Works &amp; Verification Protocol
              </h1>
              <p className="text-xs text-slate-500">
                End-to-end voting lifecycle ensuring authentic participant authentication
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Phase 1</span>
                <h3 className="text-base font-bold text-slate-900">Voter Roster &amp; Verification</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students register with their unique student ID and institutional email. Election officers review roster eligibility prior to ballot activation.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Phase 2</span>
                <h3 className="text-base font-bold text-slate-900">OTP Dual-Factor Authentication</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upon entering password credentials, a time-sensitive 6-digit OTP is transmitted. The code expires in 300 seconds and locks out after 3 incorrect attempts.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Phase 3</span>
                <h3 className="text-base font-bold text-slate-900">Decoupled Anonymous Ballot Box</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The system prevents duplicate voting using unique constraints on voter participation, while recording the selected candidate in a strictly detached anonymous table.
                </p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Phase 4</span>
                <h3 className="text-base font-bold text-slate-900">Confirmation Slip &amp; Audit Logs</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Voters receive an unforgeable confirmation receipt reference without compromising vote secrecy. All key system operations are logged in an immutable audit ledger.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setIsDocsModalOpen(true)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                View Full Technical Specifications &amp; Relational Schema
              </button>
            </div>
          </div>
        )}

        {activeView === 'voter-dashboard' && currentUser && (
          <VoterDashboard
            currentUser={currentUser}
            onSelectElectionToVote={(election) => {
              setSelectedElection(election);
              setActiveView('ballot');
            }}
            onViewReceipt={(electionTitle, receiptCode, timestamp) => {
              setVoteReceiptDetails({
                electionTitle,
                receiptCode,
                timestamp,
              });
              setIsVoteSuccessModalOpen(true);
            }}
          />
        )}

        {activeView === 'ballot' && currentUser && selectedElection && (
          <BallotView
            election={selectedElection}
            voter={currentUser}
            onBack={() => setActiveView('voter-dashboard')}
            onVoteCastSuccess={handleVoteCastSuccess}
          />
        )}

        {activeView === 'admin-dashboard' && currentAdmin && (
          <AdminDashboard currentAdmin={currentAdmin} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-800">
              Secure Online Voting System &ndash; Ensuring Authenticity through OTP Verification
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Academic Mini-Project Prototype &middot; Designed for colleges, clubs, and student councils.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
            >
              System Documentation
            </button>
            <button
              onClick={() => {
                updateInboxCount();
                setIsInboxDrawerOpen(true);
              }}
              className="text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
            >
              Simulated OTP Inbox
            </button>
            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
            >
              Officer Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOtpRequired={handleOtpRequired}
      />

      <OtpModal
        isOpen={isOtpModalOpen}
        identifier={otpIdentifier}
        channel={otpChannel}
        onClose={() => setIsOtpModalOpen(false)}
        onSuccess={handleOtpSuccess}
        onOpenInbox={() => {
          updateInboxCount();
          setIsInboxDrawerOpen(true);
        }}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Confirmation & Receipts */}
      {voteReceiptDetails && (
        <VoteSuccessModal
          isOpen={isVoteSuccessModalOpen}
          electionTitle={voteReceiptDetails.electionTitle}
          receiptCode={voteReceiptDetails.receiptCode}
          timestamp={voteReceiptDetails.timestamp}
          onClose={() => {
            setIsVoteSuccessModalOpen(false);
            setVoteReceiptDetails(null);
            setActiveView('voter-dashboard');
          }}
        />
      )}

      {/* Academic Documentation Modal */}
      <DocumentationModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      {/* Simulated Dev Inbox Drawer */}
      <SimulatedInboxDrawer
        isOpen={isInboxDrawerOpen}
        onClose={() => setIsInboxDrawerOpen(false)}
        onAutoFillOtp={(code) => {
          // If OtpModal is open, the user can copy & paste the code
          setIsInboxDrawerOpen(false);
        }}
      />
    </div>
  );
}
