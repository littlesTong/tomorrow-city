// Animated, data-driven SVG game board. One district footprint = one land unit.
const colors={forest:'#70a779',farmland:'#d4ba72',residential:'#cfccc0',industry:'#9aa7ac',energy:'#a5b6ac',water:'#72bace',vacant:'#c1cba8'};
const labels={forest:'森林',farmland:'农田',residential:'住宅',industry:'工厂',energy:'能源',water:'水域',vacant:'空地'};
function building(h,industrial=false){return `<path d="M-13 0V${-h}L1 ${-h-7}L14 ${-h}V0L0 7Z" fill="${industrial?'#a78670':'#eee9d9'}"/><path d="M1 ${-h-7}L14 ${-h}V0L0 7V${-h}" fill="${industrial?'#796b61':'#a2b9be'}"/>${Array.from({length:Math.floor(h/10)},(_,i)=>`<path d="M-9 ${-h+5+i*10}h5v4h-5Z M4 ${-h+4+i*10}h5v4H4Z" fill="#ffda83" class="city-window"/>`).join('')}`;}
function tree(x,y,size=1){return `<g transform="translate(${x} ${y}) scale(${size})"><g class="city-tree"><path d="M0 2v-16" stroke="#725744" stroke-width="3"/><path d="M0-32L-10-14H-5L-12-5H12L5-14H10Z" fill="#326b49"/><path d="M0-32V-5H12L5-14H10Z" fill="#48865a"/></g></g>`;}
export function cityScene(state,operational){
 const density=state.population/Math.max(1,operational.residential*7000),smoke=Math.min(.85,.12+state.airPollution/130),waterHue=198-state.waterPollution*.95;
 let index=0;
 const tiles=Object.entries(state.land).flatMap(([kind,count])=>Array.from({length:count},(_,i)=>{
 const at=index++,col=at%10,row=Math.floor(at/10),x=320+(col-row)*28,y=90+(col+row)*14,buildingNow=i>=operational[kind];
 let art='';
 if(buildingNow)art='<path d="M-11 0v-32h24M4-32v-9M-11-22h24M10-32v20" stroke="#d49d3b" stroke-width="3" fill="none"/><path class="crane-load" d="M7-12h6v6H7Z" fill="#9f8b66"/>';
 else if(kind==='forest')art=tree(-10,2,.65)+tree(7,-4,.8)+tree(0,8,.7);
 else if(kind==='residential')art=building(24+Math.floor(Math.min(1.5,density)*16)+(i%3)*7);
 else if(kind==='industry')art=building(16,true)+`<path d="M-9-19v-20h5v20M6-18v-27h5v27" fill="#795c52"/><g opacity="${smoke}"><g class="factory-smoke"><circle cx="-7" cy="-43" r="5"/><circle cx="9" cy="-49" r="6"/></g></g>`;
 else if(kind==='energy')art=i<Math.round(count*state.fossil)?'<path d="M-12 0L0-24L12 0M-8-7H8M-6-13H6" stroke="#5b6570" stroke-width="3" fill="none"/><g class="pump-arm"><path d="M-16-23L13-28v7M-4-25v-9" stroke="#d5984f" stroke-width="4"/></g>':'<path d="M0 3v-38" stroke="#f7fbf5" stroke-width="3"/><g transform="translate(0 -38)"><g class="city-rotor"><path d="M0 0L-2-20L3-17ZM0 0L18 8L14 11ZM0 0L-16 12L-17 7Z" fill="#f7fbf5"/></g></g>';
 else if(kind==='water')art='<g class="water-ripple"><path d="M-17 0l8-4m0 9l12-6m2 4l10-5" stroke="#d2ecdd" stroke-width="2"/></g>';
 else if(kind==='farmland')art='<path d="M-17 0L0-8M-10 4L7-4M-3 8L14 0" stroke="#a08742" stroke-width="2"/><path d="M-7-2v-7m10 9v-7" stroke="#618154" stroke-width="3"/>';
 const fill=kind==='water'?`hsl(${waterHue} 35% 56%)`:colors[kind];
 return `<g class="district ${kind}" data-land="${kind}" role="button" tabindex="0" aria-label="${labels[kind]}，${buildingNow?'施工中':'已建成'}" transform="translate(${x} ${y})" style="--delay:${-at*.37}s"><title>${labels[kind]} · ${buildingNow?'施工中':'点击查看'}</title><path d="M-27 0L0-14L27 0L0 14Z" fill="${fill}" stroke="#ffffff35"/><path d="M-27 0v5L0 19L27 5V0L0 14Z" fill="#00000012"/>${art}</g>`;
 })).join('');
 return `<svg class="city-world" viewBox="0 0 640 410" role="group" aria-label="动态城市：森林、住宅高楼、工厂、能源和水域"><defs><linearGradient id="city-sky" x2="0" y2="1"><stop stop-color="#d8e9e1"/><stop offset="1" stop-color="#b6d5d8"/></linearGradient></defs><rect width="640" height="410" rx="18" fill="url(#city-sky)"/><ellipse cx="320" cy="344" rx="248" ry="48" fill="#315653" opacity=".12"/><g class="city-cloud"><path d="M60 52q8-17 24-7q12-15 29 1q18 0 18 13H60Z" fill="#fff" opacity=".5"/></g>${tiles}<path d="M50 365Q320 320 590 365" fill="none" stroke="#ecf9ef" stroke-width="2" opacity=".5"/></svg>`;
}
