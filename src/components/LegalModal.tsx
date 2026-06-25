import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Cookie, FileCheck, Landmark, ShieldAlert, BookOpen, Fingerprint } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: "privacy" | "terms" | "cookies" | "disclosure" | "directory" | "certificate" | "editCookies" | "conduct";
}

export default function LegalModal({ isOpen, onClose, documentType }: LegalModalProps) {
  const [prefCookies, setPrefCookies] = useState(true);
  const [analCookies, setAnalCookies] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPrefCookies(localStorage.getItem("cookie_preferences_saved") !== "false");
      setAnalCookies(localStorage.getItem("cookie_analytics_saved") === "true");
      setSaveStatus("");
    }
  }, [isOpen, documentType]);

  if (!isOpen) return null;

  const handleSaveCookies = () => {
    localStorage.setItem("cookie_preferences_saved", prefCookies.toString());
    localStorage.setItem("cookie_analytics_saved", analCookies.toString());
    setSaveStatus("Cookie settings saved successfully!");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const renderContent = () => {
    switch (documentType) {
      case "privacy":
        return (
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2">
              <ShieldCheck className="w-5 h-5" />
              <span>COMMUTER PRIVACY POLICY (POPIA & GDPR COMPLIANT)</span>
            </div>
            <p>
              Uyaphi is strictly committed to protecting the private data of commuters across the African continent. In compliance with the Protection of Personal Information Act (POPIA) in South Africa and global General Data Protection Regulation (GDPR) standards, we handle all personal information with extreme care.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">1. Information Collection and De-Identification</h4>
            <p>
              When logging an incident, you can choose to activate "De-identify Passenger Profile". Under this setting, your real name, email address, and avatar are omitted from all public records and are visible solely to verified safety moderators.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">2. Driver and Vehicle Verification Log</h4>
            <p>
              Vehicle information and driver profiles are curated via crowdsourced reports and regional safety databases. We ensure all personal indicators conform to public safety exceptions and do not compromise lawful individual privacy.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">3. Secure Data Sovereignty</h4>
            <p>
              Your logs are encrypted and hosted securely within sovereign regional server centers. We never rent, sell, or trade your safety log reports with third-party advertising companies.
            </p>
          </div>
        );

      case "terms":
        return (
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2">
              <BookOpen className="w-5 h-5" />
              <span>TERMS OF SERVICE</span>
            </div>
            <p>
              By accessing Uyaphi, you agree to abide by these Terms of Service. This platform is designed to promote commuter safety, reduce transit hazards, and provide transparency for e-hailing and commuter networks.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">1. Responsibility in Incident Reporting</h4>
            <p>
              All incidents must be documented honestly, accurately, and in good faith. Commuters are strictly prohibited from submitting falsified, malicious, or fabricated records. Falsified reports degrade community safety scores and may lead to permanent banishment from our safety system.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">2. Limitation of Liability</h4>
            <p>
              While we verify records, crowdsourced data is subjective. Uyaphi does not guarantee the absolute safety or operational compliance of any listed vehicle or driver and is not liable for transport outcomes.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">3. Account Integrity</h4>
            <p>
              You must maintain the security of your commuter account details. Uyaphi will log and monitor security credentials to maintain POPIA reporting compliance.
            </p>
          </div>
        );

      case "cookies":
        return (
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2">
              <Cookie className="w-5 h-5" />
              <span>COOKIES DIRECTIVE</span>
            </div>
            <p>
              Uyaphi uses cookies and local browser storage to provide a personalized, secure, and accessible experience on our website.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">What are Cookies?</h4>
            <p>
              Cookies are small text data tokens stored in your browser. We prioritize your privacy and minimize unnecessary analytics trackers wherever possible.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">How we use them:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Essential Cookies:</strong> Used to persist your login state, secure staff session tokens, and coordinate multi-language selections.</li>
              <li><strong>Preferences Storage:</strong> Used to save your text scaling size, accessibility contrasts, and voice assistance states.</li>
            </ul>
            <p>
              You can adjust these settings at any time by clicking the "Edit Cookies" tab in our website's footer.
            </p>
          </div>
        );

      case "disclosure":
        return (
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2">
              <ShieldAlert className="w-5 h-5" />
              <span>RESPONSIBLE DISCLOSURE POLICY</span>
            </div>
            <p>
              The security of Uyaphi is our absolute top priority. If you are a cybersecurity researcher or developer, we encourage you to report vulnerabilities in our system responsibly.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">Rules of Engagement</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Do not access, modify, or delete user data that does not belong to you.</li>
              <li>Do not execute Denial of Service (DoS) attacks or compromise system availability.</li>
              <li>Report findings directly and securely to <strong>ntobekozondi99@gmail.com</strong>.</li>
            </ul>
            <p>
              We promise to investigate reports swiftly and will not pursue legal action against researchers who comply with these responsible disclosure parameters.
            </p>
          </div>
        );

      case "directory":
        return (
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2">
              <Landmark className="w-5 h-5" />
              <span>REGIONAL VEHICLE DIRECTORY STATUS</span>
            </div>
            <p>
              The Uyaphi central Directory catalogs verified e-hailing vehicles, municipal minibusses, and verified rideshare operators across prominent African metropolitan centers.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">Directory Parameters</h4>
            <p>
              Each listing records standard public vehicle registrations, manufacturer make/models, operating cities, active safety rating metrics, and community reports.
            </p>
            <p>
              This is a sovereign, public interest index compiled for safety auditing. If your vehicle plate is listed and you require compliance editing, please file a request with administrative moderators.
            </p>
          </div>
        );

      case "certificate":
        return (
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2">
              <FileCheck className="w-5 h-5" />
              <span>PUBLICATION CERTIFICATE</span>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2 text-[11px] font-mono">
              <p className="text-zinc-500">ISSUER: UYAPHI AUDITING OFFICE</p>
              <p className="text-white font-bold">DIGITAL CERTIFICATE SHA-256 ENCRYPTED</p>
              <p className="text-amber-500">CERT-STATUS: ACTIVE & VALID</p>
              <p className="text-zinc-400">HASH: 9fb2c88d89ee52e257cf01a403d98ef57e3f804f</p>
            </div>
            <p>
              This certificate verifies that Uyaphi publishes citizen safety logs in full conformity with POPIA data processing rules, ensuring crowdsourced records are cryptographic, immutable, and digitally auditable.
            </p>
          </div>
        );

      case "editCookies":
        return (
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2">
              <Cookie className="w-5 h-5" />
              <span>EDIT COOKIE PREFERENCES</span>
            </div>
            <p>
              Manage which cookies and tracking states are enabled on your computer or mobile browser. Required functional elements cannot be deactivated.
            </p>

            <div className="space-y-3.5 mt-4">
              <div className="flex items-start justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div className="pr-4">
                  <h5 className="font-bold text-white text-xs">Essential Functional Cookies (Required)</h5>
                  <p className="text-[10px] text-zinc-400">Maintains secure authorization states, theme selection, and language selector coordinates. Always active.</p>
                </div>
                <div className="w-8 h-4 bg-zinc-800 text-amber-500 text-[9px] font-mono font-bold flex items-center justify-center rounded">ON</div>
              </div>

              <div className="flex items-start justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div className="pr-4">
                  <h5 className="font-bold text-white text-xs">Acoustic & UI Preferences (Recommended)</h5>
                  <p className="text-[10px] text-zinc-400">Remembers accessibility configurations, high legibility layouts, and vocal assistance parameters.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefCookies}
                  onChange={(e) => setPrefCookies(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-850 text-amber-500 w-4 h-4 cursor-pointer mt-1"
                />
              </div>

              <div className="flex items-start justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <div className="pr-4">
                  <h5 className="font-bold text-white text-xs">Analytical Logs Tracking</h5>
                  <p className="text-[10px] text-zinc-400">Allows anonymous tracking of search metrics to optimize safety score calculations.</p>
                </div>
                <input
                  type="checkbox"
                  checked={analCookies}
                  onChange={(e) => setAnalCookies(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-850 text-amber-500 w-4 h-4 cursor-pointer mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-emerald-400 text-[11px] font-semibold">{saveStatus}</span>
              <button
                onClick={handleSaveCookies}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wide rounded-lg cursor-pointer transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        );

      case "conduct":
        return (
          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm border-b border-zinc-800 pb-2">
              <Fingerprint className="w-5 h-5" />
              <span>COMMUNITY CODE OF CONDUCT</span>
            </div>
            <p>
              Uyaphi thrives on citizen collaboration, mutual respect, and honest representation. All community members must uphold high moral integrity.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">1. Absolute Reporting Integrity</h4>
            <p>
              Every logged safety statement must reflect genuine experiences. False accusations, commercial disputes, or target defamation will not be tolerated.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">2. No Hate Speech or Harassment</h4>
            <p>
              We maintain professional safety reporting. Demeaning expressions, profiling, or discriminatory language within reports will trigger instant moderation dismissals.
            </p>
            <h4 className="font-bold text-white text-xs mt-3">3. Constructive Collaboration</h4>
            <p>
              Commuters and drivers are both key partners in public safety. Focus logs on specific, objective events such as reckless speeding, licensing anomalies, or exemplary driver security.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-850 rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mt-2 font-sans">
          {renderContent()}
        </div>

        <div className="flex justify-end pt-5 mt-5 border-t border-zinc-900">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs uppercase tracking-wide rounded-lg cursor-pointer transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
