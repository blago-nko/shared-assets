/**
 * BookChapter JSON-LD Generator
 * Генерация разметки Schema.org/Book и Chapter для многостраничных материалов
 * САМ v1.3 п. 1.6.1, Манифест Миграции v5.4 п. 2 (Book/Chapter Pattern)
 */

export function generateBookJsonLd(book) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": {
      "@type": "Person",
      "name": book.author.name,
      "url": book.author.url
    },
    "datePublished": book.publishedDate,
    "isbn": book.isbn || "",
    "numberOfPages": book.chapters?.length || 0,
    "hasPart": book.chapters.map((chapter, index) => ({
      "@type": "Chapter",
      "position": index + 1,
      "name": chapter.title,
      "url": chapter.url,
      "description": chapter.description || ""
    }))
  };
}

export function generateChapterJsonLd(chapter, book) {
  return {
    "@context": "https://schema.org",
    "@type": "Chapter",
    "name": chapter.title,
    "position": chapter.position,
    "isPartOf": {
      "@type": "Book",
      "name": book.title,
      "url": book.url
    },
    "url": chapter.url,
    "description": chapter.description || ""
  };
}

export function injectBookJsonLd(book) {
  const jsonLd = generateBookJsonLd(book);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
