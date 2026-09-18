'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isAuthModalOpen, 
    authView, 
    closeAuthModal, 
    setAuthView, 
    setUser, 
    logout 
  } = useAuthStore();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Customer Orders state
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Status & loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch orders when authenticated and modal is open
  useEffect(() => {
    if (isAuthModalOpen && isAuthenticated && user?.email) {
      setIsLoadingOrders(true);
      fetch(`/api/user/orders?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserOrders(data.data || []);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingOrders(false));
    }
  }, [isAuthModalOpen, isAuthenticated, user?.email]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      setUser(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Demo login failed.');
      }

      setUser(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regFirstName,
          lastName: regLastName,
          email: regEmail,
          phone: regPhone,
          password: regPassword
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      setUser(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => !isSubmitting && closeAuthModal()} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-brand-deep text-white px-6 py-4 flex items-center justify-between border-b border-brand-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500 text-brand-deep flex items-center justify-center font-black font-serif text-sm">
              L
            </div>
            <div>
              <h3 className="font-serif font-bold text-base leading-tight">
                {isAuthenticated ? 'My Lakshmi Account' : 'Customer Sign In & Registration'}
              </h3>
              <p className="text-[10px] text-emerald-200">
                Lakshmi Stores UK • Authentic Indian Supermarket
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-emerald-300 hover:text-white hover:bg-brand-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW: LOGGED IN ACCOUNT DASHBOARD */}
          {/* =============================================================== */}
          {isAuthenticated && user ? (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-amber-50/40 p-4 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-brand-800 text-gold-400 font-bold text-lg flex items-center justify-center shadow-sm">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    {user.phone && <p className="text-[11px] text-slate-400">{user.phone}</p>}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {user.role}
                </span>
              </div>

              {/* Order History Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-serif font-bold text-sm text-brand-deep flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-brand-700" />
                    <span>My Recent Orders</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'} Placed
                  </span>
                </div>

                {isLoadingOrders ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 text-brand-700 animate-spin" />
                    <p className="text-xs text-slate-500 font-medium">Loading your orders from MongoDB...</p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Package className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold text-slate-700">No orders placed yet</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">
                      Explore our 2,433+ fresh groceries and place your first UK order!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.order_number || String(ord._id)}
                        className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 hover:border-brand-500/50 transition-all flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-brand-800">
                              {ord.order_number}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                              {ord.order_status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {new Date(ord.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}{' '}
                            • {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm text-slate-800">
                            £{ord.pricing_summary?.grand_total?.toFixed(2) || '0.00'}
                          </span>
                          <button
                            onClick={() => {
                              closeAuthModal();
                              router.push(`/orders/${ord.order_number}`);
                            }}
                            className="p-1.5 rounded-lg bg-brand-800 text-gold-400 hover:bg-brand-900 transition-colors cursor-pointer"
                            title="View order snapshot"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign Out CTA */}
              <button
                onClick={logout}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100/80 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>

            </div>
          ) : (
            /* =============================================================== */
            /* VIEW: AUTH TABS (SIGN IN / REGISTER) */
            /* =============================================================== */
            <div>
              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 mb-5">
                <button
                  onClick={() => setAuthView('login')}
                  className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    authView === 'login'
                      ? 'border-brand-800 text-brand-800'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setAuthView('register')}
                  className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    authView === 'register'
                      ? 'border-brand-800 text-brand-800'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Tab 1: Sign In */}
              {authView === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        required
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. priya@example.co.uk"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        required
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 text-gold-400" />
                        <span>Sign In to Account</span>
                      </>
                    )}
                  </button>

                  {/* Fast Demo Shortcuts */}
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center">
                      Quick Demo Credentials
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('customer@lakshmistores.co.uk')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-colors cursor-pointer"
                      >
                        <p className="text-[11px] font-bold text-slate-800">Priya Sundaram</p>
                        <p className="text-[9px] text-slate-500">Customer Seed</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('admin@lakshmistores.co.uk')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-gold-50 hover:border-gold-300 border border-slate-200 text-left transition-colors cursor-pointer"
                      >
                        <p className="text-[11px] font-bold text-slate-800">Administrator</p>
                        <p className="text-[9px] text-slate-500">Store Admin</p>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tab 2: Register */}
              {authView === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        First Name
                      </label>
                      <input
                        required
                        type="text"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder="Rajesh"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Last Name
                      </label>
                      <input
                        required
                        type="text"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder="Kumar"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        required
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="rajesh.kumar@example.co.uk"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      UK Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+44 7700 900077"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Password (min 6 chars)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        required
                        minLength={6}
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500/40 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-gold-400 font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                        <span>Creating account in MongoDB...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-gold-400" />
                        <span>Create Customer Account</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

