import { useState } from 'react';
import { User, Admin } from '../types';
import { Shield, Mail, Menu, X, User as UserIcon, LogOut, KeyRound } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentAdmin: Admin | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onOpenAdminAuth: () => void;
  onOpenDocs: () => void;
  onOpenInbox: () => void;
  onLogout: () => void;
  unreadInboxCount: number;
}

export default function Navbar({
  currentUser,
  currentAdmin,
  activeView,
  onNavigate,
  onOpenAuth,
  onOpenAdminAuth,
  onOpenDocs,
  onOpenInbox,
  onLogout,
  unreadInboxCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-600 transition-colors">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                SecureVote OTP
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Academic Election System
              </span>
            </div>
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${
                activeView === 'home' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('elections')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${
                activeView === 'elections' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              Active Elections
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className={`hover:text-slate-900 transition-colors cursor-pointer ${
                activeView === 'how-it-works' ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              How It Works
            </button>
            <button
              onClick={onOpenDocs}
              className="hover:text-slate-900 transition-colors cursor-pointer text-slate-600"
            >
              Academic Docs & Specs
            </button>
            {currentUser && (
              <button
                onClick={() => onNavigate('voter-dashboard')}
                className={`hover:text-slate-900 transition-colors cursor-pointer ${
                  activeView === 'voter-dashboard' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Voter Ballot Box
              </button>
            )}
            {currentAdmin && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`hover:text-slate-900 transition-colors cursor-pointer ${
                  activeView === 'admin-dashboard' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                Admin Console
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Simulated OTP Inbox button for evaluator testing */}
            <button
              onClick={onOpenInbox}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Open Simulated OTP Inbox (Dev/Demo Mode)"
            >
              <Mail className="w-5 h-5" />
              {unreadInboxCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadInboxCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 truncate max-w-[130px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {currentUser.studentId}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('voter-dashboard')}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Go to Voter Dashboard"
                >
                  <UserIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : currentAdmin ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 truncate max-w-[130px]">
                    {currentAdmin.fullName}
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold">
                    Election Officer
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-500/10 text-amber-900 rounded-lg hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  Admin Console
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Voter Login
                </button>
                <button
                  onClick={onOpenAdminAuth}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  Admin
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
          >
            Overview
          </button>
          <button
            onClick={() => {
              onNavigate('elections');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
          >
            Active Elections
          </button>
          <button
            onClick={() => {
              onNavigate('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onOpenDocs();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
          >
            Academic Documentation & Architecture
          </button>

          {!currentUser && !currentAdmin && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-white bg-slate-900 rounded-lg"
              >
                Voter Portal (Login / Register)
              </button>
              <button
                onClick={() => {
                  onOpenAdminAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                Admin Officer Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
