# 明日城市 · 年度气候政策模拟

没有固定年限，共 12 项政策，每年做一次决策；每 3 年一次小冲击，每 10 年一次大冲击。

## 五关城市（v9）

| 关卡 | 人口 | 目标 | 高温线 | 特点 | 不作为 | 规划型策略 |
| --- | --- | --- | --- | --- | --- | --- |
| 纽瓦克 Newark | 1,000 | 40 年 | 33°C | 森林多、污染低、财政小 | 38 年 | 48 年 |
| 夏洛特 Charlotte | 5,000 | 50 年 | 36°C | 污染起点最高 | 36 年 | 66 年 |
| 芝加哥 Chicago | 10,000 | 60 年 | 29°C | 重工业、财政最充沛、冬季冻死人 | 38 年 | 66 年 |
| 洛杉矶 Los Angeles | 30,000 | 65 年 | 38°C | 缺水、高温、雾霾、钱最紧 | 42 年 | 70 年 |
| 纽约 New York | 100,000 | 80 年 | 32°C | 人口密集、绿地最少、目标最长 | 52 年 | 87 年 |

起始财政不是手填的，而是由城市自己的账本算出来的（`startingBudget`）：工业用地和产业收入提高财政，污染和热岛消耗财政。每座城市有自己的气温基准和高温线（高温线 = 35°C + 气温偏移），寒冷城市还会有低温死亡率，随着变暖逐渐减少。

每关的财政、就业、排放、气温、健康与资源起点都不同，通关上一关才解锁下一关。后面的关卡目标更长、容错更小。所有模型量随城市规模缩放（住房容量、粮食、财政收支、崩塌人口线 = 规模的 20%），难度差异来自起始状态和每关的 `climate` 升温倍数。数据来自 `npm run balance`。

## 难度（v8 起）

- 同一项政策每用一次涨价 20%，财政始终有用处。
- 城市累计排放推高本地气温，减排能直接延长存续。医疗能力和热防护每年折旧，需要持续投入。
- 所有难度参数集中在 `dist/engine.js` 的 `TUNING` 中。

## 付费续玩

- 城市崩塌后可以**复活**：人口回升到至少 5 万，降温 1°C，然后继续游戏。
- 城市运转中可以**紧急补给**，每年一次：财政 +80，淡水 +25，矿产 +25。
- 两者都记录进存档，读档时按原样重放。
- 浏览器里运行是测试模式，不扣钱；在 iOS App 里是真实的 App Store 消耗型内购（`dist/store.js`）。
- 上架与收款的完整步骤：[product/MONETIZATION_GUIDE.md](product/MONETIZATION_GUIDE.md)。

## 运行

```sh
npm run serve        # 浏览器打开 http://localhost:4317
npm test             # 23 项引擎测试
npm run balance      # 难度模拟
```

## iOS（Capacitor）

需要 Mac、Xcode 和 Node.js：

```sh
npm install
npx cap sync ios     # 把 dist/ 复制进 iOS 工程
npx cap open ios     # 在 Xcode 中打开，选模拟器运行
```

发布前需要修改 `capacitor.config.json` 中的 `appId`（`com.example.tomorrowcity` 只是占位），并在 Xcode 的 Signing 中选择你的 Team。

旧的 SwiftUI 原生版本已移到 `legacy-swiftui/`，不再维护。它仍是 v7 规则，和网页引擎不一致。

事件资料见 `research/historical-events.json`，研究与校准边界见 `research/DESIGN_NOTES.md`。所有数值都是游戏规则，不是实证估计。

## 仓库结构

```
dist/        游戏本体（纯静态网页，直接部署即可）
  index.html  页面骨架
  engine.js   规则引擎：关卡、政策、气候、人口、分数
  app.js      界面与交互
  i18n.js     中英文文案
  store.js    内购封装（浏览器=测试模式，iOS=StoreKit 2）
  events.js   12 个历史启发事件
  city-scene.js 动态城市 SVG
  style.css
ios/         Capacitor 生成的 Xcode 工程（npx cap sync ios 后用）
tests/       29 项 node --test 引擎测试
tools/       balance.mjs：难度模拟
research/    事件资料与校准边界
product/     产品方案与上架变现指南
```

## 开发约定

- 规则改动都在 `dist/engine.js` 的 `TUNING` 和 `LEVELS`；改完跑 `npm test` 和 `npm run balance`。
- `dist/app.js` 顶部的 `UNLOCK_ALL = true` 是测试开关：五座城市全部解锁。正式发布前改成 `false`，恢复逐关解锁。
- 网址加 `?editor` 打开完整编辑者视图（全部 12 项政策、碳排分项、健康链、政策日程），玩家视图不显示这些。
- `ios/App/App/public/` 由 `npx cap sync ios` 生成，不提交。
