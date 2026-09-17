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
    badge: "EN",
  },
  thanglish: {
    name: "Thanglish",
    nativeName: "Thanglish (Tamil in English)",
    desc: "Spoken Tamil in English script with business terms",
    badge: "TG",
  },
  ta_easy: {
    name: "Modern Tamil (Default)",
    nativeName: "எளிய தமிழ் (வணிகச் சொற்களுடன்)",
    desc: "Tamil with English industry terms (Orders, RAW, Advance, Crew)",
    badge: "தமிழ்",
  },
  ta_pure: {
    name: "Full Pure Tamil",
    nativeName: "தூய தமிழ் (ஆழமான தமிழ்)",
    desc: "100% Classical formal Tamil terminology",
    badge: "தூய",
  },
};

const translations: Record<string, Record<LanguageMode, string>> = {
  // Navigation
  "nav.home": {
    en: "Home",
    thanglish: "Home",
    ta_easy: "Home",
    ta_pure: "முகப்பு",
  },
  "nav.features": {
    en: "Features",
    thanglish: "Features",
    ta_easy: "Features",
    ta_pure: "அம்சங்கள்",
  },
  "nav.pricing": {
    en: "Pricing",
    thanglish: "Pricing",
    ta_easy: "Pricing",
    ta_pure: "விலைப்பட்டியல்",
  },
  "nav.marketplace": {
    en: "Studio Marketplace",
    thanglish: "Marketplace",
    ta_easy: "Marketplace",
    ta_pure: "வணிகச் சந்தை",
  },
  "nav.about": {
    en: "About Us",
    thanglish: "About Us",
    ta_easy: "About Us",
    ta_pure: "எங்களைப் பற்றி",
  },
  "nav.signin": {
    en: "Sign In",
    thanglish: "Sign In",
    ta_easy: "Sign In",
    ta_pure: "உள்நுழைக",
  },
  "nav.signout": {
    en: "Sign Out",
    thanglish: "Sign Out",
    ta_easy: "Sign Out",
    ta_pure: "வெளியேறுக",
  },
  "nav.workspaces": {
    en: "My Workspaces",
    thanglish: "My Workspaces",
    ta_easy: "My Workspaces",
    ta_pure: "எனது பணியிடங்கள்",
  },
  "nav.settings": {
    en: "Account Settings",
    thanglish: "Account Settings",
    ta_easy: "Account Settings",
    ta_pure: "கணக்கு அமைப்புகள்",
  },
  "nav.explore_modules": {
    en: "Explore Detailed Module Breakdown →",
    thanglish: "Explore Detailed Module Breakdown →",
    ta_easy: "Explore Detailed Module Breakdown →",
    ta_pure: "முழுமையான தொகுதி விவரங்களைக் காண்க →",
  },

  // Hero Section - Exact Approved English & Rich Explanatory Tamil
  "hero.badge": {
    en: "Focus beyond the frames",
    thanglish: "Focus beyond the frames",
    ta_easy: "Focus beyond the frames",
    ta_pure: "சட்டகங்களைத் தாண்டிய கவனம்",
  },
  "hero.title_part1": {
    en: "A Complete Business Operating System for",
    thanglish: "A Complete Business Operating System for",
    ta_easy: "போட்டோகிராபி ஸ்டுடியோவுக்கான Complete Business Operating System",
    ta_pure: "ஒளிப்பட நிலையங்களுக்கான முழுமையான வணிக இயக்க அமைப்பு",
  },
  "hero.title_highlight": {
    en: "Photography Studios",
    thanglish: "Photography Studios",
    ta_easy: "Photography Studios",
    ta_pure: "ஒளிப்பட நிலையங்கள்",
  },
  "hero.description": {
    en: "Bring your studio’s work, people, and orders together in one place and spend less time managing the work, more time creating.",
    thanglish: "Unga studio work, crew, mattrum orders ellathayum ore idathula manage panni time save pannunga.",
    ta_easy: "உங்கள் ஸ்டுடியோவின் பணிகள், Crew மற்றும் Orders அனைத்தையும் ஒரே இடத்தில் ஒருங்கிணைத்து, நிர்வாக வேலைகளைக் குறைத்து ஆக்கப்பூர்வமான படைப்புகளில் அதிக நேரம் செலவிடுங்கள்.",
    ta_pure: "உங்கள் நிலையத்தின் பணிகள், பணிக் குழுவினர் மற்றும் ஆணைகளை ஒரே இடத்தில் ஒருங்கிணைத்து, மேலாண்மை நேரத்தைக் குறைத்து ஆக்கப்பூர்வ பணிகளில் அதிக கவனம் செலுத்துங்கள்.",
  },
  "hero.cta_get_started": {
    en: "Get Started with Focoman",
    thanglish: "Get Started with Focoman",
    ta_easy: "Get Started with Focoman",
    ta_pure: "இலவசமாகத் தொடங்குக",
  },
  "hero.cta_view_demo": {
    en: "Explore Demo Workspace",
    thanglish: "Explore Demo Workspace",
    ta_easy: "Explore Demo Workspace",
    ta_pure: "நேரடி செயல்முறையைக் காண்க",
  },

  // Modules Overview & The Challenge We Solve
  "modules.title": {
    en: "The Challenge We Solve",
    thanglish: "The Challenge We Solve",
    ta_easy: "நாம் தீர்க்கும் நடைமுறைச் சவால்கள் (The Challenge We Solve)",
    ta_pure: "நாம் தீர்க்கும் சவால்கள்",
  },
  "modules.subtitle": {
    en: "Photography studio owners lose countless hours tracking shoots, chasing deliverables, updating spreadsheets, and managing payments. Focoman brings it all together, so you always know what’s happening, what’s pending, and what needs attention next.",
    thanglish: "Photography studio owners lose countless hours tracking shoots, chasing deliverables, updating spreadsheets, and managing payments. Focoman brings it all together, so you always know what’s happening, what’s pending, and what needs attention next.",
    ta_easy: "Shoots கண்காணிப்பு, Pending Deliveries follow-up, Spreadsheets பராமரிப்பு மற்றும் Payments மேலாண்மையில் ஸ்டுடியோ உரிமையாளர்கள் அதிக நேரம் இழக்கின்றனர். Focoman அனைத்தையும் ஒருங்கிணைத்து, என்ன நடக்கிறது, என்ன நிலுவையில் உள்ளது, அடுத்து என்ன செய்ய வேண்டும் என்பதை உடனடியாகத் தெரியப்படுத்துகிறது.",
    ta_pure: "படப்பிடிப்பு கண்காணிப்பு, நிலுவை ஒப்படைப்புகள், விரிதாள்கள் மற்றும் கட்டண வசூல் ஆகியவற்றில் ஒளிப்பட நிலைய உரிமையாளர்கள் எண்ணற்ற மணிநேரங்களை இழக்கின்றனர். போக்கோமேன் அனைத்தையும் ஒன்றிணைத்து, என்ன நடக்கிறது, என்ன நிலுவையில் உள்ளது என்பதை எப்போதும் உங்களுக்குத் தெரியப்படுத்துகிறது.",
  },

  // Module 1: OMS
  "module.oms.title": {
    en: "Order Management",
    thanglish: "Order Management",
    ta_easy: "Order Management",
    ta_pure: "ஆணை மேலாண்மை",
  },
  "module.oms.desc": {
    en: "Track and manage confirmed orders and their status across every milestone, from RAW photo selection and editing through to final album delivery and client payments.",
    thanglish: "Track and manage confirmed orders and their status across every milestone, from RAW photo selection and editing through to final album delivery and client payments.",
    ta_easy: "RAW Photo Selection மற்றும் Editing முதல் இறுதி Album Delivery மற்றும் Client Payments வரை ஒவ்வொரு Milestone நிலையிலும் உறுதிசெய்யப்பட்ட Orders-ஐ எளிதாகக் கண்காணித்து நிர்வகியுங்கள்.",
    ta_pure: "மூலப் படங்கள் தேர்வு மற்றும் திருத்தப் பணிகள் முதல் இறுதி ஆல்பம் ஒப்படைப்பு மற்றும் வாடிக்கையாளர் கட்டணங்கள் வரை ஒவ்வொரு மைல்கல்லிலும் உறுதிசெய்யப்பட்ட ஆணைகளைக் கண்காணித்து நிர்வகியுங்கள்.",
  },

  // Module 2: CRM
  "module.crm.title": {
    en: "Customer Relationship Management",
    thanglish: "Customer Relationship Management",
    ta_easy: "Customer Relationship Management (CRM)",
    ta_pure: "வாடிக்கையாளர் உறவு மேலாண்மை",
  },
  "module.crm.desc": {
    en: "Manage client profiles with past event and package history, client styling preferences, and automated anniversary reminders for repeat business.",
    thanglish: "Manage client profiles with past event and package history, client styling preferences, and automated anniversary reminders for repeat business.",
    ta_easy: "Client Profiles, முந்தைய Shoot & Package வரலாறு, வாடிக்கையாளரின் விருப்பங்கள் மற்றும் புதிய Bookings பெற உதவும் தானியங்கி Anniversary Reminders-ஐ எளிதாக நிர்வகியுங்கள்.",
    ta_pure: "வாடிக்கையாளர் விவரங்கள், முந்தைய நிகழ்வு மற்றும் தொகுப்பு வரலாறு, வாடிக்கையாளர் விருப்பங்கள் மற்றும் தொடர் வணிகத்திற்கான தானியங்கி ஆண்டுநினைவு நினைவூட்டல்களை நிர்வகியுங்கள்.",
  },

  // Module 3: ERP
  "module.erp.title": {
    en: "Studio Operations and Crew Management",
    thanglish: "Studio Operations and Crew Management",
    ta_easy: "Studio Operations & Crew Management",
    ta_pure: "நிலைய இயக்கங்கள் மற்றும் பணிக் குழு மேலாண்மை",
  },
  "module.erp.desc": {
    en: "Assign shoot tasks, check crew calendar availability, track studio gear, and manage crew payroll and travel claims. Structured accounting and expense summaries keep your studio audit-ready, tracking true net profit and simplifying tax filing.",
    thanglish: "Assign shoot tasks, check crew calendar availability, track studio gear, and manage crew payroll and travel claims. Structured accounting and expense summaries keep your studio audit-ready, tracking true net profit and simplifying tax filing.",
    ta_easy: "Shoot பணிகளை ஒதுக்குங்கள், Crew Calendar Availability சரிபாருங்கள், Camera உபகரணங்களைக் கண்காணியுங்கள், Crew சம்பளம் மற்றும் Travel Claims நிர்வகியுங்கள். முறையான Accounts உங்கள் ஸ்டுடியோவின் உண்மையான லாபத்தைக் காட்டி Tax Filing-ஐ எளிதாக்குகிறது.",
    ta_pure: "படப்பிடிப்பு பணிகளை ஒதுக்குங்கள், நாள்காட்டி இருப்பு நிலையைச் சரிபாருங்கள், நிலைய உபகரணங்களைக் கண்காணியுங்கள், குழுவினருக்கான ஊதியம் மற்றும் பயணக் கோரிக்கைகளை நிர்வகியுங்கள். கட்டமைக்கப்பட்ட கணக்கியல் உங்கள் நிலையத்தைத் தணிக்கைக்குத் தயாராக வைக்கிறது.",
  },

  // Integrations Card
  "module.integrations.title": {
    en: "Google Drive, Calendar & WhatsApp",
    thanglish: "Google Drive, Calendar & WhatsApp",
    ta_easy: "Google Drive, Calendar & WhatsApp",
    ta_pure: "கூகுள் டிரைவ், நாள்காட்டி மற்றும் வாட்ஸ்அப்",
  },
  "module.integrations.desc": {
    en: "Connect Google Drive for photo selection with in-app previews, Google Calendar for crew schedules, and WhatsApp for automated milestone notifications without switching external tabs.",
    thanglish: "Connect Google Drive for photo selection with in-app previews, Google Calendar for crew schedules, and WhatsApp for automated milestone notifications without switching external tabs.",
    ta_easy: "Photo Selection-க்காக நேரடி In-app Previews உடன் Google Drive, Crew Schedules-க்கு Google Calendar, மற்றும் தானியங்கி Milestone Notifications-க்கு WhatsApp ஆகியவற்றை எளிதாக இணையுங்கள்.",
    ta_pure: "பயன்பாட்டிலேயே நேரடிப் படக் காட்சியுடன் படத் தேர்விற்காக கூகுள் டிரைவ், குழுவினர் பணிகளுக்கான கூகுள் நாள்காட்டி மற்றும் வெளிப்புறத் தாவல்களுக்கு மாறாமல் தானியங்கி அறிவிப்புகளுக்கான வாட்ஸ்அப்பை இணையுங்கள்.",
  },

  // Dashboard Common
  "dash.orders": {
    en: "Orders (OMS)",
    thanglish: "Orders (OMS)",
    ta_easy: "Orders (OMS)",
    ta_pure: "ஆணைகள் (OMS)",
  },
  "dash.crm": {
    en: "CRM",
    thanglish: "CRM",
    ta_easy: "CRM",
    ta_pure: "வாடிக்கையாளர் உறவு (CRM)",
  },
  "dash.erp": {
    en: "Operations (ERP)",
    thanglish: "Operations (ERP)",
    ta_easy: "Operations (ERP)",
    ta_pure: "நிலைய இயக்கம் (ERP)",
  },
  "dash.marketplace": {
    en: "Marketplace",
    thanglish: "Marketplace",
    ta_easy: "Marketplace",
    ta_pure: "வணிகச் சந்தை",
  },
  "dash.whatsapp": {
    en: "WhatsApp",
    thanglish: "WhatsApp",
    ta_easy: "WhatsApp",
    ta_pure: "வாட்ஸ்அப் செய்தி",
  },
  "dash.devportal": {
    en: "Developer Portal",
    thanglish: "Developer Portal",
    ta_easy: "Developer Portal",
    ta_pure: "உருவாக்குநர் தளம்",
  },
  "dash.new_order": {
    en: "+ New Confirmed Order",
    thanglish: "+ New Confirmed Order",
    ta_easy: "+ New Confirmed Order",
    ta_pure: "+ புதிய உறுதிசெய்த ஆணை",
  },
  "dash.search_orders": {
    en: "Search by client name, phone, or order #...",
    thanglish: "Search by client name, phone, or order #...",
    ta_easy: "Client பெயர், தொலைபேசி அல்லது Order எண் கொண்டு தேடு...",
    ta_pure: "வாடிக்கையாளர் பெயர், எண் அல்லது ஆணை எண் மூலம் தேடுக...",
  },

  // Milestone Stages
  "stage.ORDER_CONFIRMED": {
    en: "Order Confirmed",
    thanglish: "Order Confirmed",
    ta_easy: "Order Confirmed",
    ta_pure: "ஆணை உறுதிசெய்யப்பட்டது",
  },
  "stage.CREW_ALLOCATED": {
    en: "Crew Allocated",
    thanglish: "Crew Allocated",
    ta_easy: "Crew Allocated",
    ta_pure: "குழுவினர் ஒதுக்கப்பட்டனர்",
  },
  "stage.EVENT_COMPLETED": {
    en: "Shoot Completed",
    thanglish: "Shoot Completed",
    ta_easy: "Shoot Completed",
    ta_pure: "படப்பிடிப்பு நிறைவுற்றது",
  },
  "stage.RAW_UPLOADED": {
    en: "RAW Photos Ready",
    thanglish: "RAW Photos Ready",
    ta_easy: "RAW Photos Ready",
    ta_pure: "மூலப் படங்கள் பதிவேற்றப்பட்டன",
  },
  "stage.CLIENT_SELECTION": {
    en: "Client Photo Selection",
    thanglish: "Client Photo Selection",
    ta_easy: "Photo Selection",
    ta_pure: "வாடிக்கையாளர் படத் தேர்வு",
  },
  "stage.POST_PRODUCTION": {
    en: "Editing & Design",
    thanglish: "Editing & Design",
    ta_easy: "Photo Editing & Design",
    ta_pure: "படத்தொகுப்பு மற்றும் ஆல்பம் வடிவமைப்பு",
  },
  "stage.PRINT_LAB": {
    en: "Print & Lab",
    thanglish: "Print & Lab",
    ta_easy: "Print & Lab",
    ta_pure: "அச்சுக்கூடம் மற்றும் உற்பத்தி",
  },
  "stage.COMPLETED": {
    en: "Delivered & Completed",
    thanglish: "Delivered & Completed",
    ta_easy: "Delivered & Completed",
    ta_pure: "முழுமையாக ஒப்படைக்கப்பட்டது",
  },

  // Payment Status
  "pay.advance": {
    en: "Advance Paid",
    thanglish: "Advance Paid",
    ta_easy: "Advance Paid (முன்பணம்)",
    ta_pure: "முன்பணம் செலுத்தப்பட்டது",
  },
  "pay.event_day": {
    en: "Shoot Day Payment",
    thanglish: "Shoot Day Payment",
    ta_easy: "Shoot Day Payment",
    ta_pure: "நிகழ்வு நாள் கட்டணம்",
  },
  "pay.final_delivery": {
    en: "Final Delivery Balance",
    thanglish: "Final Delivery Balance",
    ta_easy: "Final Delivery Balance",
    ta_pure: "இறுதி ஒப்படைப்பு நிலுவைத் தொகை",
  },
  "pay.paid_full": {
    en: "Paid in Full",
    thanglish: "Paid in Full",
    ta_easy: "Paid in Full",
    ta_pure: "முழுக் கட்டணமும் பெறப்பட்டது",
  },

  // Language Selector UI
  "lang.select_title": {
    en: "Language Mode",
    thanglish: "Language Mode",
    ta_easy: "Language Mode",
    ta_pure: "மொழி நடைத் தேர்வு",
  },
  "lang.depth_slider": {
    en: "Tamil Depth Level",
    thanglish: "Tamil Depth Level",
    ta_easy: "Tamil Depth Level",
    ta_pure: "தமிழ் மொழி ஆழ நிலை",
  },
  "lang.depth_1_label": {
    en: "English",
    thanglish: "English",
    ta_easy: "English",
    ta_pure: "ஆங்கிலம்",
  },
  "lang.depth_2_label": {
    en: "Thanglish",
    thanglish: "Thanglish",
    ta_easy: "Tha/En",
    ta_pure: "தங்கிலீஷ்",
  },
  "lang.depth_3_label": {
    en: "Modern Tamil",
    thanglish: "Tha/En",
    ta_easy: "Tha/En",
    ta_pure: "தமிழ்",
  },
  "lang.depth_4_label": {
    en: "Pure Tamil",
    thanglish: "Tha",
    ta_easy: "Tha",
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
