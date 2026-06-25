/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AboutMeData } from "../types";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Award,
  BookOpen,
  Briefcase,
  Heart,
  Globe,
} from "lucide-react";

interface AboutMePageProps {
  data: AboutMeData;
}

export default function AboutMePage({ data }: AboutMePageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" id="about-founder-portal">
      
      {/* Header Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-900 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-xl">
        {/* Glow background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        {/* Profile picture */}
        <div className="relative shrink-0 w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-lg">
          <img
            src={data.profilePhoto || null}
            alt={data.fullName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Primary Meta */}
        <div className="text-center md:text-left space-y-2.5">
          <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono font-bold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider">
            Uyaphi Founder
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-none">
            {data.fullName}
          </h1>
          <p className="text-sm font-semibold text-zinc-400 font-mono">
            {data.title}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3.5 pt-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-zinc-600 shrink-0" /> {data.location}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Biography, Wits Projects, and Focus Areas (Col-Span 8) */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Biography Block */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Professional Summary
            </h3>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line font-medium">
              {data.bio}
            </p>
          </div>

          {/* Real-world software experience & museum */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 md:p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Career & Software Development
            </h3>
            <div className="space-y-4">
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-850/60 space-y-2">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className="text-xs font-extrabold text-white">University of the Witwatersrand</h4>
                  <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono px-2 py-0.5 rounded font-bold uppercase">
                    Developer Team
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {data.witsProject}
                </p>
              </div>
            </div>
          </div>

          {/* Technology expertise, AI & cybersecurity focus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Passion & Core Interests
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                {data.passion}
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Leadership & Vision
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                {data.leadership}
              </p>
            </div>

          </div>

        </div>

        {/* Right Side: Quick contacts & languages (Col-Span 4) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Quick Contacts */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
              Direct Contact
            </h3>
            
            <div className="space-y-3.5 text-xs">
              
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">Phone</span>
                  <a href={`tel:${data.phone1}`} className="font-mono text-zinc-300 hover:text-white block">
                    {data.phone1}
                  </a>
                  {data.phone2 && (
                    <a href={`tel:${data.phone2}`} className="font-mono text-zinc-300 hover:text-white block mt-0.5">
                      {data.phone2}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">Email</span>
                  <a href={`mailto:${data.email}`} className="font-mono text-zinc-300 hover:text-white block break-all font-semibold">
                    {data.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Linkedin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase">LinkedIn Profile</span>
                  <a
                    href={`https://${data.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-amber-500 hover:text-amber-400 font-semibold block truncate"
                  >
                    {data.linkedin}
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Languages */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-zinc-500" /> Languages Spoken
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.languages.map((lang) => (
                <span
                  key={lang}
                  className="bg-zinc-950 text-zinc-300 border border-zinc-850 px-2.5 py-1 rounded text-xs font-semibold"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Credibility Badge */}
          <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl space-y-2">
            <h4 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
              Verified Developer Node
            </h4>
            <p className="text-[11px] text-zinc-400 leading-normal font-medium">
              This node operates under direct sovereign commuter consensus, developed as a student-led public welfare interface for commuter security and rideshare accountability.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
