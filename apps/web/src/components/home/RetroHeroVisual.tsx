"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function RetroHeroVisual() {
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollY } = useScroll();

  // Progress from 0 to 1 as the user scrolls over extended distance for cinematic pacing
  const progress = useTransform(scrollY, [0, windowHeight * 2.0], [0, 1]);

  // ── PHASE 1: CHAOS SECTIONS EXIT ONE-BY-ONE ──
  // 1. Spreadsheet Exits First (lifts upward with gentle tilt and fade)
  const spreadsheetOpacity = useTransform(progress, [0.08, 0.28], [1, 0]);
  const spreadsheetY = useTransform(progress, [0.08, 0.28], [0, -60]);
  const spreadsheetScale = useTransform(progress, [0.08, 0.28], [1, 0.95]);
  const spreadsheetRotate = useTransform(progress, [0.08, 0.28], [0, -1]);

  // 2. Diary Exits Second (slides down-left)
  const diaryOpacity = useTransform(progress, [0.22, 0.44], [1, 0]);
  const diaryX = useTransform(progress, [0.22, 0.44], [0, -55]);
  const diaryY = useTransform(progress, [0.22, 0.44], [0, 35]);
  const diaryScale = useTransform(progress, [0.22, 0.44], [1, 0.94]);
  const diaryRotate = useTransform(progress, [0.22, 0.44], [0, -2.5]);

  // 3. Messaging App Exits Third (slides down-right)
  const messagesOpacity = useTransform(progress, [0.36, 0.56], [1, 0]);
  const messagesX = useTransform(progress, [0.36, 0.56], [0, 55]);
  const messagesY = useTransform(progress, [0.36, 0.56], [0, 35]);
  const messagesScale = useTransform(progress, [0.36, 0.56], [1, 0.94]);
  const messagesRotate = useTransform(progress, [0.36, 0.56], [0, 2.5]);


  // ── PHASE 2: DASHBOARD SECTIONS ARRIVE ONE-BY-ONE ──
  // Dashboard Container Base
  const dashboardContainerOpacity = useTransform(progress, [0.44, 0.58], [0, 1]);
  const dashboardContainerScale = useTransform(progress, [0.44, 0.58], [0.96, 1]);

  // 1. Dashboard Header Arrives First (descends from top)
  const headerOpacity = useTransform(progress, [0.48, 0.64], [0, 1]);
  const headerY = useTransform(progress, [0.48, 0.64], [-24, 0]);

  // 2. Top 3 KPI Cards Arrive Second (pop up from bottom)
  const kpiOpacity = useTransform(progress, [0.58, 0.74], [0, 1]);
  const kpiY = useTransform(progress, [0.58, 0.74], [28, 0]);
  const kpiScale = useTransform(progress, [0.58, 0.74], [0.96, 1]);

  // 3. Order Status Filter Chips Arrive Third (glide in from left)
  const filtersOpacity = useTransform(progress, [0.68, 0.84], [0, 1]);
  const filtersX = useTransform(progress, [0.68, 0.84], [-24, 0]);

  // 4. Orders Table Arrives Fourth to complete final view (glides in firmly from bottom)
  const tableOpacity = useTransform(progress, [0.78, 0.94], [0, 1]);
  const tableY = useTransform(progress, [0.78, 0.94], [32, 0]);

  return (
    <div className="relative mx-auto w-full max-w-[780px] h-[470px] sm:h-[495px] select-none perspective-1000">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. CHAOS SECTION: 3 INDEPENDENTLY ANIMATING SEGMENTS          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none gap-2.5">
        
        {/* ── SEGMENT 1: SPREADSHEET (EXITS FIRST ON SCROLL) ── */}
        <motion.div
          style={{
            opacity: spreadsheetOpacity,
            y: spreadsheetY,
            scale: spreadsheetScale,
            rotate: spreadsheetRotate,
          }}
          className="w-full h-[235px] sm:h-[245px] rounded-2xl border-2 border-emerald-600/30 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col"
        >
          {/* Excel Title Bar */}
          <div className="bg-[#107C41] px-3 py-1.5 flex items-center justify-between text-white text-[11px] font-sans shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold bg-white text-[#107C41] px-1 rounded text-[10px] leading-tight shrink-0">X</span>
              <span className="font-mono text-[10.5px]">Studio_Bookings_2026_MASTER.xlsx</span>
              <span className="text-[9.5px] text-emerald-200 font-mono hidden sm:inline">(Local Autosave: Off)</span>
            </div>
            <div className="flex items-center gap-2 text-[9.5px] text-emerald-100 font-mono">
              <span className="bg-white/20 px-1.5 py-0.2 rounded">Sheet1</span>
              <span className="text-red-200 font-bold hidden sm:inline">⚠️ Unsaved</span>
            </div>
          </div>

          {/* Formula Bar */}
          <div className="bg-[#F3F2F1] px-2.5 py-1 border-b border-[#D4D4D4] flex items-center gap-2 text-[10px] font-mono text-gray-700 shrink-0">
            <span className="font-bold text-gray-500 text-[11px]">fx</span>
            <span className="bg-white border border-[#C8C8C8] px-2 py-0.5 rounded-2xs flex-1 truncate text-gray-800 text-[9.5px]">
              =SUM(F2:F7)
            </span>
          </div>

          {/* Full Traditional Excel Table with ALL Columns */}
          <div className="flex-1 overflow-x-auto bg-white font-sans text-[10px]">
            <table className="w-full text-left border-collapse border border-[#D4D4D4]">
              <thead>
                <tr className="bg-[#E1DFDD] text-gray-700 text-[9px] border-b border-[#D4D4D4]">
                  <th className="p-1 px-1.5 border-r border-[#D4D4D4] w-6 text-center font-normal bg-[#D0CECB]"> </th>
                  <th className="p-1 px-2 border-r border-[#D4D4D4] font-semibold">Order</th>
                  <th className="p-1 px-2 border-r border-[#D4D4D4] font-semibold">Customer</th>
                  <th className="p-1 px-2 border-r border-[#D4D4D4] font-semibold">Event / Shoot</th>
                  <th className="p-1 px-2 border-r border-[#D4D4D4] font-semibold">Date</th>
                  <th className="p-1 px-2 border-r border-[#D4D4D4] font-semibold">Status</th>
                  <th className="p-1 px-2 border-r border-[#D4D4D4] text-right font-semibold">Amount</th>
                  <th className="p-1 px-2 text-right font-semibold">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-[9.5px] text-gray-800">
                <tr className="hover:bg-gray-50">
                  <td className="p-1 px-1.5 bg-[#F3F2F1] text-gray-500 text-center border-r border-[#D4D4D4] font-mono text-[9px]">1</td>
                  <td className="p-1 px-2 font-mono text-blue-700 underline border-r border-[#D4D4D4]">ORD-TES-261008-010906</td>
                  <td className="p-1 px-2 font-medium border-r border-[#D4D4D4]">Priya &amp; Arjun</td>
                  <td className="p-1 px-2 border-r border-[#D4D4D4]">Wedding</td>
                  <td className="p-1 px-2 font-mono text-gray-600 border-r border-[#D4D4D4]">2026-10-07</td>
                  <td className="p-1 px-2 border-r border-[#D4D4D4] text-gray-700">Post-Event In Progress</td>
                  <td className="p-1 px-2 text-right font-mono border-r border-[#D4D4D4]">₹1,50,000</td>
                  <td className="p-1 px-2 text-right font-mono text-red-600 font-medium">₹50,000</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-[#FBFBFA]">
                  <td className="p-1 px-1.5 bg-[#F3F2F1] text-gray-500 text-center border-r border-[#D4D4D4] font-mono text-[9px]">2</td>
                  <td className="p-1 px-2 font-mono text-blue-700 underline border-r border-[#D4D4D4]">ORD-TES-261008-004803</td>
                  <td className="p-1 px-2 font-medium border-r border-[#D4D4D4]">Vikram Sharma</td>
                  <td className="p-1 px-2 border-r border-[#D4D4D4]">Reception</td>
                  <td className="p-1 px-2 font-mono text-gray-600 border-r border-[#D4D4D4]">2026-10-06</td>
                  <td className="p-1 px-2 border-r border-[#D4D4D4] text-red-700 font-semibold bg-red-50/60">Pending Payment</td>
                  <td className="p-1 px-2 text-right font-mono border-r border-[#D4D4D4]">₹80,000</td>
                  <td className="p-1 px-2 text-right font-mono text-red-600 font-bold">₹30,000</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-1 px-1.5 bg-[#F3F2F1] text-gray-500 text-center border-r border-[#D4D4D4] font-mono text-[9px]">3</td>
                  <td className="p-1 px-2 font-mono text-blue-700 underline border-r border-[#D4D4D4]">ORD-TES-261008-004647</td>
                  <td className="p-1 px-2 font-medium border-r border-[#D4D4D4]">Divya Ramesh</td>
                  <td className="p-1 px-2 border-r border-[#D4D4D4]">Pre-Wedding</td>
                  <td className="p-1 px-2 font-mono text-gray-600 border-r border-[#D4D4D4]">2026-10-07</td>
                  <td className="p-1 px-2 border-r border-[#D4D4D4] text-gray-700">Post-Event In Progress</td>
                  <td className="p-1 px-2 text-right font-mono border-r border-[#D4D4D4]">₹45,000</td>
                  <td className="p-1 px-2 text-right font-mono text-red-600 font-medium">₹15,000</td>
                </tr>
                <tr className="hover:bg-gray-50 bg-[#FBFBFA]">
                  <td className="p-1 px-1.5 bg-[#F3F2F1] text-gray-500 text-center border-r border-[#D4D4D4] font-mono text-[9px]">4</td>
                  <td className="p-1 px-2 font-mono text-blue-700 underline border-r border-[#D4D4D4]">ORD-TES-261008-003234</td>
                  <td className="p-1 px-2 font-medium border-r border-[#D4D4D4]">Siva Krishna</td>
                  <td className="p-1 px-2 border-r border-[#D4D4D4]">Wedding</td>
                  <td className="p-1 px-2 font-mono text-gray-600 border-r border-[#D4D4D4]">2026-10-07</td>
                  <td className="p-1 px-2 border-r border-[#D4D4D4] text-gray-700">Post-Event In Progress</td>
                  <td className="p-1 px-2 text-right font-mono border-r border-[#D4D4D4]">₹3,20,000</td>
                  <td className="p-1 px-2 text-right font-mono text-red-700 font-bold bg-amber-50">₹1,00,000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Traditional Excel Sheet Tabs & Status Bar */}
          <div className="bg-[#F3F2F1] px-3 py-1 border-t border-[#D4D4D4] flex items-center justify-between text-[9px] text-gray-600 font-sans shrink-0">
            <div className="flex items-center gap-1 font-mono">
              <span className="bg-white border-t border-x border-[#A6A6A6] px-2 py-0.5 font-bold text-gray-900">
                Oct_Orders
              </span>
              <span className="px-1 text-gray-500">Nov_Shoots</span>
            </div>
            <span className="text-red-600 font-mono font-bold">Unreconciled Due: ₹1,95,000</span>
          </div>
        </motion.div>


        {/* ── BOTTOM ROW: DIARY & MESSAGING APP ── */}
        <div className="w-full h-[225px] sm:h-[238px] flex items-stretch justify-between">
          
          {/* ── SEGMENT 2: 65% HANDWRITTEN DIARY (EXITS SECOND ON SCROLL) ── */}
          <motion.div
            style={{
              opacity: diaryOpacity,
              x: diaryX,
              y: diaryY,
              scale: diaryScale,
              rotate: diaryRotate,
            }}
            className="w-[65%] h-full rounded-2xl border-2 border-amber-800/25 bg-[#FAF5E8] shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col justify-between"
          >
            {/* Diary Printed Top Header */}
            <div className="bg-[#F3EBD8] border-b border-[#D8D0BE] px-3 py-1.5 flex items-center justify-between text-[#8C5D35] font-mono text-[9.5px] font-bold shrink-0">
              <div className="flex items-center gap-2">
                <span>DAILY PLANNER 2026</span>
                <span className="text-gray-400 font-normal">|</span>
                <span className="text-[#8C2D19]">WEDNESDAY 07 OCT</span>
              </div>
              <span className="text-gray-500 text-[8.5px]">PAGE 104</span>
            </div>

            {/* Ruled Paper with Real Handwritten Notes */}
            <div
              className="flex-1 p-2.5 space-y-1.5 text-[#1E3A8A] leading-[20px] overflow-hidden"
              style={{
                fontFamily: "'Caveat', 'Kalam', 'Segoe Print', cursive",
                backgroundImage: "linear-gradient(transparent 19px, #E5DEC9 20px)",
                backgroundSize: "100% 20px",
              }}
            >
              <div className="text-[16px] font-bold text-[#8C2D19] tracking-wide">
                Today&apos;s Studio Shoot &amp; Crew Schedule:
              </div>

              <div className="text-[15px] leading-[19px] text-[#1E3A8A] font-semibold">
                <span className="text-[#8C2D19] font-bold">14th Dec Royal Wedding Lineup:</span><br />
                • Lead: Vijay (Sony A7IV) | Candid: Manoj (Prime 85mm) | Drone: Karthik
              </div>

              <div className="text-[14.5px] leading-[19px] text-gray-900 font-bold">
                Pending Collections Urgent:<br />
                • Sneha: Collect ₹25k at hall entrance | Siva: ₹1,00,000 (Send invoice)
              </div>

              <div className="text-[13.5px] line-through text-gray-500">
                • Format 4x 128GB Sony Tough cards (Done)
              </div>
            </div>

            {/* Diary Footer */}
            <div className="bg-[#F3EBD8] px-3 py-1 border-t border-[#D8D0BE] flex items-center justify-between text-[8px] font-mono text-[#8C5D35] shrink-0">
              <span>Studio Crew Logbook</span>
              <span className="text-gray-600 font-semibold">3 Shoots Pending</span>
            </div>
          </motion.div>


          {/* ── 5% GAP ── */}
          <div className="w-[5%]" aria-hidden="true" />


          {/* ── SEGMENT 3: 30% MESSAGING APP (EXITS THIRD ON SCROLL) ── */}
          <motion.div
            style={{
              opacity: messagesOpacity,
              x: messagesX,
              y: messagesY,
              scale: messagesScale,
              rotate: messagesRotate,
            }}
            className="w-[30%] h-full rounded-2xl border-2 border-blue-500/30 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col justify-between"
          >
            {/* Header */}
            <div className="bg-[#F8FAFC] border-b border-gray-200 px-2.5 py-1.5 text-gray-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                  P
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-bold text-gray-900 leading-tight truncate">Priya (Dec 14)</div>
                  <div className="text-[7.5px] text-gray-500">SMS • Text</div>
                </div>
              </div>
              <span className="text-blue-600 font-semibold text-[8.5px] shrink-0">Details</span>
            </div>

            {/* Notification */}
            <div className="bg-gray-50 border-b border-gray-200 px-2 py-0.5 text-[7.5px] flex items-center justify-between text-gray-700 shrink-0">
              <span className="truncate">💬 <strong>Vikram:</strong> &quot;Transfer tomorrow&quot;</span>
              <span className="bg-blue-600 text-white rounded-full px-1 text-[6.5px] font-bold">1</span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-2 space-y-1 text-[8.5px] leading-tight flex flex-col justify-end bg-[#F8FAFC] overflow-hidden">
              <div className="bg-[#E2E8F0] rounded-xl rounded-bl-xs p-1.5 max-w-[90%] text-gray-900 shadow-2xs">
                Available Dec 14 for wedding?
                <div className="text-[6.5px] text-gray-500 text-right mt-0.5">10:14 AM</div>
              </div>
              <div className="bg-[#007AFF] text-white ml-auto rounded-xl rounded-br-xs p-1.5 max-w-[90%] shadow-2xs">
                Yes! Package is ₹1,60,000.
                <div className="text-[6.5px] text-blue-100 text-right mt-0.5">Delivered</div>
              </div>
              <div className="bg-[#E2E8F0] rounded-xl rounded-bl-xs p-1.5 max-w-[90%] text-gray-900 shadow-2xs">
                Advance ₹50k sent! Ref: 429188.
                <div className="text-[6.5px] text-gray-500 text-right mt-0.5">10:25 AM</div>
              </div>
              <div className="bg-[#007AFF] text-white ml-auto rounded-xl rounded-br-xs p-1.5 max-w-[90%] shadow-2xs">
                Received! Booking blocked.
                <div className="text-[6.5px] text-blue-100 text-right mt-0.5">Delivered</div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="bg-white px-2 py-1 border-t border-gray-200 flex items-center gap-1 text-[8px] text-gray-500 shrink-0">
              <div className="bg-gray-100 rounded-full px-2 py-0.5 flex-1 text-gray-600 border border-gray-200 truncate text-[7.5px]">
                Text Message
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-[8px] font-bold">
                ↑
              </div>
            </div>
          </motion.div>

        </div>
      </div>


      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. DASHBOARD SECTION: ARRIVES IN ASSEMBLED STAGGERED SEQUENCE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          opacity: dashboardContainerOpacity,
          scale: dashboardContainerScale,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-full rounded-2xl border-2 border-[#D8D2C4] bg-white shadow-[0_20px_50px_rgba(28,25,23,0.12)] overflow-hidden flex flex-col">
          
          {/* ── STAGE 1: DASHBOARD HEADER (ARRIVES FIRST) ── */}
          <motion.div
            style={{
              opacity: headerOpacity,
              y: headerY,
            }}
            className="flex items-center justify-between p-3 sm:p-3.5 border-b border-border-default bg-[#FAF7F2] shrink-0"
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="badge-brand-blue text-[9.5px] py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary animate-pulse" />
                  Studio workspace • test-studio
                </span>
                <span className="badge-status-neutral text-[9px]">
                  OS Active
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-text-primary tracking-tight">
                Studio Business Dashboard
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex rounded-xl bg-brand-blue-primary text-white text-xs font-bold py-1.5 px-3 shadow-xs">
                Open OMS →
              </span>
            </div>
          </motion.div>

          {/* Dashboard Body Container */}
          <div className="p-3 sm:p-3.5 bg-white space-y-2.5">
            
            {/* ── STAGE 2: TOP 3 KPI CARDS (ARRIVE SECOND) ── */}
            <motion.div
              style={{
                opacity: kpiOpacity,
                y: kpiY,
                scale: kpiScale,
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5"
            >
              {/* Metric 1: Revenue with trend timeline */}
              <div className="rounded-xl border border-border-default bg-[#FAF7F2]/60 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">Revenue</span>
                  <span className="text-[8.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    +14.2% vs prev
                  </span>
                </div>
                <div className="mt-1 text-lg sm:text-xl font-black text-brand-blue-primary tracking-tight">
                  ₹5,80,000
                </div>
                
                {/* Sparkline curve with timeline dates */}
                <div className="mt-1 pt-1 border-t border-border-default/60">
                  <div className="flex items-center justify-between text-[7.5px] font-mono text-text-tertiary">
                    <span>13/9</span>
                    <span>20/9</span>
                    <span>27/9</span>
                    <span className="font-bold text-brand-blue-primary">4/10</span>
                  </div>
                  <div className="h-3.5 w-full mt-0.5">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 120 20" preserveAspectRatio="none">
                      <path
                        d="M 0 16 Q 30 14, 40 10 T 80 11 T 120 3"
                        fill="none"
                        stroke="#0D9488"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="120" cy="3" r="3" fill="#0D9488" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Metric 2: Orders Count with trend timeline */}
              <div className="rounded-xl border border-border-default bg-[#FAF7F2]/60 p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary">Orders</span>
                  <span className="text-[8.5px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    +20% vs prev
                  </span>
                </div>
                <div className="mt-1 text-lg sm:text-xl font-black text-text-primary tracking-tight">
                  6 Confirmed
                </div>

                {/* Timeline dates */}
                <div className="mt-1 pt-1 border-t border-border-default/60">
                  <div className="flex items-center justify-between text-[7.5px] font-mono text-text-tertiary">
                    <span>13/9</span>
                    <span>20/9</span>
                    <span>27/9</span>
                    <span className="font-bold text-text-primary">4/10</span>
                  </div>
                  <div className="h-3.5 w-full mt-0.5">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 120 20" preserveAspectRatio="none">
                      <path
                        d="M 0 15 Q 30 16, 40 12 T 80 9 T 120 4"
                        fill="none"
                        stroke="#E85D04"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="120" cy="4" r="3" fill="#E85D04" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Metric 3: Pending Collections */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-orange-primary">
                  Pending Collections
                </span>
                <div className="mt-1 text-lg sm:text-xl font-black text-brand-orange-primary tracking-tight">
                  ₹1,80,000
                </div>
                <p className="mt-1 text-[9px] text-amber-900/80 font-medium leading-tight">
                  Outstanding balance tracked automatically from active orders
                </p>
              </div>
            </motion.div>

            {/* ── STAGE 3: ORDER STATUS ACTION CHIPS (ARRIVE THIRD) ── */}
            <motion.div
              style={{
                opacity: filtersOpacity,
                x: filtersX,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-text-secondary">
                  Order Status Filters
                </span>
                <span className="text-[8.5px] text-text-tertiary">
                  Click a status to filter the Orders table below
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-lg border border-brand-blue-primary bg-brand-blue-background/40 px-2 py-0.5 text-[8.5px] font-bold text-brand-blue-primary shadow-2xs">
                  All Confirmed (6)
                </span>
                <span className="rounded-lg border border-brand-blue-soft bg-white px-2 py-0.5 text-[8.5px] font-semibold text-text-secondary">
                  Awaiting Event (1)
                </span>
                <span className="rounded-lg border border-brand-orange-soft bg-brand-orange-background/30 px-2 py-0.5 text-[8.5px] font-bold text-brand-orange-primary">
                  Post-Event In Progress (4)
                </span>
                <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[8.5px] font-bold text-emerald-700">
                  Completed (1)
                </span>
              </div>
            </motion.div>

            {/* ── STAGE 4: AUTHENTIC ORDERS TABLE (ARRIVES FOURTH TO COMPLETE THE VIEW) ── */}
            <motion.div
              style={{
                opacity: tableOpacity,
                y: tableY,
              }}
              className="rounded-xl border border-border-default bg-white overflow-hidden shadow-2xs"
            >
              <table className="w-full text-left border-collapse text-[9px]">
                <thead>
                  <tr className="bg-[#FAF7F2] text-text-secondary font-bold border-b border-border-default uppercase tracking-wider text-[8px]">
                    <th className="p-1.5 px-2">Order</th>
                    <th className="p-1.5 px-2">Customer</th>
                    <th className="p-1.5 px-2">Event / Shoot</th>
                    <th className="p-1.5 px-2">Date</th>
                    <th className="p-1.5 px-2">Status</th>
                    <th className="p-1.5 px-2 text-right">Amount</th>
                    <th className="p-1.5 px-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default/60 font-mono text-[8.5px]">
                  <tr className="hover:bg-[#FAF7F2] transition">
                    <td className="p-1.5 px-2 font-bold text-brand-blue-primary">ORD-TES-261008-010906</td>
                    <td className="p-1.5 px-2 font-sans font-semibold text-text-primary">Priya &amp; Arjun</td>
                    <td className="p-1.5 px-2 font-sans text-text-secondary">Wedding</td>
                    <td className="p-1.5 px-2 text-text-tertiary">2026-10-07</td>
                    <td className="p-1.5 px-2">
                      <span className="badge-brand-orange text-[7.5px] py-0.2">Post-Event In Progress</span>
                    </td>
                    <td className="p-1.5 px-2 text-right font-bold text-text-primary">₹1,50,000</td>
                    <td className="p-1.5 px-2 text-right font-bold text-brand-orange-primary">₹50,000</td>
                  </tr>
                  <tr className="hover:bg-[#FAF7F2] transition">
                    <td className="p-1.5 px-2 font-bold text-brand-blue-primary">ORD-TES-261008-004803</td>
                    <td className="p-1.5 px-2 font-sans font-semibold text-text-primary">Vikram Sharma</td>
                    <td className="p-1.5 px-2 font-sans text-text-secondary">Reception</td>
                    <td className="p-1.5 px-2 text-text-tertiary">2026-10-06</td>
                    <td className="p-1.5 px-2">
                      <span className="badge-brand-orange text-[7.5px] py-0.2">Post-Event In Progress</span>
                    </td>
                    <td className="p-1.5 px-2 text-right font-bold text-text-primary">₹80,000</td>
                    <td className="p-1.5 px-2 text-right font-bold text-brand-orange-primary">₹30,000</td>
                  </tr>
                  <tr className="hover:bg-[#FAF7F2] transition bg-amber-50/20">
                    <td className="p-1.5 px-2 font-bold text-brand-blue-primary">ORD-TES-261008-003234</td>
                    <td className="p-1.5 px-2 font-sans font-bold text-text-primary">Siva Krishna</td>
                    <td className="p-1.5 px-2 font-sans text-text-secondary">Wedding</td>
                    <td className="p-1.5 px-2 text-text-tertiary">2026-10-07</td>
                    <td className="p-1.5 px-2">
                      <span className="badge-brand-orange text-[7.5px] py-0.2">Post-Event In Progress</span>
                    </td>
                    <td className="p-1.5 px-2 text-right font-bold text-text-primary">₹3,20,000</td>
                    <td className="p-1.5 px-2 text-right font-black text-brand-orange-primary">₹1,00,000</td>
                  </tr>
                  <tr className="hover:bg-[#FAF7F2] transition">
                    <td className="p-1.5 px-2 font-bold text-brand-blue-primary">ORD-TES-261007-235733</td>
                    <td className="p-1.5 px-2 font-sans font-semibold text-text-primary">Ananya &amp; Rohit</td>
                    <td className="p-1.5 px-2 font-sans text-text-secondary">Wedding</td>
                    <td className="p-1.5 px-2 text-text-tertiary">2026-10-14</td>
                    <td className="p-1.5 px-2">
                      <span className="badge-brand-blue text-[7.5px] py-0.2">Awaiting Event</span>
                    </td>
                    <td className="p-1.5 px-2 text-right font-bold text-text-primary">₹2,50,000</td>
                    <td className="p-1.5 px-2 text-right font-bold text-emerald-700 bg-emerald-50/60">Paid</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>

          </div>

        </div>
      </motion.div>

    </div>
  );
}
