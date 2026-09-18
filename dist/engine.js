import {HISTORICAL_EVENTS} from "./events.js";
// Fictional policy simulation: parameters are game rules, not empirical estimates.
export const COLLAPSE={temperature:35,hotYears:3,populationShare:.2};
// Five cities, small to huge. Every level scales to its own size; difficulty comes from
// money per resident, heat, fossil share, health capacity and how many years you must last.
export const LEVELS=[
 {id:'newark',name:'纽瓦克',english:'Newark',area:6,size:1000,tempOffset:-2,fossil:.72,heatIsland:.3,health:30,revenue:0,waterStock:88,minerals:100,airPollution:8,waterPollution:6,baseJobs:90,baseEmissions:66,goal:40,climate:2.5,
  land:{forest:36,farmland:21,residential:13,industry:9,energy:3,water:9,vacant:9},blurb:['一千人的小镇：森林多、污染低、工业少，财政也小。','A thousand people: deep forest, clean air, little industry — and a small budget.']},
 {id:'charlotte',name:'夏洛特',english:'Charlotte',area:25,size:5000,tempOffset:1,fossil:.78,heatIsland:.8,health:26,revenue:1,waterStock:74,minerals:98,airPollution:34,waterPollution:26,baseJobs:88,baseEmissions:75,goal:50,climate:1.8,
  land:{forest:27,farmland:19,residential:16,industry:11,energy:4,water:7,vacant:16},blurb:['五千人，工厂先于治理到来：空气和水的污染起点很高。','Five thousand people. The factories arrived before the cleanup: air and water start dirty.']},
 {id:'chicago',name:'芝加哥',english:'Chicago',area:60,size:10000,tempOffset:-6,fossil:.85,heatIsland:.7,health:25,revenue:6,waterStock:82,minerals:100,airPollution:24,waterPollution:16,baseJobs:89,baseEmissions:95,goal:60,climate:1,
  land:{forest:24,farmland:18,residential:16,industry:16,energy:5,water:9,vacant:12},blurb:['一万人的重工业城，税收充沛，但冬天冻死人。','Ten thousand people, heavy industry and a full treasury — and winters that kill.']},
 {id:'losangeles',name:'洛杉矶',english:'Los Angeles',area:300,size:30000,tempOffset:3,fossil:.8,heatIsland:2.2,health:24,revenue:3,waterStock:48,minerals:92,airPollution:40,waterPollution:20,baseJobs:86,baseEmissions:90,goal:65,climate:0.4,
  land:{forest:20,farmland:13,residential:23,industry:12,energy:5,water:5,vacant:22},blurb:['三万人，缺水、高温、雾霾，热季来得早也走得晚。','Thirty thousand people, short on water, long on heat and smog.']},
 {id:'newyork',name:'纽约',english:'New York',area:800,size:100000,tempOffset:-3,fossil:.85,heatIsland:1.5,health:26,revenue:4,waterStock:70,minerals:90,airPollution:30,waterPollution:24,baseJobs:85,baseEmissions:105,goal:80,climate:0.6,
  land:{forest:14,farmland:9,residential:29,industry:13,energy:5,water:9,vacant:21},blurb:['十万人挤在一起，冬冷夏热，绿地最少，负担最重。','A hundred thousand packed together: cold winters, hot summers, almost no green space.']},
];
// The treasury is not hand-set: industry and payroll fund it, pollution and heat drain it.
export function startingBudget(L){return Math.round(110+L.land.industry*6+L.revenue*6+(L.baseJobs-85)*7-(L.airPollution+L.waterPollution)*.5-L.heatIsland*12);}
for(const L of LEVELS){L.budget=startingBudget(L);L.limitTemp=COLLAPSE.temperature+L.tempOffset;}
// Each city has its own danger line: about 5°C above the summer it was built for.
export const limitTemp=s=>s.limitTemp??COLLAPSE.temperature;

