# DATE A LIVE 精灵档案与互动网页

一个围绕《约会大作战 / デート・ア・ライブ》制作的多页面静态网页项目，整合了精灵档案、剧情总览和互动小游戏。  
它的目标不是只做资料堆叠，而是把角色设定、视觉氛围和轻交互体验放进同一个可浏览的小站里。

## 在线预览地址（重要重要！！）

示例格式：

```text
https://your-name.github.io/your-repo-name/
```

## 网页特点🐱

- 多页面静态站点结构，包含首页、精灵档案、角色详情、剧情总览和小游戏区
- 支持简体中文、英文、日文三语切换
- 支持白天 / 黑夜主题切换
- 精灵档案与角色详情页可联动展示角色设定、形态、关系和资料内容
- 剧情总览页可集中查看主线与外传信息
- 提供三个互动玩法：
  - 命运选择器
  - 天使试炼
  - 翻牌图鉴 / 精灵图鉴
- 结果弹窗、规则弹窗、角色页和小游戏界面都做了统一视觉风格和主题适配
- 适合直接部署到 GitHub Pages、Netlify、Vercel 等静态平台

## 技术使用

- HTML5
- CSS3
- 原生 JavaScript

## 打开方式

这是一个纯静态项目，不需要额外构建。你可以用下面两种方式运行：

### 方式一：直接打开

下载项目后，直接打开根目录下的 `index.html` 即可浏览。  

不过为了避免部分浏览器对本地资源路径的限制，更推荐使用静态服务器方式。

### 方式二：使用本地静态服务器

如果你的电脑已经安装了 Node.js，可以在项目根目录运行：

```bash
npx serve .
```

或者：

```bash
npx http-server .
```

启动后，访问终端里提供的本地地址即可。

## 项目结构

```text
DATEALIVE/
├─ index.html
├─ archive.html
├─ character.html
├─ timeline.html
├─ games.html
├─ game.html
├─ story.html
├─ assets/
│  ├─ app.css
│  ├─ app.js
│  ├─ characters.js
│  ├─ characters/
│  ├─ character-bg/
│  ├─ angel-bg/
│  ├─ game-art/
│  ├─ module-bg/
│  └─ bgm/
└─ docs/
   └─ screenshots/
```

## 碎碎念

本人只是一个笨笨大学生，设计不到位的地方望多多包涵喵！🐱
