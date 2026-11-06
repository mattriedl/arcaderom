/* Central ad configuration. Keep empty strings for clearly marked placeholders.
 * Paste each network's SLOT HTML in the matching entry. Load its external SDK
 * once using networkScript below. Injected script tags inside HTML do NOT execute.
 * For AdSense use <ins class="adsbygoogle" ...></ins> and set adsense:true.
 * Verify publisher rights, privacy/consent requirements and network policies first.
 */
window.ARCADE_ADS = {
  networkScript: '', // e.g. https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID
  adsense: false,
  slots: {'top-leaderboard':'','left-sidebar':'','right-sidebar':'','below-game':'','related-infeed':'','home-leaderboard':'','home-infeed':'','category-leaderboard':'','category-infeed':''}
};
(() => {
 const config=window.ARCADE_ADS;
 if(config.networkScript){const s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src=config.networkScript;document.head.append(s);}
 document.querySelectorAll('[data-ad-slot]').forEach(slot=>{
  const html=config.slots[slot.dataset.adSlot]; if(!html||getComputedStyle(slot).display==='none')return;
  slot.innerHTML='<span>ADVERTISEMENT</span><div class="ad-content"></div>';slot.querySelector('.ad-content').innerHTML=html;
  if(config.adsense&&slot.querySelector('ins.adsbygoogle')){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch(e){console.warn('Ad initialization unavailable',e);}}
 });
})();
