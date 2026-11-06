document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{const row=document.getElementById(b.dataset.scroll);row.scrollBy({left:row.clientWidth*(Number(b.dataset.direction)||1)*.8,behavior:'smooth'});}));
const hero=document.querySelector('.hero');
if(hero){
 const slides=JSON.parse(document.getElementById('hero-data').textContent);let current=0;
 function show(i){current=(i+slides.length)%slides.length;const s=slides[current];hero.querySelector('.hero-art').src=s.image;hero.querySelector('.hero-art').alt=s.title+' featured game';hero.querySelector('[data-hero-title]').textContent=s.title;hero.querySelector('[data-hero-category]').textContent=s.category+' / FEATURED PICK';hero.querySelector('[data-hero-play]').href=s.url;hero.querySelectorAll('[data-slide]').forEach((b,n)=>b.setAttribute('aria-pressed',n===current));}
 hero.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.slide))));
 // Deliberately manual carousel: no unwanted auto-motion or interrupted reading.
}
const full=document.querySelector('[data-fullscreen]');
if(full)full.addEventListener('click',async()=>{try{const p=document.querySelector('.player');if(document.fullscreenElement)await document.exitFullscreen();else await p.requestFullscreen();}catch(e){document.querySelector('.share-status').textContent='Fullscreen is unavailable in this browser.';}});
const copy=document.querySelector('[data-copy]');
if(copy)copy.addEventListener('click',async()=>{const s=document.querySelector('.share-status');try{await navigator.clipboard.writeText(location.href);s.textContent='Game link copied.';}catch(e){s.textContent='Copy this URL from your address bar to share.';}});
const results=document.getElementById('search-results');
if(results){
 const query=new URLSearchParams(location.search).get('q')||'';document.querySelector('.search input').value=query;document.getElementById('search-term').textContent=query?'Results for “'+query+'”':'Find your next game';
 fetch('/assets/search-index.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(games=>{
  const terms=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);const matches=terms.length?games.filter(g=>terms.every(t=>(g.title+' '+g.category).toLocaleLowerCase().includes(t))):[];
  document.getElementById('result-count').textContent=terms.length?matches.length+' games found':'Search by game title or category.';
  const fragment=document.createDocumentFragment();matches.forEach(g=>{const a=document.createElement('a');a.className='card';a.href=g.url;const image=document.createElement('img');image.src=g.image;image.alt=g.title+' thumbnail';image.loading='lazy';const picture=document.createElement('div');picture.className='card-image';picture.append(image);const info=document.createElement('div');info.className='card-info';const h=document.createElement('h3');h.textContent=g.title;const meta=document.createElement('div');meta.className='card-meta';meta.textContent=g.category+' · FREE';info.append(h,meta);a.append(picture,info);fragment.append(a);});results.replaceChildren(fragment);
 }).catch(()=>{document.getElementById('result-count').textContent='Search is unavailable. Browse All Games instead.';});
}
