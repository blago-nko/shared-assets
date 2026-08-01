/**
 * ImageObject JSON-LD Generator
 * Генерация разметки Schema.org/ImageObject с обязательной атрибуцией
 * САМ v1.3 п. 1.6.1, Грек-Пантеон п. 7.1
 */

export function generateImageObjectJsonLd(image) {
  const jsonLd = {
    "@type": "ImageObject",
    "contentUrl": image.url,
    "width": image.width,
    "height": image.height,
    "author": {
      "@type": "Person",
      "name": image.author || "Неизвестен"
    },
    "license": image.license || "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": image.source || ""
  };
  
  if (image.caption) {
    jsonLd.caption = image.caption;
  }
  
  if (image.description) {
    jsonLd.description = image.description;
  }
  
  return jsonLd;
}

export function injectImageJsonLd(image) {
  const jsonLd = generateImageObjectJsonLd(image);
  
  // Добавляем к существующему JSON-LD или создаем новый
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    const existingData = JSON.parse(existingScript.textContent);
    if (Array.isArray(existingData)) {
      existingData.push(jsonLd);
    } else {
      existingScript.textContent = JSON.stringify([existingData, jsonLd]);
    }
  } else {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}
