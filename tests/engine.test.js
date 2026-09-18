import test from 'node:test';
import assert from 'node:assert/strict';
import {startingBudget,limitTemp,canSupply,supply,revive,policyCost,TUNING,newGame,advance,metrics,shocks,baseline,comparison,outcome,restoreGame,preview,effectiveLand,canEnact} from '../dist/engine.js';
export const route=[null, "renewable", "renewable", "industry", null, "trees", null, "clinic", "housing", "carbon", "housing", null, "carbon", "water", "water", "water", "training", "housing", null, null, "training", null, null, "ac", null, "training", "carbon", "clinic", null, "trees"];
const play=(actions,seed=1)=>actions.reduce((s,id)=>advance(s,id&&canEnact(s,id)?id:null),newGame(seed));
test('30 years is a milestone, not an ending',()=>{const s=play(route);assert.equal(s.year,30);assert.equal(s.finished,false);assert.equal(advance(s,null).year,31);console.log(JSON.stringify({budget:s.budget,jobs:s.last.employment,...comparison(s)}));});
test('Minor shocks every third year, major every tenth; durations and overlap',()=>{for(let n=0;n<30;n++){const e=shocks(1,n);assert.equal(e.filter(e=>e.scale==='small').length,(n+1)%3===0?1:0);assert.equal(e.filter(e=>e.scale==='large'&&e.at===n).length,(n+1)%10===0?1:0);}assert.equal(shocks(1,29).length,2);assert.ok(shocks(1,11).some(e=>e.scale==='large'));assert.ok(!shocks(1,12).some(e=>e.scale==='large'));});
test('Both helpful and harmful shocks are possible and independent of decisions',()=>{const ids=new Set();for(let seed=0;seed<100;seed++)for(let n=0;n<30;n++)shocks(seed,n).forEach(e=>ids.add(e.id));assert.equal(ids.size,12);const s=play(route.slice(0,12));assert.deepEqual(s.history.map(r=>r.events),baseline(s.seed).slice(0,12).map(r=>r.events));});
test('Annual mortality integrates seasonal heat; adaptation protects, cooling uses electricity',()=>{const s=newGame(1),m=metrics(s,0);assert.ok(m.mortality>0);assert.ok(metrics({...s,health:65},0).mortality<m.mortality);assert.ok(metrics({...s,ac:1,protection:20},0).emissions>m.emissions);});
test('Delayed policies activate at the stated year and temporary effects expire',()=>{let s=play(['renewable',null]);const f=newGame(1).fossil;assert.equal(s.fossil,f);s=advance(s,null);assert.ok(Math.abs(s.fossil-(f-.15))<1e-9);const a=advance(newGame(1),'hours'),b=advance(newGame(1),null);assert.ok(a.last.mortality<b.last.mortality);assert.equal(metrics(a,1).employment,metrics(b,1).employment);});
test('Preview and save replay keep shocks fixed; old saves rejected',()=>{const s=play(route.slice(0,10)),copy=structuredClone(s);preview(s,null);assert.deepEqual(s,copy);assert.deepEqual(restoreGame({version:8,seed:s.seed,actions:s.actions}),s);assert.throws(()=>restoreGame({version:2,actions:[]}));assert.throws(()=>restoreGame({version:8,seed:-1,actions:[]}));});
test('Fiscal shock occurs once per active year; no persistent job or heat mutation',()=>{let s=play([null,null]);const before=structuredClone(s),m=metrics(s,2,false,true),next=advance(s,null);assert.equal(next.budget,Math.round((s.budget+m.income-m.expenditure+m.shockCash)*10)/10);assert.equal(next.baseJobs,before.baseJobs);assert.equal(next.heatIsland,before.heatIsland);assert.equal(metrics(next,3).events.length,0);});
test('Future shocks are not disclosed by initial metrics or policy preview',()=>{const s=play([null,null]);assert.equal(metrics(s,2).events.length,0);assert.equal(preview(s,null).next.last.events.length,0);assert.equal(advance(s,null).last.events.length,1);const later=play(Array(10).fill(null));assert.ok(metrics(later,10).events.some(e=>e.at===9));});
test('Land is conserved and construction only adds capacity after completion',()=>{let s=advance(newGame(1),'housing');assert.equal(Object.values(s.land).reduce((a,b)=>a+b,0),100);assert.equal(s.land.vacant,10);assert.equal(effectiveLand(s,0).residential,16);s=advance(s,null);assert.equal(effectiveLand(s,1).residential,18);assert.equal(canEnact({...s,land:{...s.land,vacant:0}},'industry'),false);const closed=advance(s,'carbon');assert.equal(closed.land.vacant,s.land.vacant+2);});
test('Population balance and heat deaths use population, not a fixed 100k',()=>{const s=newGame(1),a=advance(s,null),m=a.last;assert.equal(a.population,Math.round(s.population+m.births-m.ordinaryDeaths-m.heatDeaths-m.coldDeaths-m.pollutionDeaths+m.migration));const doubled=metrics({...s,population:200000},0);assert.equal(doubled.heatDeaths,Math.round(doubled.mortality*2*10)/10);});
test('No-action world keeps warming; industry adds local heat and cumulative CO2',()=>{const s=newGame(1);assert.ok(metrics(s,29).backgroundWarming>metrics(s,0).backgroundWarming);assert.ok(metrics(s,29).temperature>metrics(s,0).temperature);let industrial=advance(advance(s,'industry'),null),idle=advance(advance(s,null),null);assert.ok(industrial.localCO2>idle.localCO2);assert.ok(industrial.heatIsland>idle.heatIsland);assert.ok(industrial.waterStock<idle.waterStock);assert.ok(industrial.minerals<idle.minerals);});
test('Resources and land remain bounded throughout the reference campaign',()=>{const s=play(route);for(const r of s.history){assert.ok(r.waterStock>=0&&r.waterStock<=100);assert.ok(r.minerals>=0&&r.minerals<=100);assert.equal(Object.values(r.land).reduce((a,b)=>a+b,0),100);assert.ok(Object.values(r.land).every(v=>v>=0));}});
test('Unlimited continuation reaches climate collapse and supports long saves and baselines',()=>{let s=newGame(7);while(!s.finished&&s.year<500)s=advance(s,null);assert.ok(s.year>30&&s.year<80,'no-action city should fall well before a century');assert.ok(s.finished);assert.ok(['climate','both','population'].includes(s.endReason));assert.throws(()=>advance(s,null));assert.equal(baseline(s.seed,s.year).length,s.year);assert.deepEqual(restoreGame({version:8,seed:s.seed,actions:s.actions}),s);console.log('No-action city:',s.year,s.endReason,s.population);});
test('Heat needs three consecutive years and cooling resets the counter',()=>{let s={...newGame(1),heatIsland:8};s=advance(s,null);assert.equal(s.finished,false);assert.equal(s.hotStreak,1);const cooled=advance({...s,heatIsland:0},null);assert.equal(cooled.hotStreak,0);s=advance(advance(s,null),null);assert.equal(s.endReason,'climate');});
test('Population is a separate terminal condition; deficit and unemployment alone are not',()=>{assert.equal(advance({...newGame(1),population:Math.round(newGame(1).size*.15)},null).endReason,'population');const s=advance({...newGame(1),budget:-100,baseJobs:60},null);assert.equal(s.finished,false);assert.equal(canEnact(s,'hours'),true);const a=metrics({...newGame(1),budget:-1000},0),b=metrics(newGame(1),0);assert.ok(a.employment<b.employment);assert.ok(a.migration<b.migration);});
test('Recurring emergency policy remains available after 30 uses',()=>{const s={...newGame(1),counts:{...newGame(1).counts,hours:45}};assert.equal(canEnact(s,'hours'),true);});

