export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://focoman.web.app/#organization",
        "name": "Focoman",
        "url": "https://focoman.web.app",
        "logo": "https://focoman.web.app/brand/focoman-logo.svg",
        "description": "Business operating system for photography and cinematography studios.",
      },
      {
        "@type": "WebSite",
        "@id": "https://focoman.web.app/#website",
        "url": "https://focoman.web.app",
        "name": "Focoman",
        "publisher": {
          "@id": "https://focoman.web.app/#organization",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://focoman.web.app/#application",
        "name": "Focoman Studio BOS",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "url": "https://focoman.web.app",
        "description": "A Complete Business Operating System for Photography Studios. Unifies orders, shoot schedules, dynamic service workflows, crew planning, offline payments, and client deliveries.",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free",
            "price": "0",
            "priceCurrency": "INR",
            "description": "Essential Order Management System for photography studios with unlimited orders and events.",
          },
          {
            "@type": "Offer",
            "name": "Starter",
            "price": "499",
            "priceCurrency": "INR",
            "billingDuration": "P1M",
            "description": "Run your studio with Customer Directory, CRM history, basic crew management, and booking inquiries.",
          },
          {
            "@type": "Offer",
            "name": "Professional",
            "price": "999",
            "priceCurrency": "INR",
            "billingDuration": "P1M",
            "description": "Get discovered on the Public Studio Marketplace, manage crew availability calendars, and integrate Google Workspace.",
          },
          {
            "@type": "Offer",
            "name": "Complete",
            "price": "1999",
            "priceCurrency": "INR",
            "billingDuration": "P1M",
            "description": "Smart Resource Automation, WhatsApp notifications & Operations Bot, and multi-studio workspace management.",
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
