/**
 * FAQPage JSON-LD Generator
 * Генерация разметки Schema.org/FAQPage для справочников и главных страниц
 * САМ v1.3 п. 1.6.1, СУМКа v1.5 п. 5.4.7
 */

export function generateFAQPageJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function injectFAQPageJsonLd(faqs) {
  const jsonLd = generateFAQPageJsonLd(faqs);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
