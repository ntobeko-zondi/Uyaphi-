/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface SafeRideLogoProps {
  variant?: "full" | "compact" | "icon";
  className?: string;
  height?: number | string;
}

export default function SafeRideLogo({
  variant = "compact",
  className = "",
  height,
}: SafeRideLogoProps) {
  const goldColor = "#D89B1D";

  if (variant === "icon") {
    return (
      <div className={`flex items-center justify-center ${className}`} id="sra-logo-icon">
        <div className="relative w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg">
          <span className="font-display font-black text-base text-white leading-none tracking-tighter">
            S<span className="text-[#D89B1D]">R</span>A
          </span>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#D89B1D] rounded-full ring-2 ring-zinc-950 animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`} id="sra-logo-compact">
        <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center shadow-md shrink-0">
          <span className="font-display font-black text-base text-white leading-none tracking-tighter">
            S<span className="text-[#D89B1D]">R</span>A
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-sm tracking-wider text-white leading-none">
              SAFE<span className="text-[#D89B1D]">RIDE</span>
            </span>
            <span className="text-[8px] bg-[#D89B1D] text-black font-mono font-extrabold px-1.5 py-0.5 rounded uppercase leading-none">
              AFRICA
            </span>
          </div>
          <span className="text-[8px] font-mono font-extrabold tracking-widest text-zinc-400 mt-1 uppercase leading-none">
            KNOW BEFORE YOU GO
          </span>
        </div>
      </div>
    );
  }

  // variant === "full"
  return (
    <div className={`flex flex-col items-center justify-center p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl text-center select-none ${className}`} id="sra-logo-full">
      <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-xl mb-3.5 relative">
        <span className="font-display font-black text-xl text-white leading-none tracking-tight">
          S<span className="text-[#D89B1D]">R</span>A
        </span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#D89B1D] rounded-full ring-2 ring-zinc-900 animate-pulse" />
      </div>
      <div className="space-y-1">
        <h1 className="font-display font-extrabold text-base text-white tracking-widest">
          SAFE<span className="text-[#D89B1D]">RIDE</span>
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] w-6 bg-zinc-800" />
          <span className="font-sans font-black text-[9px] text-zinc-400 tracking-[0.4em]">AFRICA</span>
          <div className="h-[1px] w-6 bg-zinc-800" />
        </div>
        <p className="font-mono font-extrabold text-[8px] text-[#D89B1D] tracking-[0.18em] uppercase pt-1">
          KNOW BEFORE YOU GO
        </p>
      </div>
    </div>
  );
}
