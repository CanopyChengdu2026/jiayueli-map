const places = [{"id": "science", "name": "四川科技馆", "en": "", "file": "intro-7.png", "x": 35, "y": 39, "w": 7, "h": 9}, {"id": "art", "name": "四川美术馆", "en": "", "file": "intro-6.png", "x": 25, "y": 45, "w": 6, "h": 8}, {"id": "library", "name": "四川省图书馆", "en": "", "file": "intro-5.png", "x": 30, "y": 46, "w": 6, "h": 8}, {"id": "theatre", "name": "四川大剧院", "en": "", "file": "intro-10.png", "x": 43, "y": 46, "w": 7, "h": 9}, {"id": "museum", "name": "成都博物馆", "en": "", "file": "intro-2.png", "x": 29, "y": 54, "w": 8, "h": 8}, {"id": "square", "name": "天府广场", "en": "", "file": "intro-3.png", "x": 36, "y": 51, "w": 7, "h": 11}, {"id": "park", "name": "人民公园", "en": "", "file": "intro-8.png", "x": 19, "y": 58, "w": 7, "h": 13}, {"id": "citang", "name": "祠堂街", "en": "", "file": "intro-9.png", "x": 22, "y": 50, "w": 5, "h": 10}, {"id": "tianfuhong", "name": "天府红", "en": "", "file": "intro-4.png", "x": 38, "y": 60, "w": 5, "h": 7}, {"id": "cosmo", "name": "COSMO 成都", "en": "", "file": "intro-11.png", "x": 47, "y": 72, "w": 9, "h": 7}, {"id": "ifs", "name": "成都 IFS", "en": "", "file": "intro-13.png", "x": 65, "y": 61, "w": 7, "h": 11}, {"id": "taikoo", "name": "成都太古里", "en": "", "file": "intro-13.png", "x": 70, "y": 75, "w": 13, "h": 14}, {"id": "canopy", "name": "嘉悦里", "en": "", "file": "intro-1.png", "x": 30, "y": 61, "w": 7, "h": 12}, {"id": "opera", "name": "四川省川剧院", "en": "", "file": "intro-12.png", "x": 44, "y": 79, "w": 8, "h": 9}, {"id": "chunxi", "name": "春熙路", "en": "", "file": "intro-13.png", "x": 54, "y": 52, "w": 8, "h": 19}, {"id": "kuanzhai", "name": "宽窄巷子", "en": "", "file": "intro-14.png", "x": 15, "y": 30, "w": 8, "h": 15}, {"id": "wangping", "name": "望平街", "en": "", "file": "intro-15.png", "x": 87, "y": 64, "w": 8, "h": 11}, {"id": "panda", "name": "成都大熊猫繁育研究基地", "en": "", "file": "intro-16.png", "x": 88, "y": 11, "w": 14, "h": 20}, {"id": "religion", "name": "周边宗教场所", "en": "Nearby religious landmarks", "file": "宗教场所.png", "directoryOnly": false, "x": 13, "y": 84, "w": 19, "h": 27}, {"id": "food", "name": "周边美食", "en": "Nearby dining", "file": null, "directoryOnly": false, "x": 65, "y": 19, "w": 15, "h": 27}, {"id": "monthly", "name": "本月活动", "en": "What’s on this month", "file": "每月活动.png", "directoryOnly": true, "hideDirectory": true}];
const stage=document.getElementById('map-stage');
const list=document.getElementById('place-list');
const mapPage=document.getElementById('map-page');
const detail=document.getElementById('detail');
const detailImage=document.getElementById('detail-image');
const detailTitle=document.getElementById('detail-title');
const detailTitleEn=document.getElementById('detail-title-en');
const mapOnly=document.getElementById('map-only');
const detailScroll=document.getElementById('detail-scroll');
const zoomToggle=document.getElementById('zoom-toggle');
const readingTip=document.getElementById('reading-tip');
const mapViewport=document.getElementById('map-viewport');
const byId=Object.fromEntries(places.map(place=>[place.id,place]));
const imagePath=file=>'assets/'+encodeURIComponent(file);
let mapScroll=0;

for(const place of places){
  const spot=document.createElement('button');
  spot.type='button';
  spot.className='spot'+(place.pin?' spot--pin':'');
  spot.setAttribute('aria-label',`查看 ${place.name} ${place.en}`);
  spot.title=`${place.name} · ${place.en}`;
  spot.style.left=`${place.x}%`;
  spot.style.top=`${place.y}%`;
  spot.style.width=`${place.w}%`;
  spot.style.height=`${place.h}%`;
  spot.addEventListener('click',()=>openPlace(place.id));
  if(!place.directoryOnly) stage.appendChild(spot);
  const item=document.createElement('button');
  item.type='button';
  item.className='place';
  item.innerHTML='<span class="place-zh"></span><span class="place-en" lang="en"></span>';
  item.querySelector('.place-zh').textContent=place.name;
  item.querySelector('.place-en').textContent=place.en;
  item.addEventListener('click',()=>openPlace(place.id));
  if(!place.hideDirectory) list.appendChild(item);
}

