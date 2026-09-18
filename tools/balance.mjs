// Difficulty check: how long do different player types survive? node tools/balance.mjs
import {newGame,advance,canEnact,POLICIES,TUNING} from '../dist/engine.js';
for(const [k,v] of Object.entries(process.env))if(k.startsWith('T_'))TUNING[k.slice(2)]=+v;
const ids=POLICIES.map(p=>p.id);
const H=+process.env.H||6, SEEDS=+process.env.SEEDS||12;
function run(pick,seed,max=300){let s=newGame(seed);while(!s.finished&&s.year<max){let id=pick(s);if(id&&!canEnact(s,id))id=null;s=advance(s,id);}return s;}
function score(s){let t=s;for(let i=0;i<H&&!t.finished;i++)t=advance(t,null);return (t.finished?-1e6+t.year*1e3:0)+t.population/1000-Math.max(0,t.hotStreak)*20-(t.last?.temperature||0)*8+Math.min(t.budget,300)/20;}
const smart=s=>{let best=null,bs=score(s);for(const id of ids){if(!canEnact(s,id))continue;const v=score(advance(s,id));if(v>bs+0.5){bs=v;best=id;}}return best;};
let r=1;const rand=()=>{r=(r*16807)%2147483647;return r/2147483647};
const random=s=>rand()<.3?null:ids[Math.floor(rand()*ids.length)];
const stat=(name,pick,seeds=SEEDS)=>{const o=[];for(let seed=1;seed<=seeds;seed++){const s=run(pick,seed);o.push(s)}const y=o.map(s=>s.year).sort((a,b)=>a-b);console.log(name.padEnd(8),'median',y[y.length>>1],'range',y[0],'-',y.at(-1),'ends',JSON.stringify(o.reduce((m,s)=>(m[s.endReason]=(m[s.endReason]||0)+1,m),{})),'finalBudget~',Math.round(o[0].budget),'pop',o[0].population);return y[y.length>>1];};
console.log(JSON.stringify(TUNING));
stat('nothing',()=>null);stat('random',random);if(+process.env.SMART)stat('smart',smart,+process.env.SMART);
const planner=s=>{const t=s.last?.temperature||30;const order=['renewable','training','carbon','trees','renewable','clinic','ac','treatment','filters','water','housing'];
 if(s.waterStock<35&&canEnact(s,'water'))return 'water';
 if(s.last&&s.population>s.land.residential*s.size*.065&&canEnact(s,'housing'))return 'housing';
 for(const id of order){if(id==='carbon'&&s.counts.training<1)continue;if(canEnact(s,id))return id;}
 return t>33?'hours':null;};
stat('planner',planner);
import {LEVELS} from '../dist/engine.js';
console.log('--- levels: planner vs nothing (goal in parens)');
for(const L of LEVELS){
 const runL=(pick,seed)=>{let s=newGame(seed,L.id);while(!s.finished&&s.year<400){let id=pick(s);if(id&&!canEnact(s,id))id=null;s=advance(s,id);}return s;};
 const y=p=>{const o=[];for(let seed=1;seed<=8;seed++)o.push(runL(p,seed).year);o.sort((a,b)=>a-b);return o[4];};
 console.log(L.id.padEnd(12),'goal',String(L.goal).padStart(3),'| nothing',y(()=>null),'| planner',y(planner));
}
