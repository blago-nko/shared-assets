/**
 * Organization JSON-LD Generator
 * Генерация разметки Schema.org/Organization для НПО и брендов
 * САМ v1.3 п. 1.6.1
 */

export function generateOrganizationJsonLd(org) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": org.type || "NonprofitOrganization",
    "name": org.name,
    "url": org.url,
    "logo": org.logo,
    "description": org.description,
    "foundingDate": org.foundingDate,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": org.address?.city || "Воронеж",
      "addressRegion": org.address?.region || "Воронежская область",
      "addressCountry": org.address?.country || "RU"
    },
    "sameAs": org.sameAs || [],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": org.email || "blagorussia@yandex.ru",
      "contactType": "customer service",
      "availableLanguage": ["Russian", "English"]
    }
  };

  if (org.founder) {
    jsonLd.founder = {
      "@type": "Person",
      "name": org.founder.name,
      "url": org.founder.url
    };
  }

  if (org.member) {
    jsonLd.member = org.member.map(m => ({
      "@type": "Person",
      "name": m.name,
      "url": m.url
    }));
  }

  return jsonLd;
}

export function injectOrganizationJsonLd(org) {
  const jsonLd = generateOrganizationJsonLd(org);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
