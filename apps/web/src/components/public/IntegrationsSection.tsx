import React from "react";

interface IntegrationItem {
  id: string;
  name: string;
  logo: React.ReactNode;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    logo: (
      <svg className="h-6 w-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-label="WhatsApp Logo">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.26 15.09 13.66 14.86 13.58C14.63 13.5 14.47 13.46 14.3 13.71C14.14 13.96 13.67 14.51 13.52 14.68C13.38 14.84 13.23 14.86 12.98 14.74C12.73 14.61 11.93 14.35 10.98 13.5C10.24 12.84 9.74 12.03 9.6 11.78C9.45 11.53 9.58 11.4 9.71 11.27C9.82 11.16 9.96 10.99 10.09 10.84C10.21 10.69 10.25 10.58 10.33 10.42C10.41 10.26 10.37 10.11 10.31 9.99C10.25 9.87 9.76 8.67 9.55 8.17C9.35 7.68 9.15 7.75 9 7.74C8.86 7.73 8.7 7.73 8.53 7.73C8.37 7.73 8.1 7.79 7.87 8.04C7.65 8.29 7.01 8.88 7.01 10.1C7.01 11.31 7.9 12.48 8.02 12.64C8.14 12.81 9.77 15.31 12.25 16.38C12.84 16.64 13.3 16.79 13.66 16.91C14.25 17.1 14.79 17.07 15.22 17.01C15.7 16.94 16.7 16.41 16.91 15.82C17.11 15.23 17.11 14.72 17.05 14.62C16.99 14.52 16.81 14.46 16.56 14.39Z" />
      </svg>
    ),
  },
  {
    id: "google-drive",
    name: "Google Drive",
    logo: (
      <svg className="h-6 w-6" viewBox="0 0 87.3 78" fill="none" aria-label="Google Drive Logo">
        <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA" />
        <path d="M43.65 25L29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.5c-.8 1.4-1.2 2.95-1.2 4.5h27.5L43.65 25z" fill="#00AC47" />
        <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15 7.9 13.65z" fill="#EA4335" />
        <path d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.4-4.5 1.2L43.65 25z" fill="#00832D" />
        <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2L59.8 53z" fill="#2684FC" />
        <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5l-12.7-22z" fill="#FFBA00" />
      </svg>
    ),
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    logo: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-label="Google Calendar Logo">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="#4285F4" />
        <path d="M16 13h-3v3h3v-3zm-5 0H8v3h3v-3z" fill="#34A853" />
        <path d="M16 18h-3v-3h3v3z" fill="#FBBC05" />
        <path d="M11 18H8v-3h3v3z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    id: "gmail",
    name: "Gmail",
    logo: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-label="Gmail Logo">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335" />
        <path d="M4 6l8 5 8-5H4z" fill="#C5221F" />
        <path d="M20 18H4V8l8 5 8-5v10z" fill="#EA4335" />
      </svg>
    ),
  },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-border-divider">
      <div className="rounded-2xl border border-border-default bg-slate-50/70 p-5 sm:px-8 sm:py-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue-primary">
              Native Integrations
            </span>
            <h3 className="mt-1 text-sm sm:text-base font-bold text-text-primary">
              Connected with tools your studio already uses
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full md:w-auto">
            {INTEGRATIONS.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-2.5 rounded-xl border border-border-default bg-white px-3.5 py-2.5 shadow-2xs transition hover:border-brand-blue-primary/40 hover:shadow-xs"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  {tool.logo}
                </div>
                <span className="text-xs font-semibold text-text-primary whitespace-nowrap">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

