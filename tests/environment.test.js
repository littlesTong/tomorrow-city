import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,metrics,advance,effectiveLand,TUNING} from '../dist/engine.js';
import {cityScene} from '../dist/city-scene.js';
test('Sector ledger reconciles; construction is separate from delayed operations',()=>{
 const s=newGame(1),built=advance(s,'industry'),idle=advance(s,null);
 assert.equal(built.last.carbonLedger.industrial,idle.last.carbonLedger.industrial);
 assert.equal(built.last.carbonLedger.construction,6);
 const done=advance(built,null);assert.ok(done.last.carbonLedger.industrial>idle.last.carbonLedger.industrial);
 assert.equal(done.last.carbonLedger.construction,0);
 assert.ok(Math.abs(Object.values(done.last.carbonLedger).reduce((a,b)=>a+b,0)-done.last.emissions)<.5);
 assert.ok(metrics({...s,fossil:.1}).carbonLedger.cleanLifecycle>0);
});
test('Pollution reduces health and increases mortality; treatment and filters act separately',()=>{
 const s=newGame(1),dirty={...s,airPollution:90,waterPollution:90},m=metrics(dirty),clean=metrics(s);
 assert.ok(m.populationHealth<clean.populationHealth);assert.ok(m.pollutionDeaths>clean.pollutionDeaths);
 const filtered=metrics({...dirty,filters:3});assert.ok(filtered.airPollution<m.airPollution);assert.equal(filtered.emissions,m.emissions);
 const treated=metrics({...dirty,treatment:3});assert.ok(treated.waterExposure<m.waterExposure);assert.ok(treated.populationHealth>m.populationHealth);
 let built=advance(s,'treatment');assert.equal(built.treatment,0);built=advance(built,null);assert.equal(built.treatment,1);
});
test('Animated districts follow land and show construction',()=>{
 const s=advance(newGame(1),'housing'),svg=cityScene(s,effectiveLand(s,0));
 assert.equal((svg.match(/class="district /g)||[]).length,100);
 for(const marker of ['city-tree','city-window','factory-smoke','water-ripple','city-rotor','crane-load'])assert.ok(svg.includes(marker));
 assert.equal((svg.match(/data-land="forest"/g)||[]).length,s.land.forest);
});
test('Immediate training and subsidies versus one-year industry and two-year power',()=>{
 const s=newGame(1),trained=advance(s,'training'),subsidy=advance(s,'ac');
 assert.equal(trained.skills,1);assert.equal(trained.baseJobs,s.baseJobs+2.5);assert.equal(trained.queue.length,0);assert.ok(Math.abs(subsidy.protection-20*(1-TUNING.protectionDecay))<.11);
 let industry=advance(s,'industry');assert.equal(industry.baseJobs,s.baseJobs);industry=advance(industry,null);assert.equal(industry.baseJobs,s.baseJobs+3);
 let power=advance(s,'renewable');assert.equal(power.fossil,s.fossil);power=advance(power,null);assert.equal(power.fossil,s.fossil);power=advance(power,null);assert.ok(Math.abs(power.fossil-(s.fossil-.15))<1e-9);
});
