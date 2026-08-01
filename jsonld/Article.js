/**
 * Article JSON-LD Generator
 * Генерация разметки Schema.org/Article
 * САМ v1.3 п. 1.6.1
 */

export function generateArticleJsonLd(article, siteName, siteLogo) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.featuredImage || '',
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate || article.publishedDate,
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "url": article.author.url,
      "jobTitle": article.author.role,
      "worksFor": {
        "@type": "Organization",
        "name": "НП «Общественное благополучие»"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": siteLogo
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
  
  // Добавление hasOccupation для мульти-ролевой атрибуции
  if (article.author.occupations) {
    jsonLd.author.hasOccupation = article.author.occupations.map(occ => ({
      "@type": "Occupation",
      "name": occ
    }));
  }
  
  // Добавление sameAs для архитектуры "Хаб и Спицы"
  if (article.author.sameAs) {
    jsonLd.author.sameAs = article.author.sameAs;
  }
  
  return jsonLd;
}

export function injectArticleJsonLd(article, siteName, siteLogo) {
  const jsonLd = generateArticleJsonLd(article, siteName, siteLogo);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
