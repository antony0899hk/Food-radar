(() => {
  const norm=s=>(s??'').toString().normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
  const tokenize=s=>norm(s).split(/[\s,，/｜·()（）\-]+/).filter(Boolean);
  function textOf(x){return [x.name,x.shopSign,x.address,x.kind,x.district,x.tags?.join(' '),x.licenceType].filter(Boolean).join(' ')}
  function search(items,q='',filters={}){const qs=tokenize(q);return items.map(x=>{const hay=norm(textOf(x));let score=0;for(const t of qs){if(hay===t)score+=50;else if(hay.startsWith(t))score+=25;else if(hay.includes(t))score+=12;else return null;}if(filters.kind&&x.kind!==filters.kind)return null;if(filters.district&&x.district!==filters.district)return null;if(filters.openOnly&&x.open===false)return null;score+=x.cegoTested?15:0;return {...x,_score:score};}).filter(Boolean).sort((a,b)=>b._score-a._score||norm(a.name).localeCompare(norm(b.name),'zh-Hant'));}
  window.CEGOSearch={search,norm,tokenize};
})();