export const levelOf=id=>LEVELS.find(l=>l.id===id)||LEVELS[2];
export const collapsePopulation=s=>Math.round(s.size*COLLAPSE.populationShare);
// Difficulty knobs (game rules, tuned by simulation in tests/balance.mjs).
export const TUNING={backgroundWarming:.025,emissionWarming:.0007,costGrowth:.2,protectionDecay:.04,healthDecay:.02,heatRisk:1.4,coldRisk:1.2,coldThreshold:22,forestSink:.4,emissionDrift:1.5,supply:{budget:80,water:25,minerals:25},revive:{population:50000,cooling:1,budget:100}};
export const POLICIES=[
{id:'industry',icon:'shop',name:'工业招商',cost:40,limit:8,tag:'就业优先',summary:'岗位增加，排放也增加',description:'本年投入 40 币；次年工厂投产：就业基础 +3 个百分点、产业收入 +3；工业生产、用电和燃料开采分别产生排放，同时加重本地热岛效应。',delay:1,tradeoff:'就业 ↑ · 碳排 ↑',effects:{jobs:3,revenue:3,heatIsland:.12}},
{id:'carbon',icon:'cloud',name:'淘汰高排放产能',cost:12,limit:6,tag:'产业转型',summary:'立刻减排，岗位先承压',description:'本年投入 12 币，退役工厂减少工业生产、用电及污染；就业基础最多 −2 个百分点。已完成的转岗培训可减轻失业冲击；4 年后部分岗位恢复。',delay:0,tradeoff:'碳排 ↓ · 就业先降',effects:{}},
{id:'renewable',icon:'sun',name:'清洁电力投资',cost:58,limit:6,tag:'长期减排',summary:'先投入，2 年后见效',description:'本年投入 58 币、创造施工岗位 +0.6 个百分点。2 年后清洁能源投产、就业基础 +1，降低化石电力占比；每年运维 +2 币。',delay:2,tradeoff:'支出 ↑ · 延迟减排',effects:{jobs:1,fossil:-.15,upkeep:2}},
{id:'training',icon:'bus',name:'绿色转岗培训',cost:30,limit:6,tag:'就业保障',summary:'当年稳就业，转型少失业',description:'本年投入 30 币。当年就业基础 +2.5 个百分点，并减轻之后淘汰产能造成的失业冲击。',delay:0,tradeoff:'支出 ↑ · 当年就业 ↑',effects:{jobs:2.5,skills:1}},
{id:'trees',icon:'tree',name:'城市绿化降温',cost:38,limit:10,tag:'本地适应',summary:'4 年后缓解热岛',description:'本年投入 38 币。4 年后本地气温降低 0.15°C、就业基础 +0.5，新增森林形成碳汇；每年维护 +1 币。降温数值为游戏设定。',delay:4,tradeoff:'支出 ↑ · 延迟降温',effects:{cooling:.15,jobs:.5,upkeep:1}},
{id:'ac',icon:'wind',name:'居民空调补贴',cost:25,limit:4,tag:'热健康',summary:'降低热风险，用电增加',description:'本年投入 25 币，热防护提高 20 点；此后每年补贴 +4 币。空调用电增加排放，清洁电力越多，新增排放越少。',delay:0,tradeoff:'热死亡风险 ↓ · 用电 ↑',effects:{protection:20,ac:1,upkeep:4}},
{id:'clinic',icon:'shield',name:'基层医疗扩容',cost:45,limit:4,tag:'公共卫生',summary:'救治更及时，支出持续',description:'本年投入 45 币。2 年后医疗能力 +20，就业基础 +1；此后每年服务支出 +4 币，缓解高温健康损失。',delay:2,tradeoff:'健康 ↑ · 经常支出 ↑',effects:{health:20,jobs:1,upkeep:4}},
{id:'hours',icon:'help',name:'高温户外限工',cost:0,limit:Infinity,tag:'当年应急',summary:'当年降风险，牺牲产出',description:'仅本年生效：热暴露伤害降低 35%，就业率 −1.5 个百分点、排放 −2、财政收入 −4 币。次年自动解除。',delay:0,tradeoff:'热死亡风险 ↓ · 就业 ↓',effects:{}},
{id:'housing',icon:'shop',name:'住宅与公共服务',cost:32,limit:10,tag:'人口承载',summary:'扩充住房，增加公共支出',description:'投入 32 币、占用 2 格空地，次年新增 1.4 万人住房容量和就业 +0.5；年度运维 +2 币，热岛 +0.03°C。',delay:1,tradeoff:'住房 ↑ · 用地与支出 ↑',effects:{jobs:.5,upkeep:2,heatIsland:.03}},
{id:'water',icon:'water',name:'节水与循环利用',cost:28,limit:6,tag:'资源韧性',summary:'减少用水和矿产消耗',description:'投入 28 币，次年起每年增加 2 点节水能力和 0.4 点材料回收能力；年度运维 +1 币。',delay:1,tradeoff:'资源压力 ↓ · 支出 ↑',effects:{waterSaving:2,recycling:.4,upkeep:1}},
{id:'filters',icon:'wind',name:'工业废气治理',cost:35,limit:6,tag:'空气健康',summary:'减少空气污染，不等于减少 CO₂',description:'次年新增 1 级废气治理，降低工业空气污染负荷；年度运维 +2 币。碳排放与空气污染分开计算。',delay:1,tradeoff:'空气改善 · 支出 ↑',effects:{filters:1,upkeep:2}},
{id:'treatment',icon:'water',name:'污水与饮水净化',cost:36,limit:6,tag:'水环境健康',summary:'削减污水污染与饮水暴露',description:'次年新增 1 级水处理，降低水污染积累及居民接触污染水的风险；年度运维 +2 币。处理设施也消耗电力。',delay:1,tradeoff:'水质改善 · 能耗与支出 ↑',effects:{treatment:1,upkeep:2}},
];
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export const round=v=>Math.round(v*10)/10;
export const dateLabel=n=>`${2026+n} 年`;
// A fixed seed is replayable; new campaigns draw a seed once, never on preview/load.
export const SHOCKS=HISTORICAL_EVENTS;
export function shocks(seed,n){const result=[];for(let at=Math.max(0,n-2);at<=n;at++)for(const [scale,interval,salt] of [['small',3,17],['large',10,43]]){if((at+1)%interval)continue;const pool=SHOCKS.filter(e=>e.scale===scale);const roll=((seed+(at+1)*1103515245+salt*12345)%2147483647)%pool.length;const e=pool[roll];if(n<at+e.years)result.push({...e,at,remaining:at+e.years-n});}return result;}
function weather(n,m,offset=0){return [22,23,27,31,34,36,38,37,34,30,26,23][m]+offset+n*TUNING.backgroundWarming+((n*17+3)%7-3)*.15;}
export function newGame(seed=Math.floor(Math.random()*2147483647),levelID='chicago'){const L=levelOf(levelID);return {version:8,level:L.id,size:L.size,goal:L.goal,won:false,revives:0,supplies:0,lastSupplyYear:-1,seed,year:0,population:L.size,land:{...L.land},airPollution:L.airPollution,waterPollution:L.waterPollution,populationHealth:85,filters:0,treatment:0,cumulativePollutionDeaths:0,waterStock:L.waterStock,minerals:L.minerals,waterSaving:0,recycling:0,localCO2:0,budget:L.budget,baseJobs:L.baseJobs,baseEmissions:L.baseEmissions,fossil:L.fossil,heatIsland:L.heatIsland,cooling:0,climate:L.climate||1,bg:L.bg??1,tempOffset:L.tempOffset||0,limitTemp:L.limitTemp,health:L.health,protection:0,ac:0,skills:0,upkeep:0,revenue:L.revenue,counts:Object.fromEntries(POLICIES.map(p=>[p.id,0])),queue:[],actions:[],history:[],cumulativeEmissions:0,cumulativeDeaths:0,last:null,finished:false,hotStreak:0,endReason:null,journal:'持续经营开始，没有固定结束年份。每年执行一项政策；每 3 年有小冲击，每 10 年有大冲击，有利有弊。'};}
export function metrics(s,n=s.year,limited=false,revealNew=false,policyID=null){
 const events=shocks(s.seed,n).filter(e=>revealNew||e.at<n),sum=k=>events.reduce((v,e)=>v+e[k],0);
 const land=effectiveLand(s,n),ratio=s.population/s.size;
 const demand=32*ratio+land.industry*2+s.ac*6+s.treatment*1.5;
 const industrial=land.industry*3.2*(s.baseEmissions/80),housingCarbon=ratio*10+land.residential*.3;
 const extraction=demand*s.fossil*.12,services=ratio*8;
 const construction=(LAND_COST[policyID]||0)*2,forestSink=land.forest*TUNING.forestSink;
 let power=0,renewables=0;
 const airLoad=(land.industry*1.3+demand*s.fossil*.15)/(1+s.filters*.6);
 const waterLoad=land.industry*.7+ratio*3+extraction*.3;
 const airPollution=round(clamp(s.airPollution*.78+airLoad-land.forest*.06,0,100));
 const waterPollution=round(clamp(s.waterPollution*.9+waterLoad-s.treatment*5-land.water*.12,0,100));
 const waterExposure=round(waterPollution*(1+land.water/40+Math.max(0,40-s.waterStock)/80)/(1+s.treatment*.5));
 const populationHealth=round(clamp(s.populationHealth+(s.health/25)-airPollution*.025-waterExposure*.03,10,100));
 const pollutionMortality=round(3*(airPollution*.4+waterExposure*.6)*(1+(100-populationHealth)/100)*(1-s.health/150));
 const pollutionDeaths=round(pollutionMortality*s.population/100000);
 let totals={temperature:0,employment:0,emissions:0,mortality:0,cold:0};
 for(let m=0;m<12;m++){
 const t=weather(n,m,s.tempOffset||0)*1+(n*TUNING.backgroundWarming*((s.bg??1)-1))+s.heatIsland-s.cooling+s.cumulativeEmissions*TUNING.emissionWarming*(s.climate||1)+events.reduce((v,e)=>v+(e.heat>0&&(m<4||m>8)?0:e.heat),0);
 const jobs=clamp(s.baseJobs+sum('jobs')-Math.min(3,Math.max(0,-s.budget)/100)-Math.max(0,25-s.waterStock)*.08-Math.max(0,15-s.minerals)*.08-Math.max(0,t-33)*.18-(limited?1.5:0),0,100);
 totals.temperature+=t;totals.employment+=jobs;
 const heatDemand=Math.max(0,t-28)*.6;power+=(demand+heatDemand)*s.fossil*.7;renewables+=(demand+heatDemand)*(1-s.fossil)*.06;
 totals.mortality+=Math.max(0,t-30)**1.8*TUNING.heatRisk*(1+(100-populationHealth)/100)*(1-s.health/150)*(1-s.protection/120)*(limited?.65:1)*(1+Math.max(0,88-jobs)*.02);
 // Cold kills too: heating, housing and clinics reduce it, and warming slowly erases it.
 totals.cold+=Math.max(0,TUNING.coldThreshold-t)**1.5*TUNING.coldRisk*(1+(100-populationHealth)/100)*(1-s.health/150)*(1+Math.max(0,88-jobs)*.02)/(1+land.residential*.02+s.ac*.15);
 }
 const temperature=round(totals.temperature/12),employment=round(totals.employment/12),emissions=round(Math.max(0,industrial+housingCarbon+extraction+services+construction+power/12+renewables/12-forestSink+sum('emissions')-(limited?2:0))),mortality=round(totals.mortality),coldMortality=round(totals.cold);
 const income=Math.round((18+(employment-80)*1.7+s.revenue-(limited?4:0))*ratio),expenditure=round(12*ratio+s.upkeep);
 const heatDeaths=round(mortality*s.population/100000),coldDeaths=round(coldMortality*s.population/100000),births=Math.round(s.population*.011),ordinaryDeaths=Math.round(s.population*.008);
 const housing=effectiveLand(s,n).residential*s.size*.07,foodCapacity=s.land.farmland*s.size*.06;
 const migrationRate=clamp((employment-85)*.0008-Math.max(0,temperature-31)*.002+sum('migration')-Math.min(.02,Math.max(0,-s.budget)/10000),-.04,.02);
 const migration=Math.round(s.population*migrationRate*2-Math.max(0,s.population-housing)*.2-Math.max(0,s.population-foodCapacity)*.05);
 const population=Math.max(1,Math.round(s.population+births-ordinaryDeaths-heatDeaths-coldDeaths-pollutionDeaths+migration));
 return {temperature,employment,emissions,mortality,airPollution,waterPollution,waterExposure,populationHealth,pollutionMortality,pollutionDeaths,totalMortality:round((ordinaryDeaths+heatDeaths+coldDeaths+pollutionDeaths)/s.population*100000),carbonLedger:{industrial:round(industrial),housing:round(housingCarbon),extraction:round(extraction),services:round(services),construction:round(construction),fossilPower:round(power/12),cleanLifecycle:round(renewables/12),forestSink:round(-forestSink),external:round(sum('emissions')-(limited?2:0))},population,births,ordinaryDeaths,heatDeaths,coldMortality,coldDeaths,migration,backgroundWarming:round(n*TUNING.backgroundWarming*(s.bg??1)*100)/100,localWarming:round(s.cumulativeEmissions*TUNING.emissionWarming*(s.climate||1)*100)/100,heatIsland:round(s.heatIsland-s.cooling),weatherAnomaly:round(((n*17+3)%7-3)*.15+events.reduce((v,e)=>v+(e.heat>0?e.heat*5/12:e.heat),0)),income,expenditure,shockCash:sum('cash'),events,heatwave:sum('heat')>0,health:round(s.health),protection:round(s.protection)};
}

