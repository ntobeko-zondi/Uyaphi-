import React from "react";
import { Volume2, VolumeX, Eye, Moon, Sun, Type, Sliders, Shield } from "lucide-react";

interface SettingsPageProps {
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  voiceAssist: boolean;
  setVoiceAssist: (val: boolean) => void;
  textSize: "normal" | "large" | "xl";
  setTextSize: (val: "normal" | "large" | "xl") => void;
  isDyslexic: boolean;
  setIsDyslexic: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  speak: (text: string) => void;
}

export default function SettingsPage({
  isDark,
  setIsDark,
  voiceAssist,
  setVoiceAssist,
  textSize,
  setTextSize,
  isDyslexic,
  setIsDyslexic,
  highContrast,
  setHighContrast,
  speak
}: SettingsPageProps) {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[9px] font-mono text-amber-500 font-extrabold uppercase tracking-widest block mb-1">
          [ PREFERENCES & ACCESSIBILITY ]
        </span>
        <h2 className="text-2xl font-bold tracking-tight">
          System Preferences
        </h2>
        <p className="text-xs text-zinc-400">
          Tailor the interface styling, audio guidance, and typography to fit your cognitive and physical needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Voice Assistant settings panel */}
        <div className="bg-zinc-950/40 border border-zinc-850 rounded-3xl p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5 border-b border-zinc-850 pb-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">SRA Voice Guidance</h3>
              <p className="text-[11px] text-zinc-500">Screen reader assistance & dynamic prompts</p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            The integrated platform Voice Assistant provides real-time voice navigation, prompts warnings, reads out achievement badges, and describes screen states. Designed for visually impaired or low-literacy commuters.
          </p>

          <div className="flex items-center justify-between p-4 bg-zinc-900/60 border border-zinc-850 rounded-2xl">
            <span className="text-xs font-bold text-zinc-300">Voice Assistant Enable</span>
            
            {/* Simple professional [ ON ] [ OFF ] controls */}
            <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-800 shrink-0 text-xs font-semibold">
              <button
                onClick={() => {
                  setVoiceAssist(true);
                  speak("Voice Assistant enabled. Dynamic screen reading is now active.");
                }}
                className={`px-4 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                  voiceAssist 
                    ? "bg-amber-500 text-black font-extrabold shadow-md" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                ON
              </button>
              <button
                onClick={() => {
                  setVoiceAssist(false);
                  speak("Voice Assistant deactivated.");
                }}
                className={`px-4 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                  !voiceAssist 
                    ? "bg-zinc-800 text-zinc-300 font-extrabold" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                OFF
              </button>
            </div>
          </div>
        </div>

        {/* 2. Visual Theme & Accent Preferences */}
        <div className="bg-zinc-950/40 border border-zinc-850 rounded-3xl p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5 border-b border-zinc-850 pb-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Visual Mode</h3>
              <p className="text-[11px] text-zinc-500">Control brightness, contrast, and color balance</p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Choose between dark mode for lower eye-strain at night, high contrast mode for daylight visibility, or light mode.
          </p>

          <div className="space-y-3">
            {/* Theme Toggle Button Row */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900/60 border border-zinc-850 rounded-2xl">
              <span className="text-xs font-bold text-zinc-300">Contrast Color Scheme</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsDark(true);
                    speak("Switched to Dark mode");
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    isDark && !highContrast
                      ? "bg-amber-500 text-black border-amber-500"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark Mode
                </button>
                <button
                  onClick={() => {
                    setIsDark(false);
                    speak("Switched to Light mode");
                  }}
                  className={`p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    !isDark && !highContrast
                      ? "bg-amber-500 text-black border-amber-500"
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light Mode
                </button>
              </div>
            </div>

            {/* High Contrast Toggle Row */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900/60 border border-zinc-850 rounded-2xl">
              <span className="text-xs font-bold text-zinc-300">High Contrast Mode</span>
              <button
                onClick={() => {
                  setHighContrast(!highContrast);
                  speak(`High contrast mode ${!highContrast ? "activated" : "deactivated"}`);
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  highContrast
                    ? "bg-yellow-400 text-black border-yellow-400 font-extrabold"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {highContrast ? "ACTIVE" : "DISABLED"}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Typography and Accessibility Scalability */}
        <div className="bg-zinc-950/40 border border-zinc-850 rounded-3xl p-6 space-y-4 shadow-md md:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-zinc-850 pb-3">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Typography & Accessibility Tools</h3>
              <p className="text-[11px] text-zinc-500">Enable specialized fonts and layout scale for reading ease</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Text Scaling Selection */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-2xl space-y-3">
              <div>
                <h4 className="text-xs font-bold text-zinc-300">Text Scaling Sizing</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Increases layout padding and font height dynamically</p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 border border-zinc-800 rounded-xl">
                {(["normal", "large", "xl"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      setTextSize(sz);
                      speak(`Text size scaled to ${sz}`);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer uppercase transition-all ${
                      textSize === sz
                        ? "bg-amber-500 text-black font-extrabold"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexic Font Toggle */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-300">Dyslexia-Friendly Typeface</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Applies heavy bottomed characters to facilitate reading</p>
              </div>

              <button
                onClick={() => {
                  setIsDyslexic(!isDyslexic);
                  speak(`Dyslexia friendly font ${!isDyslexic ? "activated" : "deactivated"}`);
                }}
                className={`w-full py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  isDyslexic
                    ? "bg-amber-500 text-black border-amber-500 font-extrabold"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {isDyslexic ? "DYSLEXIC FONT ACTIVE" : "APPLY OPEN-DYSLEXIC"}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