test('Policies get pricier with each use, so money stays meaningful',()=>{let s=newGame(1);const first=policyCost(s,'training');s=advance(s,'training');assert.ok(policyCost(s,'training')>first);assert.ok(s.budget<advance(newGame(1),null).budget,'enacting costs money compared with waiting');});
test('Supply is once per year, adds resources and replays from the save',()=>{let s=advance(newGame(3),null);const before=s.budget;s=supply(s);assert.equal(s.budget,Math.round((before+TUNING.supply.budget)*10)/10);assert.equal(canSupply(s),false);assert.throws(()=>supply(s));s=advance(s,null);assert.equal(canSupply(s),true);assert.deepEqual(restoreGame({version:8,seed:s.seed,actions:s.actions}),s);});
test('Revive only after collapse; restores population, cools, and is flagged in the save',()=>{let s=newGame(7);assert.throws(()=>revive(s));while(!s.finished)s=advance(s,null);const dead=s;s=revive(s);assert.equal(s.finished,false);assert.equal(s.hotStreak,0);assert.ok(s.population>=TUNING.revive.population);assert.equal(s.revives,1);assert.ok(s.heatIsland<dead.heatIsland);s=advance(s,null);assert.deepEqual(restoreGame({version:8,seed:s.seed,actions:s.actions}),s);});
import {offeredPolicies,score,OFFER_SIZE} from '../dist/engine.js';
test('Six offered policies per year, stable on reload, varying across years',()=>{const s=newGame(5),a=offeredPolicies(s);assert.equal(a.length,OFFER_SIZE);assert.equal(new Set(a).size,OFFER_SIZE);assert.deepEqual(offeredPolicies(structuredClone(s)),a);const years=new Set(Array.from({length:8},(_,y)=>offeredPolicies(s,y).join()));assert.ok(years.size>1);assert.ok(a.every(id=>canEnact(s,id)));});
test('Score rises with survival and penalises revives',()=>{let s=newGame(2);const s0=score(s).total;s=advance(advance(s,null),null);assert.ok(score(s).total>s0);assert.ok(score({...s,revives:1}).total<score(s).total);});
import {LEVELS,levelOf,collapsePopulation} from '../dist/engine.js';
test('Five cities scale from 1,000 to millions and each carries its own start',()=>{
 assert.equal(LEVELS.length,5);assert.deepEqual(LEVELS.map(l=>l.id),['newark','charlotte','chicago','losangeles','newyork']);
 let prevSize=0,prevGoal=0;
 for(const L of LEVELS){const s=newGame(1,L.id);assert.equal(s.population,L.size);assert.equal(s.budget,L.budget);assert.equal(s.goal,L.goal);assert.ok(L.size>prevSize);assert.ok(L.goal>prevGoal);prevSize=L.size;prevGoal=L.goal;
  assert.equal(collapsePopulation(s),Math.round(L.size*.2));assert.equal(Object.values(s.land).reduce((a,b)=>a+b,0),100);}
 assert.equal(levelOf('nope').id,'chicago');
});
test('A city is won by reaching its goal year without collapsing, and keeps playing',()=>{
 let s=newGame(1,'newark');while(!s.finished&&s.year<40)s=advance(s,'hours');
 assert.equal(s.won,s.year>=s.goal&&!s.finished);
 if(s.won){const on=advance(s,null);assert.equal(on.finished,false);assert.equal(on.won,true);}
 assert.deepEqual(restoreGame({version:8,level:'newark',seed:s.seed,actions:s.actions}),s);
 assert.throws(()=>restoreGame({version:8,level:'atlantis',seed:1,actions:[]}));
});
test('Same relative pressure at every size: income and housing scale with the city',()=>{
 const small=advance(newGame(1,'newark'),null),big=advance(newGame(1,'newyork'),null);
 assert.ok(Math.abs(small.last.income-big.last.income)<25);
 assert.ok(small.last.population>500&&big.last.population>50000);
});

test('Cold cities pay in winter and the treasury follows the city, not a fixed number',()=>{
 const chicago=advance(newGame(1,'chicago'),null),la=advance(newGame(1,'losangeles'),null);
 assert.ok(chicago.last.coldMortality>chicago.last.mortality,'Chicago should lose more people to cold than to heat at the start');
 assert.equal(la.last.coldMortality,0,'Los Angeles never gets cold enough');
 assert.ok(levelOf('chicago').budget>levelOf('losangeles').budget,'heavy industry funds a bigger treasury');
 for(const L of LEVELS)assert.equal(L.budget,startingBudget(L));
 assert.ok(limitTemp(newGame(1,'chicago'))<limitTemp(newGame(1,'losangeles')),'each city has its own heat line');
 const dirty=newGame(1,'charlotte'),clean=newGame(1,'newark');
 assert.ok(dirty.airPollution>clean.airPollution*3&&clean.land.forest>dirty.land.forest);
});
