import React, { useState } from "react";
import { Shield, Lock, Mail, User, ArrowRight, ArrowLeft, Terminal, AlertCircle } from "lucide-react";
import SafeRideLogo from "./SafeRideLogo";

interface AuthPageProps {
  onLogin: (name: string, email: string) => void;
  onAdminLogin: () => void;
}

export default function AuthPage({ onLogin, onAdminLogin }: AuthPageProps) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Normal User inputs
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  
  // Admin inputs
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isAdminMode) {
      if (adminUsername === "admin" && adminPassword === "safeAfrica@2026") {
        onAdminLogin();
      } else {
        setError("Invalid administrative credentials. Access Denied.");
      }
    } else {
      if (!email || !password || (isSignUp && !name)) {
        setError("Please fill in all required fields.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      // Successful normal login/signup
      onLogin(isSignUp ? name : name || email.split("@")[0], email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1F] text-white p-6 relative overflow-hidden font-sans select-none">
      {/* Decorative gradient glowing bubbles */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-950/80 border border-zinc-850 rounded-3xl p-8 shadow-2xl relative backdrop-blur-md">
        
        {/* Top Logo */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-block transform hover:scale-105 transition-transform">
            <SafeRideLogo variant="full" />
          </div>
          <p className="text-xs text-zinc-400 tracking-wide font-mono italic uppercase">
            Know Before You Go
          </p>
        </div>

        {/* Form Title & Header */}
        <div className="space-y-1 mb-6 text-center">
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">
            {isAdminMode 
              ? "Administrative Core" 
              : isSignUp 
                ? "Create Safety Account" 
                : "Secure Commuter Access"}
          </h2>
          <p className="text-xs text-zinc-400">
            {isAdminMode 
              ? "Secure operator gateway & regional moderation portal" 
              : "Verify credentials and contribute responsibly to Africa's safe transit"}
          </p>
        </div>

        {/* User-friendly Alert Box */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isAdminMode ? (
            /* ADMIN LOGIN */
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                  Admin Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Terminal className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                  Security Token Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </>
          ) : (
            /* USER LOGIN/SIGNUP */
            <>
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required={isSignUp}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ntobeko Zondi"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ntobekozondi98@gmail.com"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">
                  Account Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
              isAdminMode 
                ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/10" 
                : "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/10"
            }`}
          >
            <span>
              {isAdminMode 
                ? "Authenticate admin credentials" 
                : isSignUp 
                  ? "Register Safety Profile" 
                  : "Begin SafeRide Journey"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Separator & Toggle links */}
        <div className="mt-6 pt-4 border-t border-zinc-850 text-center space-y-3">
          {!isAdminMode && (
            <p className="text-xs text-zinc-500">
              {isSignUp ? "Already registered?" : "New to SafeRide Africa?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-amber-500 hover:text-amber-400 font-bold underline cursor-pointer"
              >
                {isSignUp ? "Log In here" : "Sign Up now"}
              </button>
            </p>
          )}

          {isAdminMode ? (
            <button
              onClick={() => {
                setIsAdminMode(false);
                setError(null);
              }}
              className="text-xs text-zinc-500 hover:text-white flex items-center gap-1.5 mx-auto font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Commuter Access
            </button>
          ) : (
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setIsAdminMode(true);
                  setError(null);
                }}
                className="text-[9px] font-mono tracking-widest text-zinc-600 hover:text-red-500 uppercase transition-colors cursor-pointer block mx-auto py-1"
              >
                🔒 Staff & Admin Gateway
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
