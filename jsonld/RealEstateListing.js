/**
 * RealEstateListing JSON-LD Generator
 * Генерация разметки Schema.org/RealEstateListing для объектов САН
 * САМ v1.3 п. 1.6.1, САН V21.4 п. 7.2 (GEO-оптимизация)
 */

export function generateRealEstateListingJsonLd(property) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": property.url,
    "datePosted": property.datePosted,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address.street,
      "addressLocality": property.address.city,
      "addressRegion": property.address.region,
      "postalCode": property.address.postalCode,
      "addressCountry": property.address.country || "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": property.geo.latitude,
      "longitude": property.geo.longitude
    }
  };

  if (property.price) {
    jsonLd.offers = {
      "@type": "Offer",
      "price": property.price.amount,
      "priceCurrency": property.price.currency || "RUB",
      "availability": property.price.availability || "https://schema.org/InStock"
    };
  }

  if (property.floorSize) {
    jsonLd.floorSize = {
      "@type": "QuantitativeValue",
      "value": property.floorSize.value,
      "unitCode": property.floorSize.unit || "SQM"
    };
  }

  if (property.numberOfRooms) {
    jsonLd.numberOfRooms = property.numberOfRooms;
  }

  if (property.image) {
    jsonLd.image = property.image;
  }

  // Машинно-человеческая атрибуция (САН V21.4 п. 7.2.3)
  if (property.isParsed) {
    jsonLd.author = {
      "@type": "SoftwareAgent",
      "name": "САН Parser v2.1"
    };
    if (property.editor) {
      jsonLd.editor = {
        "@type": "Person",
        "name": property.editor.name
      };
    }
  } else if (property.agent) {
    jsonLd.author = {
      "@type": "RealEstateAgent",
      "name": property.agent.name,
      "url": property.agent.url
    };
  }

  return jsonLd;
}

export function injectRealEstateListingJsonLd(property) {
  const jsonLd = generateRealEstateListingJsonLd(property);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
}
