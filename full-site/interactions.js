(()=>{
 const q=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
 const rail=q('.pdf-rail'),select=q('[data-pdf-page]');
 if(rail){let index=0;const move=n=>{index=Math.max(0,Math.min(6,n));rail.scrollTo({left:rail.clientWidth*index,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})};q('[data-pdf-prev]').onclick=()=>move(index-1);q('[data-pdf-next]').onclick=()=>move(index+1);select.onchange=()=>move(Number(select.value));rail.addEventListener('scroll',()=>{index=Math.round(rail.scrollLeft/rail.clientWidth);select.value=String(index);q('[data-pdf-prev]').disabled=index===0;q('[data-pdf-next]').disabled=index===6},{passive:true});q('.pdf-viewer').addEventListener('keydown',ev=>{if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){ev.preventDefault();move(index+(ev.key==='ArrowRight'?1:-1))}});q('[data-pdf-prev]').disabled=true;addEventListener('resize',()=>move(index))}
 q('[data-share-guide]')?.addEventListener('click',async()=>{const url=new URL('assets/gsk-toolkit.pdf',location.href).href;try{if(navigator.share)await navigator.share({title:'Gaza Soup Kitchen Toolkit',url});else{await navigator.clipboard.writeText(url);q('[data-share-status]').textContent='Toolkit link copied.'}}catch(e){if(e.name!=='AbortError')q('[data-share-status]').textContent='Open the PDF, then copy its address to share.'}});
 const launcher=q('.social-launcher>button');if(launcher){launcher.textContent='↗';launcher.setAttribute('aria-label','Open social channels')}
 const form=q('[data-inquiry]');if(form){const category=new URLSearchParams(location.search).get('category');if(category&&[...form.elements.category.options].some(o=>o.value===category))form.elements.category.value=category}
 const connection=window.GSKConnections||{};
 all('.gift-card').forEach(card=>{
  const cta=card.querySelector('.gift-cta');if(!cta)return;
  const update=()=>{
   const destination=new URL(connection.donation||'https://givebutter.com/gaza-soup-kitchen');
   const amount=card.querySelector('[data-amount].selected')?.dataset.amount||'50';
   const frequency=card.querySelector('[data-freq].selected')?.dataset.freq==='Monthly'?'monthly':'once';
   if(destination.hostname==='givebutter.com'){
    if(!/\/(donate|support)\/?$/.test(destination.pathname))destination.pathname=destination.pathname.replace(/\/$/,'')+(destination.pathname.startsWith('/c/')?'/support':'/donate');
    if(amount!=='other')destination.searchParams.set('amount',amount);else destination.searchParams.delete('amount');
    destination.searchParams.set('frequency',frequency);
   }
   cta.href=destination.href;cta.target='_blank';cta.rel='noopener';
   if(document.documentElement.lang==='ar')card.querySelector('.gift-selection').textContent=(frequency==='monthly'?'شهرياً':'مرة واحدة')+' · '+(amount==='other'?'حدد المبلغ عند الدفع':'$'+amount);
  };
  card.querySelectorAll('[data-freq],[data-amount]').forEach(button=>button.addEventListener('click',update));update();
  if(connection.widget_id&&connection.widget_account){
   const slot=document.createElement('div');slot.className='giving-widget';
   const widget=document.createElement('givebutter-widget');widget.id=connection.widget_id;slot.append(widget);card.after(slot);
   const observer=new MutationObserver(()=>{if(slot.querySelector('iframe')){card.hidden=true;observer.disconnect()}});observer.observe(slot,{childList:true,subtree:true});
  }
 });
 if(connection.widget_id&&connection.widget_account&&q('givebutter-widget')){const s=document.createElement('script');s.src='https://widgets.givebutter.com/latest.umd.cjs?acct='+encodeURIComponent(connection.widget_account);s.async=true;document.head.append(s)}
})();
