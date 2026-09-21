"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LanguageMode = "en" | "thanglish" | "ta_easy" | "ta_pure";

export interface LanguageContextType {
  language: LanguageMode;
  tamilDepth: number; // 1: English, 2: Thanglish, 3: Simple Tamil (Default Tamil), 4: Pure Tamil
  setLanguage: (lang: LanguageMode) => void;
  setTamilDepth: (depth: number) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Depth mapping:
// 1 -> en
// 2 -> thanglish
// 3 -> ta_easy (Default Tamil: Modern & Studio Terms)
// 4 -> ta_pure (Full / Deep Classical Tamil)
export const DEPTH_TO_LANG: Record<number, LanguageMode> = {
  1: "en",
  2: "thanglish",
  3: "ta_easy",
  4: "ta_pure",
};

export const LANG_TO_DEPTH: Record<LanguageMode, number> = {
  en: 1,
  thanglish: 2,
  ta_easy: 3,
  ta_pure: 4,
};

export const LANG_LABELS: Record<LanguageMode, { name: string; nativeName: string; desc: string; badge: string }> = {
  en: {
    name: "English",
    nativeName: "English",
    desc: "Standard English interface",
    badge: "En",
  },
  thanglish: {
    name: "Thanglish",
    nativeName: "Thanglish (Tamil in English)",
    desc: "Spoken Tamil in English script with business terms",
    badge: "த/En",
  },
  ta_easy: {
    name: "Modern Tamil",
    nativeName: "தமிழ்",
    desc: "Tamil interface",
    badge: "த",
  },
  ta_pure: {
    name: "Pure Tamil",
    nativeName: "தூய தமிழ்",
    desc: "Full Tamil interface",
    badge: "த",
  },
};

const translations: Record<string, Record<LanguageMode, string>> = {
  // Navigation
  "nav.home": {
    en: "Home",
    thanglish: "Home",
    ta_easy: "முகப்பு",
    ta_pure: "முகப்பு",
  },
  "nav.features": {
    en: "Features",
    thanglish: "Features",
    ta_easy: "அம்சங்கள்",
    ta_pure: "அம்சங்கள்",
  },
  "nav.pricing": {
    en: "Pricing",
    thanglish: "Pricing",
    ta_easy: "விலைப்பட்டியல்",
    ta_pure: "விலைப்பட்டியல்",
  },
  "nav.marketplace": {
    en: "Studio Marketplace",
    thanglish: "Studio Marketplace",
    ta_easy: "ஸ்டுடியோ சந்தை",
    ta_pure: "ஸ்டுடியோ சந்தை",
  },
  "nav.about": {
    en: "About Us",
    thanglish: "About Us",
    ta_easy: "எங்களைப் பற்றி",
    ta_pure: "எங்களைப் பற்றி",
  },
  "nav.signin": {
    en: "Sign In",
    thanglish: "Sign In",
    ta_easy: "உள்நுழைக",
    ta_pure: "உள்நுழைக",
  },
  "nav.signout": {
    en: "Sign Out",
    thanglish: "Sign Out",
    ta_easy: "வெளியேறுக",
    ta_pure: "வெளியேறுக",
  },
  "nav.workspaces": {
    en: "My Workspaces",
    thanglish: "My Workspaces",
    ta_easy: "பணியிடங்கள்",
    ta_pure: "எனது பணியிடங்கள்",
  },
  "nav.settings": {
    en: "Account Settings",
    thanglish: "Account Settings",
    ta_easy: "கணக்கு அமைப்புகள்",
    ta_pure: "கணக்கு அமைப்புகள்",
  },
  "nav.explore_modules": {
    en: "Explore Detailed Module Breakdown →",
    thanglish: "Explore Detailed Module Breakdown →",
    ta_easy: "முழுமையான தொகுதி விவரங்களைக் காண்க →",
    ta_pure: "முழுமையான தொகுதி விவரங்களைக் காண்க →",
  },
  "nav.back": {
    en: "Back",
    thanglish: "Back",
    ta_easy: "திரும்பு",
    ta_pure: "பின்செல்க",
  },
  "nav.switch": {
    en: "Switch",
    thanglish: "Switch",
    ta_easy: "மாற்றுக",
    ta_pure: "மாற்றுக",
  },
  "nav.theme": {
    en: "Theme",
    thanglish: "Theme",
    ta_easy: "வண்ண நடை",
    ta_pure: "வண்ண நடை",
  },
  "nav.dashboard": {
    en: "Dashboard",
    thanglish: "Dashboard",
    ta_easy: "கட்டுப்பாட்டுத் தளம்",
    ta_pure: "கட்டுப்பாட்டுத் தளம்",
  },

  // Hero Section
  "hero.badge": {
    en: "Focus beyond the frames",
    thanglish: "Focus beyond the frames",
    ta_easy: "சட்டகங்களைத் தாண்டிய கவனம்",
    ta_pure: "சட்டகங்களைத் தாண்டிய கவனம்",
  },
  "hero.title_part1": {
    en: "A Complete Business Operating System for",
    thanglish: "A Complete Business Operating System for",
    ta_easy: "ஒளிப்பட நிலையங்களுக்கான",
    ta_pure: "ஒளிப்பட நிலையங்களுக்கான",
  },
  "hero.title_highlight": {
    en: "Photography Studios",
    thanglish: "Photography Studios",
    ta_easy: "முழுமையான வணிக இயக்க அமைப்பு",
    ta_pure: "முழுமையான வணிக இயக்க அமைப்பு",
  },
  "hero.description": {
    en: "Bring your studio’s work, people, and orders together in one place and spend less time managing the work, more time creating.",
    thanglish: "உங்கள் studio work, crew, மற்றும் orders அனைத்தையும் ஒரே இடத்தில் manage செய்து time சேமிக்கவும்.",
    ta_easy: "உங்கள் நிலையத்தின் பணிகள், பணிக் குழுவினர் மற்றும் ஆணைகளை ஒரே இடத்தில் ஒருங்கிணைத்து, மேலாண்மை நேரத்தைக் குறைத்து ஆக்கப்பூர்வ பணிகளில் அதிக கவனம் செலுத்துங்கள்.",
    ta_pure: "உங்கள் நிலையத்தின் பணிகள், பணிக் குழுவினர் மற்றும் ஆணைகளை ஒரே இடத்தில் ஒருங்கிணைத்து, மேலாண்மை நேரத்தைக் குறைத்து ஆக்கப்பூர்வ பணிகளில் அதிக கவனம் செலுத்துங்கள்.",
  },
  "hero.cta_get_started": {
    en: "Get Started with Focoman",
    thanglish: "Get Started with Focoman",
    ta_easy: "இலவசமாகத் தொடங்குக",
    ta_pure: "இலவசமாகத் தொடங்குக",
  },
  "hero.cta_view_demo": {
    en: "Explore Demo Workspace",
    thanglish: "Explore Demo Workspace",
    ta_easy: "நேரடி செயல்முறையைக் காண்க",
    ta_pure: "நேரடி செயல்முறையைக் காண்க",
  },

  // Modules Overview & The Challenge We Solve
  "modules.title": {
    en: "The Challenge We Solve",
    thanglish: "The Challenge We Solve",
    ta_easy: "நாம் தீர்க்கும் சவால்கள்",
    ta_pure: "நாம் தீர்க்கும் சவால்கள்",
  },
  "modules.subtitle": {
    en: "Photography studio owners lose countless hours tracking shoots, chasing deliverables, updating spreadsheets, and managing payments. Focoman brings it all together, so you always know what’s happening, what’s pending, and what needs attention next.",
    thanglish: "Shoots track செய்வது, pending deliverables follow-up, spreadsheets maintain செய்வது, மற்றும் payments manage செய்வதில் studio owners அதிக time spend செய்கிறார்கள். Focoman இவை அனைத்தையும் ஒரே இடத்தில் கொண்டு வந்து, எப்போது என்ன pending-ல் உள்ளது என்பதை தெளிவாகக் காட்டும்.",
    ta_easy: "படப்பிடிப்பு கண்காணிப்பு, நிலுவை ஒப்படைப்புகள், விரிதாள்கள் பராமரிப்பு மற்றும் கட்டண வசூல் ஆகியவற்றில் ஒளிப்பட நிலைய உரிமையாளர்கள் எண்ணற்ற மணிநேரங்களை இழக்கின்றனர். போக்கோமேன் அனைத்தையும் ஒன்றிணைத்து, என்ன நடக்கிறது, என்ன நிலுவையில் உள்ளது, அடுத்து என்ன செய்ய வேண்டும் என்பதை எப்போதும் உங்களுக்குத் தெரியப்படுத்துகிறது.",
    ta_pure: "படப்பிடிப்பு கண்காணிப்பு, நிலுவை ஒப்படைப்புகள், விரிதாள்கள் மற்றும் கட்டண வசூல் ஆகியவற்றில் ஒளிப்பட நிலைய உரிமையாளர்கள் எண்ணற்ற மணிநேரங்களை இழக்கின்றனர். போக்கோமேன் அனைத்தையும் ஒன்றிணைத்து, என்ன நடக்கிறது, என்ன நிலுவையில் உள்ளது என்பதை எப்போதும் உங்களுக்குத் தெரியப்படுத்துகிறது.",
  },

  // Module 1: OMS
  "module.oms.title": {
    en: "Order Management System - OMS",
    thanglish: "Order Management System - OMS",
    ta_easy: "ஆணை மேலாண்மை அமைப்பு - OMS",
    ta_pure: "ஆணை மேலாண்மை அமைப்பு - OMS",
  },
  "module.oms.desc": {
    en: "Track and manage confirmed orders and their status across every milestone, from RAW photo selection and editing through to final album delivery and client payments.",
    thanglish: "RAW photo selection மற்றும் editing முதல் final album delivery மற்றும் client payments வரை ஒவ்வொரு milestone-லும் confirmed orders-ஐ எளிதாக track செய்து manage செய்யுங்கள்.",
    ta_easy: "மூலப் படங்கள் தேர்வு மற்றும் திருத்தப் பணிகள் முதல் இறுதி ஆல்பம் ஒப்படைப்பு மற்றும் வாடிக்கையாளர் கட்டணங்கள் வரை ஒவ்வொரு மைல்கல்லிலும் உறுதிசெய்யப்பட்ட ஆணைகளைக் கண்காணித்து நிர்வகியுங்கள்.",
    ta_pure: "மூலப் படங்கள் தேர்வு மற்றும் திருத்தப் பணிகள் முதல் இறுதி ஆல்பம் ஒப்படைப்பு மற்றும் வாடிக்கையாளர் கட்டணங்கள் வரை ஒவ்வொரு மைல்கல்லிலும் உறுதிசெய்யப்பட்ட ஆணைகளைக் கண்காணித்து நிர்வகியுங்கள்.",
  },

  // Module 2: CRM
  "module.crm.title": {
    en: "Customer Relations - CRM",
    thanglish: "Customer Relations - CRM",
    ta_easy: "வாடிக்கையாளர் உறவுகள் - CRM",
    ta_pure: "வாடிக்கையாளர் உறவுகள் - CRM",
  },
  "module.crm.desc": {
    en: "Centralize client directories with verified phone numbers, track lifetime value across multiple photoshoot bookings, monitor outstanding receivables, and launch new orders directly from existing customer profiles.",
    thanglish: "Client directory-ல் தொடர்பு விவரங்களைச் சேமியுங்கள், பல photoshoot முன்பதிவுகளின் lifetime value-ஐக் கண்காணியுங்கள், நிலுவைத் தொகையைக் கண்காணிக்கவும், முந்தைய profile-லிருந்து புதிய order-ஐ நேரடியாகத் தொடங்கவும்.",
    ta_easy: "வாடிக்கையாளர் தொடர்பு விவரங்களை ஒருமுகப்படுத்துங்கள், பல படப்பிடிப்பு முன்பதிவுகளின் வாழ்நாள் மதிப்பை (LTV) கண்காணியுங்கள், நிலுவைத் தொகையைக் கண்காணிக்கவும், ஏற்கனவே உள்ள வாடிக்கையாளர் விவரக்குறிப்பிலிருந்து நேரடியாக புதிய ஆணைகளைத் தொடங்கவும்.",
    ta_pure: "வாடிக்கையாளர் தொடர்பு விவரங்களை ஒருமுகப்படுத்துங்கள், பல படப்பிடிப்பு முன்பதிவுகளின் வாழ்நாள் மதிப்பை (LTV) கண்காணியுங்கள், நிலுவைத் தொகையைக் கண்காணிக்கவும், ஏற்கனவே உள்ள வாடிக்கையாளர் விவரக்குறிப்பிலிருந்து நேரடியாக புதிய ஆணைகளைத் தொடங்கவும்.",
  },

  // Module 3: ERP
  "module.erp.title": {
    en: "Studio Operations - ERP",
    thanglish: "Studio Operations - ERP",
    ta_easy: "நிலைய இயக்கங்கள் - ERP",
    ta_pure: "நிலைய இயக்கங்கள் - ERP",
  },
  "module.erp.desc": {
    en: "Assign shoot tasks, check crew calendar availability, track studio gear, and manage crew payroll and travel claims. Structured accounting and expense summaries keep your studio audit-ready, tracking true net profit and simplifying tax filing.",
    thanglish: "Shoot tasks assign செய்யுங்கள், crew calendar availability check செய்யுங்கள், studio gear track செய்து crew payroll மற்றும் travel claims manage செய்யுங்கள். Clean accounting உங்கள் studio net profit-ஐ துல்லியமாக track செய்ய உதவும்.",
    ta_easy: "படப்பிடிப்பு பணிகளை ஒதுக்குங்கள், நாள்காட்டி இருப்பு நிலையைச் சரிபாருங்கள், நிலைய உபகரணங்களைக் கண்காணியுங்கள், குழுவினருக்கான ஊதியம் மற்றும் பயணக் கோரிக்கைகளை நிர்வகியுங்கள். கட்டமைக்கப்பட்ட கணக்கியல் உங்கள் நிலையத்தைத் தணிக்கைக்குத் தயாராக வைக்கிறது.",
    ta_pure: "படப்பிடிப்பு பணிகளை ஒதுக்குங்கள், நாள்காட்டி இருப்பு நிலையைச் சரிபாருங்கள், நிலைய உபகரணங்களைக் கண்காணியுங்கள், குழுவினருக்கான ஊதியம் மற்றும் பயணக் கோரிக்கைகளை நிர்வகியுங்கள். கட்டமைக்கப்பட்ட கணக்கியல் உங்கள் நிலையத்தைத் தணிக்கைக்குத் தயாராக வைக்கிறது.",
  },

  // Integrations / WhatsApp Card
  "module.integrations.title": {
    en: "WhatsApp Operations & Bot",
    thanglish: "WhatsApp Operations & Bot",
    ta_easy: "வாட்ஸ்அப் இயக்கங்கள் மற்றும் பாட்",
    ta_pure: "வாட்ஸ்அப் இயக்கங்கள் மற்றும் தானியங்கி பாட்",
  },
  "module.integrations.desc": {
    en: "Automated WhatsApp alerts and mobile operations: send booking confirmations and gallery links to clients, shoot reminders and call-times to crew, and receive real-time order milestone updates.",
    thanglish: "Automated WhatsApp alerts & mobile operations: clients-க்கு booking confirmations & gallery links, crew-க்கு shoot reminders & call-times, மற்றும் real-time order milestone updates எளிதாகப் பெறலாம்.",
    ta_easy: "தானியங்கி வாட்ஸ்அப் அறிவிப்புகள் மற்றும் கைபேசி இயக்கங்கள்: வாடிக்கையாளர்களுக்கு முன்பதிவு உறுதிப்படுத்தல்கள் மற்றும் புகைப்பட தொகுப்பு இணைப்புகள், குழுவினருக்கு படப்பிடிப்பு நினைவூட்டல்கள் மற்றும் அழைப்பு நேரங்கள், மற்றும் நிகழ்நேர மைல்கல் புதுப்பிப்புகளைப் பெறுங்கள்.",
    ta_pure: "தானியங்கி வாட்ஸ்அப் அறிவிப்புகள் மற்றும் கைபேசி இயக்கங்கள்: வாடிக்கையாளர்களுக்கு முன்பதிவு உறுதிப்படுத்தல்கள் மற்றும் படத்தொகுப்பு இணைப்புகள், குழுவினருக்குப் படப்பிடிப்பு நினைவூட்டல்கள் மற்றும் அழைப்பு நேரங்கள், மற்றும் நிகழ்நேர மைல்கல் புதுப்பிப்புகளைப் பெறுங்கள்.",
  },

  // Module 6: Automations
  "module.automations.title": {
    en: "Automations & Smart Engine",
    thanglish: "Automations & Smart Engine",
    ta_easy: "தானியங்கு மற்றும் ஸ்மார்ட் அமைப்பு",
    ta_pure: "தானியக்க மற்றும் நுண்ணறிவு அமைப்பு",
  },
  "module.automations.desc": {
    en: "Eliminate repetitive manual busywork with smart automation that configures package deliverables, suggests crew assignments based on availability and workload, calculates payment breakdowns, and advances production pipelines automatically.",
    thanglish: "Eliminate repetitive manual busywork with smart automation that configures package deliverables, suggests crew assignments based on availability and workload, calculates payment breakdowns, and advances production pipelines automatically.",
    ta_easy: "தொடர் கையேட்டுப் பணிகளைத் தானியங்கு மூலம் எளிதாக்குங்கள்: தொகுப்பு விநியோகங்களை அமைத்திடுங்கள், நேரம் மற்றும் பணிச்சுமை அடிப்படையில் குழுவினரைப் பரிந்துரைத்திடுங்கள், கட்டணக் கணக்கீடுகளைச் செய்திடுங்கள், விநியோகப் பணிகளைத் தானாக முன்னகர்த்துங்கள்.",
    ta_pure: "தொடர் கையேட்டுப் பணிகளை நுண்ணறிவுத் தானியக்கம் மூலம் கையாளுங்கள்: ஒப்படைப்பு விவரங்களை அமைத்திடுங்கள், நேரம் மற்றும் பணிச்சுமை அடிப்படையில் குழுவினரைப் பரிந்துரைத்திடுங்கள், கட்டணப் பகுப்பாய்வுகளைச் செய்திடுங்கள் மற்றும் உற்பத்தி நிலைகளைத் தானாக முன்னகர்த்துங்கள்.",
  },
  "home.automations_badge": {
    en: "Workflow Automation",
    thanglish: "Workflow Automation",
    ta_easy: "பணிப்பாய்வு தானியங்கு",
    ta_pure: "பணிப்பாய்வுத் தானியக்கம்",
  },

  // Dashboard Common
  "dash.orders": {
    en: "Orders (OMS)",
    thanglish: "Orders (OMS)",
    ta_easy: "ஆணைகள்",
    ta_pure: "ஆணைகள் (OMS)",
  },
  "dash.crm": {
    en: "CRM",
    thanglish: "CRM",
    ta_easy: "வாடிக்கையாளர் மேலாண்மை",
    ta_pure: "வாடிக்கையாளர் உறவு (CRM)",
  },
  "dash.erp": {
    en: "Operations (ERP)",
    thanglish: "Operations (ERP)",
    ta_easy: "நிலைய இயக்கங்கள்",
    ta_pure: "நிலைய இயக்கம் (ERP)",
  },
  "dash.marketplace": {
    en: "Studio Marketplace",
    thanglish: "Studio Marketplace",
    ta_easy: "ஸ்டுடியோ சந்தை",
    ta_pure: "ஸ்டுடியோ சந்தை",
  },
  "dash.whatsapp": {
    en: "WhatsApp",
    thanglish: "WhatsApp",
    ta_easy: "வாட்ஸ்அப் செய்தி",
    ta_pure: "வாட்ஸ்அப் செய்தி",
  },
  "dash.devportal": {
    en: "Developer Portal",
    thanglish: "Developer Portal",
    ta_easy: "உருவாக்குநர் தளம்",
    ta_pure: "உருவாக்குநர் தளம்",
  },
  "dash.new_order": {
    en: "+ New Confirmed Order",
    thanglish: "+ New Confirmed Order",
    ta_easy: "+ புதிய உறுதிசெய்த ஆணை",
    ta_pure: "+ புதிய உறுதிசெய்த ஆணை",
  },
  "dash.search_orders": {
    en: "Search by client name, phone, or order #...",
    thanglish: "Search by client name, phone, or order #...",
    ta_easy: "வாடிக்கையாளர் பெயர், எண் அல்லது ஆணை எண் மூலம் தேடுக...",
    ta_pure: "வாடிக்கையாளர் பெயர், எண் அல்லது ஆணை எண் மூலம் தேடுக...",
  },

  // Milestone Stages
  "stage.ORDER_CONFIRMED": {
    en: "Order Confirmed",
    thanglish: "Order Confirmed",
    ta_easy: "ஆணை உறுதிசெய்யப்பட்டது",
    ta_pure: "ஆணை உறுதிசெய்யப்பட்டது",
  },
  "stage.CREW_ALLOCATED": {
    en: "Crew Allocated",
    thanglish: "Crew Allocated",
    ta_easy: "குழுவினர் ஒதுக்கப்பட்டனர்",
    ta_pure: "குழுவினர் ஒதுக்கப்பட்டனர்",
  },
  "stage.EVENT_COMPLETED": {
    en: "Shoot Completed",
    thanglish: "Shoot Completed",
    ta_easy: "படப்பிடிப்பு நிறைவுற்றது",
    ta_pure: "படப்பிடிப்பு நிறைவுற்றது",
  },
  "stage.RAW_UPLOADED": {
    en: "RAW Photos Ready",
    thanglish: "RAW Photos Ready",
    ta_easy: "மூலப் படங்கள் பதிவேற்றப்பட்டன",
    ta_pure: "மூலப் படங்கள் பதிவேற்றப்பட்டன",
  },
  "stage.CLIENT_SELECTION": {
    en: "Client Photo Selection",
    thanglish: "Client Photo Selection",
    ta_easy: "வாடிக்கையாளர் படத் தேர்வு",
    ta_pure: "வாடிக்கையாளர் படத் தேர்வு",
  },
  "stage.POST_PRODUCTION": {
    en: "Editing & Design",
    thanglish: "Editing & Design",
    ta_easy: "படத்தொகுப்பு மற்றும் வடிவமைப்பு",
    ta_pure: "படத்தொகுப்பு மற்றும் ஆல்பம் வடிவமைப்பு",
  },
  "stage.PRINT_LAB": {
    en: "Print & Lab",
    thanglish: "Print & Lab",
    ta_easy: "அச்சுக்கூடம் மற்றும் தயாரிப்பு",
    ta_pure: "அச்சுக்கூடம் மற்றும் உற்பத்தி",
  },
  "stage.COMPLETED": {
    en: "Delivered & Completed",
    thanglish: "Delivered & Completed",
    ta_easy: "முழுமையாக ஒப்படைக்கப்பட்டது",
    ta_pure: "முழுமையாக ஒப்படைக்கப்பட்டது",
  },

  // Payment Status
  "pay.advance": {
    en: "Advance Paid",
    thanglish: "Advance Paid",
    ta_easy: "முன்பணம் பெறப்பட்டது",
    ta_pure: "முன்பணம் செலுத்தப்பட்டது",
  },
  "pay.event_day": {
    en: "Shoot Day Payment",
    thanglish: "Shoot Day Payment",
    ta_easy: "நிகழ்வு நாள் கட்டணம்",
    ta_pure: "நிகழ்வு நாள் கட்டணம்",
  },
  "pay.final_delivery": {
    en: "Final Delivery Balance",
    thanglish: "Final Delivery Balance",
    ta_easy: "இறுதி ஒப்படைப்பு நிலுவைத் தொகை",
    ta_pure: "இறுதி ஒப்படைப்பு நிலுவைத் தொகை",
  },
  "pay.paid_full": {
    en: "Paid in Full",
    thanglish: "Paid in Full",
    ta_easy: "முழுக் கட்டணமும் பெறப்பட்டது",
    ta_pure: "முழுக் கட்டணமும் பெறப்பட்டது",
  },

  // Home Page Section Badges & Text
  "home.challenge_heading": {
    en: "Eliminate Scattered WhatsApp Chats, Spreadsheets & Paper Notebooks",
    thanglish: "WhatsApp chats, spreadsheets, notebooks அனைத்தையும் தவிர்க்கவும்",
    ta_easy: "சிதறிய வாட்ஸ்அப் உரையாடல்கள், விரிதாள்கள் மற்றும் குறிப்பேடுகளைத் தவிருங்கள்",
    ta_pure: "சிதறிய வாட்ஸ்அப் உரையாடல்கள், விரிதாள்கள் மற்றும் குறிப்பேடுகளின் சிரமங்களைத் தவிருங்கள்",
  },
  "home.core_ops_badge": {
    en: "Core Operations",
    thanglish: "Core Operations",
    ta_easy: "முதன்மை இயக்கங்கள்",
    ta_pure: "முதன்மை இயக்கங்கள்",
  },
  "home.support_module_badge": {
    en: "Support Module",
    thanglish: "Support Module",
    ta_easy: "துணைத் தொகுதி",
    ta_pure: "துணைத் தொகுதி",
  },
  "home.native_integrations_badge": {
    en: "Native Integrations",
    thanglish: "Native Integrations",
    ta_easy: "நேரடி இணைப்புகள்",
    ta_pure: "நேரடி இணைப்புகள்",
  },
  "home.discovery_badge": {
    en: "Discovery & Search",
    thanglish: "Discovery & Search",
    ta_easy: "கண்டுபிடிப்பு மற்றும் தேடல்",
    ta_pure: "கண்டுபிடிப்பு மற்றும் தேடல்",
  },
  "home.marketplace_desc": {
    en: "Discover top photography and videography studios near you with verified operational performance metrics, on-time delivery track records, and authentic reviews and ratings. Studio owners maintain full control over their public visibility and profile details, while internal orders, financials, and CRM records remain strictly private.",
    thanglish: "உங்கள் பகுதிக்கு அருகிலுள்ள top studios-ஐ on-time delivery ratings கொண்டு discover செய்யுங்கள். Studio internal records எப்போதும் strictly private-ஆக இருக்கும்.",
    ta_easy: "உங்கள் பகுதியில் உள்ள சிறந்த ஒளிப்பட மற்றும் நிகழ்பட நிலையங்களை அவற்றின் சரியான நேர ஒப்படைப்புத் தரம் மற்றும் வாடிக்கையாளர் மதிப்பீடுகள் மூலம் கண்டறியுங்கள். நிலையத்தின் உள்ளகக் கணக்குகள் மற்றும் வாடிக்கையாளர் விவரங்கள் எப்போதும் முழுமையாகப் பாதுகாக்கப்படும்.",
    ta_pure: "உங்கள் பகுதியில் உள்ள சிறந்த ஒளிப்பட மற்றும் நிகழ்பட நிலையங்களை அவற்றின் சரியான நேர ஒப்படைப்புத் தரம் மற்றும் வாடிக்கையாளர் மதிப்பீடுகள் மூலம் கண்டறியுங்கள். நிலையத்தின் உள்ளகக் கணக்குகள் மற்றும் வாடிக்கையாளர் விவரங்கள் எப்போதும் முழுமையாகப் பாதுகாக்கப்படும்.",
  },

  // Value Added Services / Add-ons
  "vas.badge": {
    en: "Value-added services",
    thanglish: "Value-added services",
    ta_easy: "கூடுதல் சேவைகள்",
    ta_pure: "மதிப்புக்கூட்டு சேவைகள்",
  },
  "vas.title": {
    en: "Studio Setup & Creative Add-ons",
    thanglish: "Studio Setup & Creative Add-ons",
    ta_easy: "நிலைய அமைவு மற்றும் ஆக்கப்பூர்வக் கூடுதல் சேவைகள்",
    ta_pure: "நிலைய அமைவு மற்றும் ஆக்கப்பூர்வக் கூடுதல் சேவைகள்",
  },
  "vas.subtitle": {
    en: "Optional creative design and onboarding assistance to help set up and elevate your studio operations with a minimal one-time charge.",
    thanglish: "குறைந்த கட்டணத்தில் உங்கள் studio operations-ஐ setup செய்து elevate செய்ய optional creative மற்றும் onboarding assistance.",
    ta_easy: "குறைந்த கட்டணத்தில் உங்கள் நிலைய இயக்கங்களை அமைத்து மேம்படுத்த விருப்பத் தேர்வு ஆக்கப்பூர்வ வடிவமைப்பு மற்றும் வழிகாட்டல் உதவிகள்.",
    ta_pure: "குறைந்த கட்டணத்தில் உங்கள் நிலைய இயக்கங்களை அமைத்து மேம்படுத்த விருப்பத் தேர்வு ஆக்கப்பூர்வ வடிவமைப்பு மற்றும் வழிகாட்டல் உதவிகள்.",
  },
  "vas.web_create_title": {
    en: "Website Creation",
    thanglish: "Website Creation",
    ta_easy: "வலைத்தளம் உருவாக்குதல்",
    ta_pure: "வலைத்தளம் உருவாக்குதல்",
  },
  "vas.web_create_desc": {
    en: "Custom portfolio and showcase website for your studio brand.",
    thanglish: "உங்கள் studio brand-க்கு custom portfolio website.",
    ta_easy: "உங்கள் நிலையத்திற்கான பிரத்யேக படைப்புத்தொகுப்பு வலைத்தளம்.",
    ta_pure: "உங்கள் நிலையத்திற்கான பிரத்யேக படைப்புத்தொகுப்பு வலைத்தளம்.",
  },
  "vas.web_int_title": {
    en: "Website Integration",
    thanglish: "Website Integration",
    ta_easy: "வலைத்தள இணைப்பு",
    ta_pure: "வலைத்தள இணைப்பு",
  },
  "vas.web_int_desc": {
    en: "API integration bridging your existing external website directly into Focoman.",
    thanglish: "உங்கள் existing website-ஐ நேரடியாக Focoman-உடன் connect செய்யலாம்.",
    ta_easy: "தற்போதுள்ள உங்கள் வெளிப்புற வலைத்தளத்தைப் போக்கோமேனுடன் நேரடியாக இணைக்கும் தொழில்நுட்பம்.",
    ta_pure: "தற்போதுள்ள உங்கள் வெளிப்புற வலைத்தளத்தைப் போக்கோமேனுடன் நேரடியாக இணைக்கும் தொழில்நுட்பம்.",
  },
  "vas.brand_title": {
    en: "Branding & Identity",
    thanglish: "Branding & Identity",
    ta_easy: "வணிக முத்திரை மற்றும் அடையாளம்",
    ta_pure: "வணிக முத்திரை மற்றும் அடையாளம்",
  },
  "vas.brand_desc": {
    en: "Studio logo design, invoice headers, and branded presentation assets.",
    thanglish: "Studio logo design, invoice headers மற்றும் branding assets.",
    ta_easy: "நிலைய இலச்சினை வடிவமைப்பு, கட்டணப் பட்டியல் தலைப்புகள் மற்றும் வணிக விளக்கக் குறிப்புகள்.",
    ta_pure: "நிலைய இலச்சினை வடிவமைப்பு, கட்டணப் பட்டியல் தலைப்புகள் மற்றும் வணிக விளக்கக் குறிப்புகள்.",
  },
  "vas.data_mig_title": {
    en: "Data Migration",
    thanglish: "Data Migration",
    ta_easy: "தரவு இடமாற்றம்",
    ta_pure: "தரவு இடமாற்றம்",
  },
  "vas.data_mig_desc": {
    en: "Import past customer contacts and order histories from spreadsheets.",
    thanglish: "Spreadsheet-ல் இருந்து முந்தைய customer contacts & orders-ஐ import செய்யுங்கள்.",
    ta_easy: "விரிதாள்களில் உள்ள முந்தைய வாடிக்கையாளர் விவரங்கள் மற்றும் ஆணை வரலாறுகளை எளிதாக உள்ளேற்றுதல்.",
    ta_pure: "விரிதாள்களில் உள்ள முந்தைய வாடிக்கையாளர் விவரங்கள் மற்றும் ஆணை வரலாறுகளை எளிதாக உள்ளேற்றுதல்.",
  },

  // Pricing Highlight
  "pricing.badge": {
    en: "Clear & Simple Pricing",
    thanglish: "Clear & Simple Pricing",
    ta_easy: "எளிமையான மற்றும் வெளிப்படையான கட்டணம்",
    ta_pure: "எளிமையான மற்றும் வெளிப்படையான கட்டணம்",
  },
  "pricing.title": {
    en: "Choose the Right Plan for Your Studio",
    thanglish: "உங்கள் Studio-விற்கு ஏற்ற Plan-ஐ choose செய்யுங்கள்",
    ta_easy: "உங்கள் நிலையத்திற்கு ஏற்ற திட்டத்தைத் தேர்வுசெய்க",
    ta_pure: "உங்கள் நிலையத்திற்கு ஏற்ற திட்டத்தைத் தேர்வுசெய்க",
  },
  "pricing.subtitle": {
    en: "Every plan includes our core Order Management System. Upgrade as your team grows.",
    thanglish: "எல்லா plan-களிலும் core Order Management உள்ளது. Team வளரும் போது upgrade செய்து கொள்ளலாம்.",
    ta_easy: "ஒவ்வொரு திட்டத்திலும் முதன்மை ஆணை மேலாண்மை அமைப்பு அடங்கும். உங்கள் குழு விரிவடையும் போது மேம்படுத்திக்கொள்ளலாம்.",
    ta_pure: "ஒவ்வொரு திட்டத்திலும் முதன்மை ஆணை மேலாண்மை அமைப்பு அடங்கும். உங்கள் குழு விரிவடையும் போது மேம்படுத்திக்கொள்ளலாம்.",
  },
  "pricing.plan_starter": {
    en: "Starter",
    thanglish: "Starter",
    ta_easy: "தொடக்க நிலை",
    ta_pure: "தொடக்க நிலை",
  },
  "pricing.plan_starter_desc": {
    en: "For solo photographers just getting started with order management.",
    thanglish: "தனியாக work செய்யும் photographers-க்கு simple order management.",
    ta_easy: "தனித்து இயங்கும் ஒளிப்படக் கலைஞர்களுக்கான ஆணை மேலாண்மை.",
    ta_pure: "தனித்து இயங்கும் ஒளிப்படக் கலைஞர்களுக்கான ஆணை மேலாண்மை.",
  },
  "pricing.plan_pro": {
    en: "Professional",
    thanglish: "Professional",
    ta_easy: "தொழில்முறை",
    ta_pure: "தொழில்முறை",
  },
  "pricing.plan_pro_desc": {
    en: "For growing studios managing a team with CRM & ERP modules.",
    thanglish: "CRM மற்றும் Crew Operations இணைந்த growing studios-க்கு.",
    ta_easy: "வாடிக்கையாளர் உறவு மற்றும் பணிக் குழுவுடன் இயங்கும் வளரும் நிலையங்களுக்கு.",
    ta_pure: "வாடிக்கையாளர் உறவு மற்றும் பணிக் குழுவுடன் இயங்கும் வளரும் நிலையங்களுக்கு.",
  },
  "pricing.plan_complete": {
    en: "Complete",
    thanglish: "Complete",
    ta_easy: "முழுமையானது",
    ta_pure: "முழுமையானது",
  },
  "pricing.plan_complete_desc": {
    en: "Full-stack operations with WhatsApp notifications and multi-studio support.",
    thanglish: "WhatsApp notifications மற்றும் multi-studio support உடன் கூடிய complete suite.",
    ta_easy: "வாட்ஸ்அப் அறிவிப்புகள் மற்றும் பல நிலைய மேலாண்மையுடன் கூடிய முழுமையான தொகுப்பு.",
    ta_pure: "வாட்ஸ்அப் அறிவிப்புகள் மற்றும் பல நிலைய மேலாண்மையுடன் கூடிய முழுமையான தொகுப்பு.",
  },
  "pricing.btn_compare": {
    en: "View Details & Compare Plans",
    thanglish: "View Details & Compare Plans",
    ta_easy: "திட்டங்களை ஒப்பிட்டு விவரங்களைக் காண்க",
    ta_pure: "திட்டங்களை ஒப்பிட்டு விவரங்களைக் காண்க",
  },

  // FAQ
  "faq.badge": {
    en: "Got Questions?",
    thanglish: "Questions உள்ளதா?",
    ta_easy: "கேள்விகள் உள்ளதா?",
    ta_pure: "கேள்விகள் உள்ளதா?",
  },
  "faq.title": {
    en: "Frequently Asked Questions",
    thanglish: "Frequently Asked Questions",
    ta_easy: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    ta_pure: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
  },

  // Language Selector UI
  "lang.select_title": {
    en: "Language Mode",
    thanglish: "Language Mode",
    ta_easy: "மொழி நடைத் தேர்வு",
    ta_pure: "மொழி நடைத் தேர்வு",
  },
  "lang.depth_slider": {
    en: "Tamil Depth Level",
    thanglish: "Tamil Depth Level",
    ta_easy: "மொழி ஆழ நிலை",
    ta_pure: "தமிழ் மொழி ஆழ நிலை",
  },
  "lang.depth_1_label": {
    en: "English",
    thanglish: "English",
    ta_easy: "ஆங்கிலம்",
    ta_pure: "ஆங்கிலம்",
  },
  "lang.depth_2_label": {
    en: "Thanglish",
    thanglish: "Thanglish",
    ta_easy: "தங்கிலீஷ்",
    ta_pure: "தங்கிலீஷ்",
  },
  "lang.depth_3_label": {
    en: "Modern Tamil",
    thanglish: "Tha/En",
    ta_easy: "தமிழ்",
    ta_pure: "தமிழ்",
  },
  "lang.depth_4_label": {
    en: "Pure Tamil",
    thanglish: "Tha",
    ta_easy: "தூய தமிழ்",
    ta_pure: "தூய தமிழ்",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageMode>("en");
  const [tamilDepth, setTamilDepthState] = useState<number>(1);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("focoman_lang") as LanguageMode | null;
      const savedDepth = localStorage.getItem("focoman_tamil_depth");

      if (savedLang && (savedLang in LANG_TO_DEPTH)) {
        setLanguageState(savedLang);
        setTamilDepthState(LANG_TO_DEPTH[savedLang]);
      } else if (savedDepth) {
        const num = parseInt(savedDepth, 10);
        if (num >= 1 && num <= 4) {
          setTamilDepthState(num);
          setLanguageState(DEPTH_TO_LANG[num] || "en");
        }
      }
    } catch {
      // Ignore localStorage errors (e.g. iframe privacy restrictions)
    }
  }, []);

  const setLanguage = (lang: LanguageMode) => {
    setLanguageState(lang);
    const depth = LANG_TO_DEPTH[lang] || 1;
    setTamilDepthState(depth);
    try {
      localStorage.setItem("focoman_lang", lang);
      localStorage.setItem("focoman_tamil_depth", depth.toString());
    } catch {
      // Ignore
    }
  };

  const setTamilDepth = (depth: number) => {
    const clamped = Math.max(1, Math.min(4, depth));
    setTamilDepthState(clamped);
    const lang = DEPTH_TO_LANG[clamped] || "en";
    setLanguageState(lang);
    try {
      localStorage.setItem("focoman_lang", lang);
      localStorage.setItem("focoman_tamil_depth", clamped.toString());
    } catch {
      // Ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    const entry = translations[key];
    if (!entry) return fallback || key;
    return entry[language] || entry["en"] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        tamilDepth,
        setLanguage,
        setTamilDepth,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback safe context if used outside provider
    return {
      language: "en" as LanguageMode,
      tamilDepth: 1,
      setLanguage: () => {},
      setTamilDepth: () => {},
      t: (key: string, fallback?: string) => {
        const entry = translations[key];
        return entry?.["en"] || fallback || key;
      },
    };
  }
  return context;
}
