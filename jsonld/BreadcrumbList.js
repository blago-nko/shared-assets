/**
 * BreadcrumbList JSON-LD Generator
 * Генерация разметки Schema.org/BreadcrumbList
 * САМ v1.3 п. 1.6.1
 */

export function generateBreadcrumbListJsonLd(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.title,
      "item": crumb.url
    }))
  };
}

export function injectBreadcrumbJsonLd(breadcrumbs) {
  const jsonLd = generateBreadcrumbListJsonLd(breadcrumbs);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
