(function () {
  var internalDomains = [
    'blagorussia.ru', 'obrazslov.ru',
    'partnerstvo.blagorussia.ru', 'novosti.blagorussia.ru', 'ot-gorozan.blagorussia.ru',
    'obavlenia.blagorussia.ru', 'interesnye-mesta.obrazslov.ru', 'moisites.blagorussia.ru',
    'joga.blagorussia.ru', 'ideologia.obrazslov.ru', 'nasa-istoria.blagorussia.ru',
    'grekpanteon.obrazslov.ru', 'gallery.obrazslov.ru', 'can.blagorussia.ru'
  ];
  function isInternal(hostname) {
    for (var i = 0; i < internalDomains.length; i++) {
      var d = internalDomains[i];
      if (hostname === d || hostname.slice(-(d.length + 1)) === '.' + d) { return true; }
    }
    return false;
  }
  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('a[href^="http"]');
    for (var i = 0; i < links.length; i++) {
      if (!isInternal(links[i].hostname)) {
        links[i].target = '_blank';
        links[i].rel = 'noopener noreferrer';
      }
    }
  });
})();
