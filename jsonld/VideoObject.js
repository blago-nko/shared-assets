/**
 * VideoObject JSON-LD Generator
 * Генерация разметки Schema.org/VideoObject с массивом uploadUrl
 * САМ v1.3 п. 1.6.1, САН V21.4 п. 7.2.4 (Двойное зеркалирование)
 */

export function generateVideoObjectJsonLd(video) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl,
    "uploadDate": video.uploadDate,
    "uploadUrl": video.uploadUrls || [video.primaryUrl],
    "embedUrl": video.embedUrl || video.primaryUrl,
    "duration": video.duration || "PT0S",
    "regionsAllowed": video.regionsAllowed || ["RU"]
  };

  if (video.author) {
    jsonLd.author = {
      "@type": video.author.type || "Person",
      "name": video.author.name
    };
  }

  if (video.publisher) {
    jsonLd.publisher = {
      "@type": "Organization",
      "name": video.publisher
    };
  }

  return jsonLd;
}

export function injectVideoObjectJsonLd(video) {
  const jsonLd = generateVideoObjectJsonLd(video);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