function render(){
  const id=decodeURIComponent(location.hash.slice(1));
  const place=byId[id];
  mapPage.hidden=Boolean(place);
  detail.hidden=!place;
  if(place){
    detailTitle.textContent=place.name;
    detailTitleEn.textContent=place.en;
    detailScroll.hidden=!place.file;
    zoomToggle.hidden=!place.file;
    readingTip.hidden=!place.file;
    mapOnly.hidden=Boolean(place.file);
    document.getElementById("detail-extras").replaceChildren();
    if(place.file){
      detailImage.src=imagePath(place.file);
      detailImage.alt=`${place.name} ${place.en} 活动内页`;
      setImageFit(true);
      renderExtras(place.id);
    }else detailImage.removeAttribute('src');
    document.title=`${place.name} ${place.en} | Discover Chengdu 悦见鲜活邻里`;
    window.scrollTo(0,0);
    requestAnimationFrame(()=>window.scrollTo(0,0));
  }else{
    detailImage.removeAttribute('src');
    document.title='Discover Chengdu 悦见鲜活邻里';
    if(id!=='map') requestAnimationFrame(()=>window.scrollTo(0,mapScroll));
  }
}
function openPlace(id){mapScroll=window.scrollY;location.hash=id;}
function backToMap(){location.hash='';}
function setImageFit(fit){
  detailScroll.classList.toggle('is-fit',fit);
  zoomToggle.setAttribute('aria-pressed',String(fit));
  zoomToggle.innerHTML=fit?'放大阅读 <span lang="en">Zoom to read</span>':'查看全页 <span lang="en">Fit page</span>';
  detailScroll.scrollLeft=0;
}
document.getElementById('back').addEventListener('click',backToMap);
document.getElementById('back-secondary').addEventListener('click',backToMap);
document.getElementById('preview-open').addEventListener('click',()=>openPlace('canopy'));
zoomToggle.addEventListener('click',()=>setImageFit(!detailScroll.classList.contains('is-fit')));
window.addEventListener('hashchange',render);

render();

function renderExtras(id){
 const groups={museum:[['窑火中的艺术匠心',70,568]],cosmo:[['BTS 快闪',600,960],['米菲城市巡展',990,1555]],park:[['金秋菊事活动',1590,2010]]};
 const box=document.getElementById('detail-extras');box.replaceChildren();
 if(id==='canopy'){const im=document.createElement('img');im.src=imagePath('intro-0.png');im.alt='嘉悦里英文简介';im.className='extra-intro';box.append(im);}
 for(const [title,start,end] of groups[id]||[]){
 const section=document.createElement('section');section.className='monthly-event';
 const h=document.createElement('h2');h.textContent='本月活动 · '+title;section.append(h);
 const crop=document.createElement('div');crop.className='event-crop';crop.style.aspectRatio=`750 / ${(end-start)*5430/2048}`;
 const im=document.createElement('img');im.src=imagePath('每月活动.png');im.alt=title+'：活动日期、简介及海报（来自提供的每月活动页）';im.style.top='0';im.style.transform=`translateY(${-start/2048*100}%)`;crop.append(im);section.append(crop);box.append(section);
 }
}
document.getElementById('monthly-open').addEventListener('click',()=>openPlace('monthly'));
let mapScale=1;const pointers=new Map();let drag=null,moved=false;
function scaleMap(value,cx=mapViewport.clientWidth/2,cy=mapViewport.clientHeight/2){
 const old=stage.offsetWidth;mapScale=Math.max(1,Math.min(4,value));const base=mapViewport.clientWidth;
 const nx=(mapViewport.scrollLeft+cx)/old,ny=(mapViewport.scrollTop+cy)/old;
 stage.style.width=base*mapScale+'px';mapViewport.scrollLeft=nx*stage.offsetWidth-cx;mapViewport.scrollTop=ny*stage.offsetWidth-cy;
}
document.getElementById('zoom-in').onclick=()=>scaleMap(mapScale*1.4);
document.getElementById('zoom-out').onclick=()=>scaleMap(mapScale/1.4);
document.getElementById('map-reset').onclick=()=>{scaleMap(1);mapViewport.scrollTo(0,0);};
// Native mobile scrolling leaves vertical page navigation available.
if(!matchMedia('(max-width:760px)').matches){
 let start=null;
 mapViewport.addEventListener('pointerdown',e=>{start={x:e.clientX,y:e.clientY,l:mapViewport.scrollLeft,t:mapViewport.scrollTop};moved=false;});
 mapViewport.addEventListener('pointermove',e=>{if(!start||!e.buttons)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>6){moved=true;mapViewport.scrollLeft=start.l-dx;mapViewport.scrollTop=start.t-dy;}});
 window.addEventListener('pointerup',()=>{start=null;});
 mapViewport.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false;}},true);
}
function sizeMobileMap(){if(innerWidth<=760){stage.style.width='1000px';mapViewport.scrollLeft=stage.offsetWidth*.34-mapViewport.clientWidth/2;}}
requestAnimationFrame(sizeMobileMap);
window.addEventListener('resize',sizeMobileMap);
