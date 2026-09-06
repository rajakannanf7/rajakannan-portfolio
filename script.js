const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];
const nav=q('.nav-links'),menu=q('.menu-btn');
if(menu&&nav)menu.addEventListener('click',()=>nav.classList.toggle('open'));
qa('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav&&nav.classList.remove('open')));

const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');reveal.unobserve(e.target)}}),{threshold:.12});
qa('.reveal').forEach(el=>reveal.observe(el));

qa('img').forEach(img=>img.addEventListener('error',()=>{img.style.display='none';img.parentElement&&img.parentElement.classList.add('asset-fallback')}));

const ticker=q('.ticker-track');
if(ticker&&!ticker.dataset.duped){ticker.innerHTML+=ticker.innerHTML;ticker.dataset.duped='1'}

const filters=qa('.filter');
filters.forEach(btn=>btn.addEventListener('click',()=>{
  filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const key=btn.dataset.filter||'all';
  qa('[data-category]').forEach(card=>{card.style.display=(key==='all'||card.dataset.category===key)?'block':'none'});
}));

window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  const obj=q('.hero-object img');
  if(obj&&y<innerHeight*1.3)obj.style.transform=`translate3d(0,${y*.045}px,0) rotate(${y*.002}deg)`;
},{passive:true});