function apply(s,e){const map={jobs:'baseJobs',emissions:'baseEmissions'};for(const [key,val] of Object.entries(e))s[map[key]||key]+=val;s.baseJobs=clamp(s.baseJobs,0,99);s.baseEmissions=Math.max(0,s.baseEmissions);s.fossil=clamp(s.fossil,.1,.95);s.health=clamp(s.health,0,95);s.protection=clamp(s.protection,0,80);}
export function policyCost(s,id){const p=POLICIES.find(p=>p.id===id);return p?Math.round(p.cost*(1+TUNING.costGrowth*(s.counts?.[id]||0))):0;}
export const LAND_COST={industry:3,renewable:2,trees:2,housing:2};
const LAND_TYPE={industry:'industry',renewable:'energy',trees:'forest',housing:'residential'};
export function effectiveLand(s,n=s.year){const land={...s.land};for(const q of s.queue)if(q.at>n&&LAND_TYPE[q.policy])land[LAND_TYPE[q.policy]]-=LAND_COST[q.policy];return land;}
export function canEnact(s,id){const p=POLICIES.find(p=>p.id===id);return !!p&&!s.finished&&(p.cost===0||s.budget>=policyCost(s,id))&&s.counts[id]<p.limit&&s.land.vacant>=(LAND_COST[id]||0)&&(id!=='carbon'||s.land.industry>=2);}
export function advance(s,id,{revealNew=true}={}){
 if(s.finished)throw new Error('城市已无法继续维持。');
 if(id!==null&&!canEnact(s,id))throw new Error('政策不可用：请检查预算、空地或实施上限。');
 const next=structuredClone(s),n=s.year,activated=[];
 const due=next.queue.filter(q=>q.at<=n);next.queue=next.queue.filter(q=>q.at>n);
 for(const q of due){apply(next,q.effects);activated.push(q.name);}
 const p=POLICIES.find(p=>p.id===id);
 if(p){next.budget-=policyCost(s,id);next.counts[id]++;
  if(LAND_COST[id]){next.land.vacant-=LAND_COST[id];next.land[LAND_TYPE[id]]+=LAND_COST[id];}
  if(id==='carbon'){next.land.industry-=2;next.land.vacant+=2;}
  if(id==='carbon'){apply(next,{jobs:-Math.max(.5,2-next.skills*.6)});next.queue.push({at:n+4,name:'转型岗位逐步恢复',effects:{jobs:1}});}
  if(id==='renewable')apply(next,{jobs:.6});
  if(p.delay)next.queue.push({at:n+p.delay,name:p.name,policy:id,effects:{...p.effects}});else apply(next,p.effects);
 }
 const m=metrics(next,n,id==='hours',revealNew,id);
 next.budget=round(next.budget+m.income-m.expenditure+m.shockCash);next.cumulativeDeaths=round(next.cumulativeDeaths+m.heatDeaths+m.coldDeaths);next.cumulativeEmissions=round(next.cumulativeEmissions+m.emissions);
 next.population=m.population;next.airPollution=m.airPollution;next.waterPollution=m.waterPollution;next.populationHealth=m.populationHealth;next.cumulativePollutionDeaths=round(next.cumulativePollutionDeaths+m.pollutionDeaths);
 const operational=effectiveLand(next,n);
 next.waterStock=round(clamp(next.waterStock+5+next.waterSaving-operational.industry*.25-ratioOf(next)*2-Math.max(0,m.temperature-30)*.3+m.events.reduce((v,e)=>v+e.water,0),0,100));
 next.minerals=round(clamp(next.minerals-operational.industry*.12+next.recycling+m.events.reduce((v,e)=>v+e.minerals,0),0,100));
 next.localCO2+=m.emissions*.00001; // 1 index = 0.01 Mt CO2 = 0.00001 Gt (fictional city scale).
 next.last={...m,land:{...next.land},waterStock:next.waterStock,minerals:next.minerals,year:n,policy:id,budget:next.budget,activated};next.history.push(next.last);next.actions.push(id);next.year++;
 next.baseEmissions+=TUNING.emissionDrift;if(!next.finished&&next.year>=next.goal)next.won=true;next.protection=round(next.protection*(1-TUNING.protectionDecay));next.health=round(next.health*(1-TUNING.healthDecay));
 next.hotStreak=m.temperature>=limitTemp(next)?s.hotStreak+1:0;
 next.endReason=next.hotStreak>=COLLAPSE.hotYears&&next.population<=collapsePopulation(next)?'both':next.hotStreak>=COLLAPSE.hotYears?'climate':next.population<=collapsePopulation(next)?'population':null;
 next.finished=next.endReason!==null;
 next.journal=`${dateLabel(n)}：${p?`执行「${p.name}」`:'暂不出台新政策'}。${activated.length?`${activated.join('、')}本年生效。`:''}${m.events.length?'外生冲击：'+m.events.map(e=>e.name+'（剩余 '+e.remaining+' 年）').join('、')+'；年度财政外部变化 '+m.shockCash+' 币。':'本年无外生冲击。'}${m.heatwave?'热浪来袭，':''}年均日最高温 ${m.temperature}°C，模拟高温死亡率 ${m.mortality} 人 / 10万人；污染额外死亡 ${m.pollutionDeaths} 人，居民健康 ${m.populationHealth}/100。财政收入 ${m.income}、基本服务及运维支出 ${m.expenditure}${p?`、政策投入 ${policyCost(s,id)}`:''} 币。`;
 return next;
}
const ratioOf=s=>s.population/s.size;
const baselineCache=new Map();
export function baseline(seed=1,years=30,levelID='chicago'){const key=seed+'/'+levelID;let s=baselineCache.get(key)||newGame(seed,levelID);while(s.year<years){s.finished=false;s=advance(s,null);}baselineCache.set(key,s);return structuredClone(s.history.slice(0,years));}
export function comparison(s){const base=baseline(s.seed,s.year,s.level),deaths=round(base.reduce((a,b)=>a+b.heatDeaths,0)),emissions=round(base.reduce((a,b)=>a+b.emissions,0));return {baselineDeaths:deaths,baselineEmissions:emissions,avoidedDeaths:round(deaths-s.cumulativeDeaths),emissionsReduction:emissions?round((1-s.cumulativeEmissions/emissions)*100):0};}
export function outcome(s){return {finished:s.finished,endReason:s.endReason,yearsSurvived:s.year,...comparison(s)};}
export function restoreGame(save){if(save?.version!==8||(save.level&&!LEVELS.some(l=>l.id===save.level))||!Number.isInteger(save.seed)||save.seed<0||save.seed>=2147483647||!Array.isArray(save.actions))throw new Error('无效存档');let s=newGame(save.seed,save.level);for(const id of save.actions){if(id!==null&&typeof id!=='string')throw new Error('无效政策');s=id==='@revive'?revive(s):id==='@supply'?supply(s):advance(s,id);}return s;}
export function preview(s,id){const proposed=advance(s,id,{revealNew:false}),wait=advance(s,null,{revealNew:false});return {next:proposed,relative:{employment:round(proposed.last.employment-wait.last.employment),emissions:round(proposed.last.emissions-wait.last.emissions),mortality:round(proposed.last.mortality-wait.last.mortality),budget:round(proposed.budget-wait.budget)}};}

