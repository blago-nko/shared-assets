import React from 'react';

/**
 * PrivacyPolicyLink - компонент для отображения ссылки на политику конфиденциальности
 * 
 * Согласно САМ.md п. 2.4:
 * - Единая ссылка в footer всех 14 сайтов
 * - URL: https://partnerstvo.blagorussia.ru/p/privacy-policy.html
 * - Атрибут rel="nofollow"
 * - Fallback на резервную копию shared-assets/legal/privacy-policy.html
 */

const PrivacyPolicyLink = ({ 
  className = 'privacy-policy-link',
  text = 'Политика конфиденциальности',
  primaryUrl = 'https://partnerstvo.blagorussia.ru/p/privacy-policy.html',
  fallbackUrl = '/legal/privacy-policy.html',
  rel = 'nofollow',
  target = '_self'
}) => {
  const [linkUrl, setLinkUrl] = React.useState(primaryUrl);

  React.useEffect(() => {
    const checkPrimaryUrl = async () => {
      try {
        const response = await fetch(primaryUrl, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setLinkUrl(primaryUrl);
      } catch (error) {
        console.warn('Privacy Policy: Primary URL unavailable, using fallback');
        setLinkUrl(fallbackUrl);
      }
    };

    checkPrimaryUrl();
  }, [primaryUrl, fallbackUrl]);

  return (
    <a 
      href={linkUrl}
      className={className}
      rel={rel}
      target={target}
      aria-label="Политика конфиденциальности"
    >
      {text}
    </a>
  );
};

export default PrivacyPolicyLink;
