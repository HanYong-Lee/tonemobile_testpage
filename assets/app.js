(() => {
  const config = window.T1_CONFIG || {};
  const FALLBACK_STORES = [
    {id:"wonsin",name:"원신흥본점",address:"대전 유성구 봉명로 27-3",image:"images/wonshinheung.jpg",lat:36.34217832389156,lng:127.34261515812987,phone:"010-2024-2011",naver:"https://naver.me/5pEzM5AE",navertalk:"https://naver.me/Glmu4Q66",daangn:"https://www.daangn.com/kr/local-profile/nj35pauscpaq/",tworld:"https://tworldfriends.co.kr/D634190000/subscribers/create"},
    {id:"yongun",name:"용운점",address:"대전 동구 용운로 203",image:"images/yongwoon.jpg",lat:36.32795906726769,lng:127.4620266934382,phone:"010-4880-5010",naver:"https://naver.me/5ZjdrJ3Q",navertalk:"#",daangn:"https://www.daangn.com/kr/local-profile/5wc4p38gfuoy/",tworld:"https://tworldfriends.co.kr/D634190010/subscribers/create"},
    {id:"yongmun",name:"용문점",address:"대전 서구 계룡로 661-1",image:"images/yongmoon.jpg",lat:36.33723627082111,lng:127.39489427547278,phone:"010-2859-6011",naver:"https://naver.me/FytQtAEK",navertalk:"https://naver.me/GgUe0vNy",daangn:"https://www.daangn.com/kr/local-profile/j69a7cum7pqm/",tworld:"https://tworldfriends.co.kr/D634190013/subscribers/create"},
    {id:"asankwongok",name:"아산권곡점",address:"충남 아산시 문화로 271-6",image:"images/kwongok.jpg",lat:36.788342575970425,lng:127.01581654750537,phone:"010-3072-6011",naver:"https://naver.me/GplJeXqn",navertalk:"https://naver.me/50JGTvtn",daangn:"https://www.daangn.com/kr/local-profile/iutk11xfiu5b/",tworld:"https://tworldfriends.co.kr/D634190012/subscribers/create"},
    {id:"jiwell",name:"지웰시티점",address:"충북 청주시 흥덕구 대농로 47",image:"images/gwellcity.jpg",lat:36.64206725549196,lng:127.42751718278974,phone:"010-6213-2010",naver:"https://naver.me/xUwgrDjt",navertalk:"https://naver.me/xUwgrDjt",daangn:"https://www.daangn.com/kr/local-profile/bo2se7i65gii/",tworld:"https://tworldfriends.co.kr/D634190015/subscribers/create"}
  ];
  const DEFAULT_STORE_COLUMNS = {
    "원신흥":"원신흥본점",
    "용운":"용운점",
    "용문":"용문점",
    "아산권곡":"아산권곡점",
    "지웰시티":"지웰시티점"
  };
  const FALLBACK_INVENTORY = [
    {model:"아이폰 15프로맥스",storage:"256G",color:"화이트",companyQty:5,stockByStore:{"원신흥본점":0,"용운점":0,"용문점":1,"아산권곡점":0,"지웰시티점":0}},
    {model:"아이폰 15프로맥스",storage:"256G",color:"회색",companyQty:4,stockByStore:{"원신흥본점":0,"용운점":1,"용문점":0,"아산권곡점":1,"지웰시티점":0}}
  ];
  const state = {stores:FALLBACK_STORES,inventory:FALLBACK_INVENTORY,slide:0,specialId:"today-special1",contactContext:null};
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));

  function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(el.timer);el.timer=setTimeout(()=>el.classList.remove("show"),2400)}
  function log(action, details={}){
    const payload={timestamp:new Date().toISOString(),action,...details};
    if(!config.analyticsEndpoint) return;
    fetch(config.analyticsEndpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(payload)}).catch(()=>{});
  }
  function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem("t1-theme",theme);const dark=theme==="dark";$("#themeToggle span").textContent=dark?"☀":"☾";$("#themeToggle").ariaLabel=dark?"라이트 모드로 변경":"다크 모드로 변경";$("meta[name=theme-color]").content=dark?"#071426":"#ffffff"}
  function initTheme(){const saved=localStorage.getItem("t1-theme");setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"));$("#themeToggle").onclick=()=>setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark")}
  function openView(name){$$('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));scrollTo({top:0,behavior:'smooth'});if(name!=="home") location.hash=name;else history.replaceState(null,"",location.pathname);log(`home_${name}_click`)}
  function openModal(id){const modal=document.getElementById(id);if(modal&&!modal.open){modal.showModal();document.body.style.overflow="hidden";if(id==="specialModal")log("home_special_click");if(id==="csModal")log("home_cs_click")}}
  function closeModal(modal){if(modal?.open)modal.close();document.body.style.overflow=""}
  function bindNavigation(){$$('[data-open-view]').forEach(b=>b.onclick=()=>openView(b.dataset.openView));$$('[data-open-modal]').forEach(b=>b.onclick=()=>openModal(b.dataset.openModal));$$('[data-close-modal]').forEach(b=>b.onclick=()=>closeModal(b.closest('dialog')));$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)closeModal(d)}))}

  function csvRows(text){
    const rows=[];let row=[],cell="",quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&quoted&&n==='"'){cell+='"';i++}else if(c==='"'){quoted=!quoted}else if(c===','&&!quoted){row.push(cell);cell=""}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(v=>v!==""))rows.push(row);row=[];cell=""}else cell+=c}
    row.push(cell);if(row.some(v=>v!==""))rows.push(row);return rows;
  }
  async function loadCsv(url){if(!url)return null;const res=await fetch(url,{cache:"no-store"});if(!res.ok)throw new Error("sheet");const rows=csvRows(await res.text());const headers=rows.shift().map(h=>h.trim().toLowerCase().replace(/^\uFEFF/,""));return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]||"").trim()]))) }
  function toQty(value){
    const number=Number(String(value??"").replace(/,/g,"").trim());
    return Number.isFinite(number)&&number>0?Math.floor(number):0;
  }
  function transformInventoryRows(rows){
    const storeColumns=config.inventoryStoreColumns||DEFAULT_STORE_COLUMNS;
    return rows.map(row=>{
      const stockByStore={};
      Object.entries(storeColumns).forEach(([column,storeName])=>{
        stockByStore[storeName]=toQty(row[column.toLowerCase()]);
      });
      return {
        model:row["모델"]||row.model||"",
        storage:row["용량"]||row.storage||"",
        color:row["색상"]||row.color||"",
        companyQty:toQty(row["전사"]??row.total??row.companyqty),
        stockByStore
      };
    }).filter(item=>item.model&&item.storage&&item.color);
  }
  async function loadData(){
    try{const rows=await loadCsv(config.storesCsvUrl);if(rows?.length)state.stores=rows.map((r,i)=>({id:r.id||`store${i}`,name:r.name||r.store,address:r.address,image:r.image||r.photo||`images/store-${r.id||i}.jpg`,lat:+r.lat||+r.latitude,lng:+r.lng||+r.longitude,phone:r.phone,naver:r.naver,navertalk:r.navertalk,daangn:r.daangn,tworld:r.tworld}))}catch(e){toast("매장 기본 정보로 표시 중이에요.")}
    try{const rows=await loadCsv(config.inventoryCsvUrl);if(rows?.length){const inventory=transformInventoryRows(rows);if(inventory.length)state.inventory=inventory}}catch(e){toast("샘플 재고로 화면을 확인하고 있어요.")}
    fillFilters();renderStores();searchInventory();
  }
  function distanceKm(a,b,c,d){const R=6371,toRad=x=>x*Math.PI/180;const p1=toRad(c-a),p2=toRad(d-b);const q=Math.sin(p1/2)**2+Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(p2/2)**2;return R*2*Math.atan2(Math.sqrt(q),Math.sqrt(1-q))}
  function mapUrl(store){return store.naver&&store.naver!=="#"?store.naver:`https://map.naver.com/p/search/${encodeURIComponent(store.address||store.name)}`}
  function actionLink(label,url,action,store,primary=false){return `<a class="action-button${primary?' primary':''}" href="${esc(url||'#')}" ${url&&url.startsWith('http')?'target="_blank" rel="noopener"':''} data-log="${action}" data-store="${esc(store.name)}">${label}</a>`}
  function renderStores(position){
    const list=state.stores.map(s=>({...s,distance:position?distanceKm(position.coords.latitude,position.coords.longitude,s.lat,s.lng):null})).sort((a,b)=>(a.distance??9999)-(b.distance??9999));
    $("#storeList").innerHTML=list.map(s=>`<article class="store-card store-photo-card"><div class="store-photo"><img src="${esc(s.image||`images/store-${s.id}.jpg`)}" alt="${esc(s.name)} 매장 전경" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="store-photo-placeholder" hidden><span>T1</span><strong>${esc(s.name)}</strong><small>매장 사진 준비 중</small></div>${s.distance!==null?`<span class="distance photo-distance">약 ${s.distance.toFixed(1)}km</span>`:''}</div><div class="store-card-body"><div class="store-info"><h3>${esc(s.name)}</h3><p class="address">${esc(s.address)}</p></div><div class="card-actions store-actions">${actionLink("전화",`tel:${s.phone}`,"store_call",s,true)}${actionLink("길찾기",mapUrl(s),"store_map",s)}${actionLink("네이버톡",s.navertalk,"store_naver",s)}${actionLink("당근",s.daangn,"store_daangn",s)}</div></div></article>`).join("");
    bindLogs();
  }
  function locate(){if(!navigator.geolocation){$("#locationStatus").textContent="이 브라우저에서는 위치 확인이 어려워요. 전체 매장을 안내합니다.";return}const b=$("#locateButton");b.disabled=true;b.textContent="확인 중…";navigator.geolocation.getCurrentPosition(p=>{renderStores(p);$("#locationStatus").textContent="현재 위치에서 가까운 순으로 정렬했어요.";b.textContent="다시 확인";b.disabled=false;log("gps_allow")},()=>{$("#locationStatus").textContent="위치 권한 없이 전체 매장을 안내하고 있어요.";b.textContent="내 위치 확인";b.disabled=false;toast("브라우저에서 위치 권한을 허용해 주세요.")},{enableHighAccuracy:false,timeout:8000,maximumAge:300000})}

  const aliases={"아이폰":"iphone","갤럭시":"galaxy","프맥":"promax","프로맥스":"promax","프로 맥스":"promax","울트라":"ultra","플립":"flip","폴드":"fold","기가":"gb","지비":"gb","흰색":"화이트","하양":"화이트","검정":"블랙","까망":"블랙"};
  function norm(value){let v=String(value||"").toLowerCase();Object.entries(aliases).sort((a,b)=>b[0].length-a[0].length).forEach(([a,b])=>v=v.split(a).join(b));return v.replace(/\s+|[^a-z0-9가-힣]/g,"")}
  function lev(a,b){const d=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));for(let i=0;i<=a.length;i++)d[i][0]=i;for(let j=0;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
  function matchesQuery(item,query){if(!query)return true;const q=norm(query),hay=norm(`${item.model}${item.storage}${item.color}`);if(hay.includes(q))return true;const tokens=query.trim().split(/\s+/).map(norm).filter(Boolean);return tokens.every(t=>hay.includes(t)||lev(t,norm(item.model))<=Math.max(1,Math.floor(t.length*.22)))}
  function fillFilters(){const store=$("#storeFilter"),storage=$("#storageFilter"),color=$("#colorFilter");store.innerHTML='<option value="">상관없음</option>'+[...new Set(state.stores.map(s=>s.name))].map(x=>`<option>${esc(x)}</option>`).join('');storage.innerHTML='<option value="">전체 용량</option>'+[...new Set(state.inventory.map(x=>x.storage))].map(x=>`<option>${esc(x)}</option>`).join('');color.innerHTML='<option value="">전체 색상</option>'+[...new Set(state.inventory.map(x=>x.color))].map(x=>`<option>${esc(x)}</option>`).join('')}
  function stockStatus(qty){if(qty<=0)return{label:"품절",cls:"soldout"};if(qty<=2)return{label:"소진 임박🔥",cls:"urgent"};return{label:"재고 있어요😊",cls:""}}
  function searchInventory(event){
    event?.preventDefault();
    const q=$("#inventoryQuery")?.value||"";
    const store=$("#storeFilter")?.value||"";
    const storage=$("#storageFilter")?.value||"";
    const color=$("#colorFilter")?.value||"";
    let results=state.inventory
      .filter(x=>(!storage||x.storage===storage)&&(!color||x.color===color)&&matchesQuery(x,q))
      .map(x=>({...x,qty:store?toQty(x.stockByStore?.[store]):toQty(x.companyQty)}));
    const available=results.filter(x=>x.qty>0),soldout=results.filter(x=>x.qty<=0);
    results=[...available,...soldout];
    const scope=store||"전사";
    $("#resultSummary").textContent=results.length?`${scope} 기준 ${results.length}개의 재고를 찾았어요. 재고는 실시간 판매에 따라 달라질 수 있습니다.`:"조건에 맞는 재고가 없어요. 검색어 또는 매장을 바꿔보세요.";
    $("#inventoryList").innerHTML=results.length?results.map((x,i)=>{
      const status=stockStatus(x.qty);
      if(!store)return `<article class="stock-card"><div class="card-top"><div><div class="stock-title"><h3>${esc(x.model)}</h3></div><p class="spec">${esc(x.storage)} · ${esc(x.color)}<br>🏢 전사 재고</p></div><span class="stock-badge ${status.cls}">${status.label}</span></div><div class="card-actions one"><button class="action-button primary" data-reserve="${i}" ${x.qty<=0?'disabled':''}>문의할 매장 선택</button></div></article>`;
      const storeData=state.stores.find(v=>v.name===store)||{name:store,phone:"",naver:"#"};
      return `<article class="stock-card"><div class="card-top"><div><div class="stock-title"><h3>${esc(x.model)}</h3></div><p class="spec">${esc(x.storage)} · ${esc(x.color)}<br>📍 ${esc(store)}</p></div><span class="stock-badge ${status.cls}">${status.label}</span></div><div class="card-actions three">${actionLink("전화문의",`tel:${storeData.phone}`,"inventory_call",storeData,x.qty>0)}${actionLink("길찾기",mapUrl(storeData),"inventory_map",storeData)}<button class="action-button" data-reserve="${i}" ${x.qty<=0?'disabled':''}>재고 예약</button></div></article>`;
    }).join(''):`<div class="empty-state"><strong>검색 결과가 없습니다.</strong>다른 모델명이나 조건으로 다시 검색해 주세요.</div>`;
    $$('[data-reserve]').forEach(button=>button.onclick=()=>startContact(results[+button.dataset.reserve],"inventory"));
    bindLogs();
    if(event)log("inventory_search",{query:q,store:store||"전사",storage,color,resultCount:results.length});
  }
  function bindLogs(){
    $$('[data-log]').forEach(el=>{
      if(el.dataset.bound)return;
      el.dataset.bound='1';
      el.addEventListener('click',e=>{
        if(el.getAttribute('href')==='#'){e.preventDefault();toast("운영 링크를 연결해 주세요.")}
        log(el.dataset.log,{store:el.dataset.store});
      });
    });
  }

  function renderSlides(){const images=config.specialImages?.length?config.specialImages:["images/today-special1.jpg"];$("#slides").innerHTML=images.map((src,i)=>`<div class="slide"><img src="${esc(src)}" alt="오늘의 특가 ${i+1}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="image-placeholder" hidden><span>%</span><strong>${esc(src.split('/').pop())}</strong><p>이 위치에 3:4 특가 이미지를 넣어주세요.</p></div></div>`).join('');$("#slideIndicators").innerHTML=images.map((_,i)=>`<button aria-label="${i+1}번 특가" data-slide="${i}"></button>`).join('');$$('[data-slide]').forEach(b=>b.onclick=()=>goSlide(+b.dataset.slide));goSlide(0);let startX=0;$("#specialSlider").addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});$("#specialSlider").addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)goSlide(state.slide+(dx<0?1:-1))},{passive:true})}
  function goSlide(index){const len=config.specialImages?.length||1;state.slide=(index+len)%len;$("#slides").style.transform=`translateX(-${state.slide*100}%)`;$$('[data-slide]').forEach((b,i)=>b.classList.toggle('active',i===state.slide));state.specialId=`today-special${state.slide+1}`;log("special_view",{campaign:state.specialId})}
  function startContact(context,type){state.contactContext={context,type,campaign:type==="special"?state.specialId:"inventory"};$("#contactTitle").textContent="문의할 매장을 선택해 주세요";$("#contactSteps").innerHTML=`<div class="choice-grid">${state.stores.map(s=>`<button class="choice-button" data-contact-store="${esc(s.id)}"><strong>${esc(s.name)}</strong><span>${esc(s.address)}</span></button>`).join('')}</div>`;closeModal($("#specialModal"));openModal("contactModal");$$('[data-contact-store]').forEach(b=>b.onclick=()=>chooseMethod(state.stores.find(s=>s.id===b.dataset.contactStore)))}
  function chooseMethod(store){const c=state.contactContext;c.store=store;$("#contactTitle").textContent=`${store.name} 문의 방식`;$("#contactSteps").innerHTML=`<div class="choice-grid"><a class="choice-button" href="tel:${esc(store.phone)}" data-method="call"><strong>☎ 전화</strong><span>${esc(store.phone)}</span></a><a class="choice-button" href="${esc(store.navertalk||'#')}" data-method="naver"><strong>💬 네이버톡</strong><span>채팅으로 편하게 문의</span></a><a class="choice-button" href="${esc(store.daangn||'#')}" data-method="daangn"><strong>🥕 당근</strong><span>동네 매장으로 문의</span></a></div>`;$$('[data-method]').forEach(a=>a.onclick=e=>{if(a.getAttribute('href')==='#'){e.preventDefault();toast("운영 링크를 연결해 주세요.")}const item=c.context||{};log(`${c.type}_${a.dataset.method}`,{store:store.name,model:item.model,storage:item.storage,color:item.color,campaign:c.campaign})})}
  function init(){initTheme();bindNavigation();renderSlides();$("#locateButton").onclick=locate;$("#inventoryForm").onsubmit=searchInventory;[$("#storeFilter"),$("#storageFilter"),$("#colorFilter")].forEach(x=>x.onchange=searchInventory);$("#slidePrev").onclick=()=>goSlide(state.slide-1);$("#slideNext").onclick=()=>goSlide(state.slide+1);$("#specialContactButton").onclick=()=>{log("special_contact",{campaign:state.specialId});startContact(null,"special")};loadData();const hash=location.hash.slice(1);if(["stores","inventory"].includes(hash))openView(hash)}
  document.addEventListener("DOMContentLoaded",init);
})();
