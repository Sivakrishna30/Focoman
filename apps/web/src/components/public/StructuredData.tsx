export function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://focoman.web.app';
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Focoman",
        "url": `${baseUrl}`,
        "logo": `${baseUrl}/brand/focoman-logo.png`,
        "description": "Business operating system for photography and cinematography studios.",
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": `${baseUrl}`,
        "name": "Focoman",
        "publisher": {
          "@id": `${baseUrl}/#organization`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/#application`,
        "name": "Focoman Studio BOS",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "url": `${baseUrl}`,
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
            "description": "Run your studio with Customer Directory, CRM history, team profiles, manual crew allocation, and order workflow WhatsApp notifications.",
          },
          {
            "@type": "Offer",
            "name": "Professional",
            "price": "999",
            "priceCurrency": "INR",
            "billingDuration": "P1M",
            "description": "Public Studio Marketplace publishing, incoming booking inquiries, crew availability calendars, automated event reminders, and Google integrations.",
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
