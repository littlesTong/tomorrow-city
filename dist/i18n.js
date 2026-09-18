// Player-facing strings. The editor view (?editor) stays Chinese.
const KEY='tomorrow-city.lang';
export const EDITOR=new URLSearchParams(location.search).has('editor');
export let lang=null;
try{lang=localStorage.getItem(KEY);}catch{}
if(EDITOR)lang='zh';
export const hasLang=()=>lang==='zh'||lang==='en';
export function setLang(l){lang=l;try{localStorage.setItem(KEY,l);}catch{}document.documentElement.lang=l==='en'?'en':'zh-CN';}
const D={
 brand:['明日城市','Tomorrow City'],help:['怎么玩','How to play'],
 tabCity:['城市','City'],tabPolicy:['政策','Policies'],tabReport:['报告','Report'],
 policyEyebrow:['年度政策','This year'],decide:['这年，如何取舍？','What will you fund this year?'],
 collapsedTitle:['你的城市，留下了什么？','What did your city leave behind?'],
 pick:['先选择一项政策','Pick a policy first'],enact:['执行政策 · 推进一年','Enact · next year'],viewReport:['查看城市报告','See city report'],
 wait:['维持现状 · 推进一年','Do nothing · next year'],
 supply:['紧急补给','Emergency supply'],supplied:['本年已补给','Supplied this year'],fund:['财政','Budget'],water:['淡水','Water'],minerals:['矿产','Minerals'],
 coin:['币','coins'],
 limit:['已达上限','Limit reached'],noMoney:['资金不足','Not enough money'],noLand:['空地不足','No free land'],noIndustry:['无可退役工业','No industry left'],
 score:['总分','Score'],survived:['存续 {n} 年','{n} years survived'],revived:['复活 {n} 次','revived {n}×'],
 population:['人口','Population'],budget:['财政','Budget'],employment:['就业率','Employment'],emissions:['碳排','Emissions'],temperature:['日最高温','Daily high'],mortality:['高温死亡率','Heat deaths'],per100k:['/10万','/100k'],people:['人',''],
 coldMortality:['低温死亡率','Cold deaths'],limitLine:['高温线 {n}°C','Heat line {n}°C'],
 land_forest:['森林','Forest'],land_farmland:['农田','Farmland'],land_residential:['住宅','Housing'],land_industry:['工业','Industry'],land_energy:['能源','Energy'],land_water:['水域','Water'],land_vacant:['空地','Open land'],
 landScale:['全市 {a} 平方公里 · 每格 {t} 平方公里','{a} km² in all · {t} km² per tile'],
 trendTitle:['变化，不只看这一年','How the city has changed'],yourPath:['━ 你的政策路径','━ Your policies'],noPolicy:['┄ 不出台新政策','┄ If you did nothing'],
 chartEmpty:['推进一年后，这里会出现曲线。','Play one year to see the curves.'],
 settled:['{y} 年已结算','{y} settled'],reportReady:['城市报告已生成','City report ready'],
 cityPop:['人口 {n}','Pop. {n}'],
 revivedToast:['城市已复活','City revived'],suppliedToast:['紧急补给已到达','Supplies arrived'],test:['测试','Test'],testNote:['当前为测试模式，不会扣款。','Test mode: nothing is charged.'],
 news:['世界新闻','World news'],newsLarge:['重大事件 · 持续 {n} 年','Major event · lasts {n} years'],newsSmall:['外部事件 · 本年','World event · this year'],close:['关闭','Close'],
 fx_jobs:['就业','Jobs'],fx_cash:['财政','Budget'],fx_emissions:['碳排','Emissions'],fx_heat:['气温','Heat'],fx_water:['淡水','Water'],fx_minerals:['矿产','Minerals'],
 endClimate:['连续三年越过这座城市的高温线，气候失控。','Three years above this city\'s heat line: the climate got out of control.'],
 endPopulation:['人口跌破生存线，城市无法维持。','Population fell below the survival line: the city could not go on.'],
 endBoth:['持续高温与人口崩塌同时发生。','Extreme heat and population collapse at once.'],
 heldTo:['这座城市，坚持到了 {y} 年。','Your city lasted until {y}.'],
 remaining:['剩余人口','People left'],reviveBtn:['复活城市 · 从 {y} 年继续','Revive · continue from {y}'],
 reviveNote:['人口回升至至少 {p}，降温 {c}°C，但气候仍在变暖。','Population back to at least {p}, {c}°C cooler, but warming continues.'],
 retry:['重试同一世界','Retry the same world'],history:['回看城市','Look back at the city'],
 restartTitle:['重新开始？','Start over?'],restartCopy:['当前进度会被替换，从 2026 年重新开始。','Your progress will be replaced; you start again in 2026.'],restart:['重新开始','Start over'],keep:['继续当前城市','Keep playing'],
 helpTitle:['带这座城市走到目标年份','Get this city to its goal year'],
 help1:['每年从 6 项政策里选一项，或维持现状。政策越用越贵。达成目标年份即通关，解锁下一座城市。','Each year, pick one of 6 policies or do nothing. Policies get pricier with each use. Reach the goal year to clear the city and unlock the next one.'],
 help2:['世界会不时发生冲击：经济危机、能源危机、热浪，也有技术突破。','The world throws shocks at you: recessions, energy crises, heatwaves, and sometimes breakthroughs.'],
 help3:['年均日最高温连续 3 年越过这座城市的高温线，或人口跌到起始人口的 20%，城市崩塌。寒冷的城市高温线更低，但冬天会冻死人。','A city collapses after 3 years above its own heat line, or once population falls to 20% of where it started. Colder cities have a lower heat line — but their winters kill.'],
 help4:['减排能延缓升温，但会影响就业；医疗和空调能救人，但要花钱。','Cutting emissions slows warming but costs jobs; clinics and air-con save lives but cost money.'],
 helpNote:['所有数值都是虚构的游戏规则，不是真实预测。','All numbers are fictional game rules, not real-world forecasts.'],
 start:['开始','Start'],chooseLang:['选择语言','Choose your language'],
 levels:['关卡','Levels'],levelPick:['选择城市','Choose your city'],locked:['先通关上一关','Clear the previous city first'],cleared:['已通关','Cleared'],best:['最好成绩 {n}','Best {n}'],goalYears:['目标：撑过 {n} 年','Goal: last {n} years'],pop:['人口 {n}','Pop. {n}'],
 wonTitle:['{city} 过关！','{city} cleared!'],wonCopy:['你撑过了 {n} 年，城市还在运转。可以继续经营，也可以去下一座城市。','You lasted {n} years and the city is still running. Keep going, or move to the next city.'],keepGoing:['继续经营这座城市','Keep playing this city'],nextCity:['下一关 · {city}','Next city · {city}'],allCleared:['五座城市全部通关。','All five cities cleared.'],
 goalLine:['{city} · 目标 {n} 年','{city} · goal {n} years'],
 busy:['上一笔购买仍在处理中。','A purchase is still in progress.'],cancelled:['购买已取消。','Purchase cancelled.'],failed:['购买未完成，请稍后再试。','Purchase failed. Please try again.'],
};
export function t(key,vars={}){const v=D[key];let s=v?v[lang==='en'?1:0]:key;for(const [k,x] of Object.entries(vars))s=s.replaceAll(`{${k}}`,x);return s;}
export const POLICY_EN={industry:'Attract industry',carbon:'Retire dirty plants',renewable:'Clean power',training:'Green job training',trees:'Urban greening',ac:'Air-con subsidy',clinic:'Expand clinics',hours:'Heat work limits',housing:'Housing & services',water:'Water recycling',filters:'Factory air filters',treatment:'Water treatment'};
export const EVENT_EN={
 depression:'A collapse in demand and finance drags the economy into a long slump.',
 war:'A war abroad disrupts shipping and supply chains and pushes refugees your way.',
 rebuild:'International aid money flows in to rebuild production.',
 oil:'An oil supply shock drives up energy costs for every factory.',
 volcano:'A huge eruption cools the planet briefly, without undoing long-term warming.',
 trade:'New trade rules open foreign markets to your exports.',
 finance:'Credit dries up and financial turmoil hits the real economy.',
 solar:'Solar and wind get much cheaper, making clean power pay off.',
 tariff:'Tariffs and trade uncertainty hit exports and investment.',
 pandemic:'A pandemic shuts down production and demand worldwide.',
 grain:'A war abroad raises food and energy prices; newcomers strain housing.',
 heatwave:'An extreme regional heatwave strains hospitals; cooling and clinics soften the blow.',
};
export const policyName=p=>lang==='en'?POLICY_EN[p.id]||p.name:p.name;
export const eventName=e=>lang==='en'?e.english:e.name;
export const eventSummary=e=>lang==='en'?EVENT_EN[e.id]||e.english:e.summary;