// Paid continues. Both are recorded in actions so a save replays exactly; scores flag assisted runs.
export function canSupply(s){return !s.finished&&s.lastSupplyYear!==s.year;}
export function supply(s){if(!canSupply(s))throw new Error('本年已补给，或城市已崩塌。');const next=structuredClone(s),t=TUNING.supply;next.budget=round(next.budget+t.budget);next.waterStock=round(clamp(next.waterStock+t.water,0,100));next.minerals=round(clamp(next.minerals+t.minerals,0,100));next.supplies++;next.lastSupplyYear=next.year;next.actions.push('@supply');next.journal=`${dateLabel(next.year)}：紧急补给到达，财政 +${t.budget}，淡水 +${t.water}，矿产 +${t.minerals}。`;return next;}
export function revive(s){if(!s.finished)throw new Error('城市仍在运转，无需复活。');const next=structuredClone(s),t=TUNING.revive;next.finished=false;next.endReason=null;next.hotStreak=0;next.population=Math.max(next.population,t.population);next.heatIsland=round(next.heatIsland-t.cooling);next.budget=Math.max(next.budget,t.budget);next.revives++;next.actions.push('@revive');next.journal=`${dateLabel(next.year)}：城市重建。人口回升至 ${next.population.toLocaleString('zh-CN')}，紧急降温 −${t.cooling}°C。气候仍在变暖，旧问题没有消失。`;return next;}

// Player app: each year offers 6 policies, fixed by seed+year (reloading never rerolls).
export const OFFER_SIZE=6;
export function offeredPolicies(s,year=s.year){
 const rank=id=>{let h=(s.seed^Math.imul(year+1,2654435761))>>>0;for(const ch of id)h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return h;};
 const ordered=[...POLICIES].sort((a,b)=>rank(a.id)-rank(b.id));
 const open=ordered.filter(p=>canEnact(s,p.id)),closed=ordered.filter(p=>!canEnact(s,p.id));
 return [...open,...closed].slice(0,OFFER_SIZE).map(p=>p.id);
}
// Total score: survival dominates; cleaner and healthier cities earn more; paid continues cost points.
export function score(s){
 const c=comparison(s);
 const parts={years:s.year*10,population:Math.round(100*s.population/s.size),emissions:Math.round(Math.max(0,c.emissionsReduction)*2),lives:Math.round(Math.max(0,c.avoidedDeaths)/100),revives:-150*(s.revives||0),supplies:-10*(s.supplies||0)};
 return {total:Math.max(0,Object.values(parts).reduce((a,b)=>a+b,0)),parts};
}
