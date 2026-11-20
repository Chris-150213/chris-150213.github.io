# BCCL 官网

Boat Chris Craft Launcher 的中文官网，发布至 GitHub Pages。网站为原生 HTML、CSS、JavaScript，无第三方前端依赖，无需构建。保留仓库现有 `CNAME` 配置。

## 本地预览

安装 Node.js 后在网站目录运行：

```sh
npm start
```

终端会输出预览地址。静态文件也可直接双击 `index.html` 查看，剪贴板操作需要浏览器安全上下文。

## 检查与发布

```sh
npm run check
```

将网站文件提交到 `main`，GitHub Pages 从仓库根目录发布。页面所有本地资源均使用相对路径，可放在根目录或子目录。无需 `node_modules`，不要将本机路径、账号配置或凭据加入仓库。

## 更新启动器下载

启动器 EXE 作为本仓库 GitHub Release 附件发布，不加入 Git 历史。

1. 在 Releases 中上传新的 Windows x64 EXE。
2. 更新 `index.html` 的三个下载链接、版本号、大小、版本说明链接及 SHA-256（包括复制按钮的 `data-hash`）。
3. 核对可执行文件的版本与 SHA-256 后运行检查。

本页 Alpha 0.2.2 对应文件大小为 249,778,250 字节（238.2 MiB），SHA-256 为 `ee3b699b3c4f88e376ea925e707505d901e813ab247061b717abbe992604fc23`。功能介绍依据所提供的 EXE 元数据及配套源码；功能预览为明确标注的网页界面示意，不是程序截图。未采用草稿更新日志中尚未对应本 EXE 的 0.2.3 版本号。

## 动画与无障碍

背景只有两朵小型 CSS 云朵进行低幅度位移；没有 WebGL、视频背景、Canvas、逐帧 JavaScript 或大型动态模糊。离开首屏或切到后台时暂停背景动画。支持系统减少动态效果偏好，也可在导航栏或页脚关闭动态效果，选择保存在当前浏览器。常见问题使用原生 `details`，功能选项卡支持方向键、Home 和 End，移动导航支持 Escape。

## 官网主题与品牌

Boat 是开发者人名。页面使用方块、几何与工作台意象，取消船只和航行相关的插画与文案。

`themes.js` 提供雾蓝、鼠尾草、丁香、蔷薇、杏桃、青瓷六组柔和配色，每组分别提供浅色、深色，共 12 种官网主题。首次打开跟随系统明暗偏好；手动选择保存在浏览器的 `bccl-theme` 中，并在首页与对比页之间共享。官网主题不修改启动器配置。主题对话框支持 Escape 关闭。

## 优点与启动器对比

优点依据提供的 BCCL Alpha 0.2.2 EXE 实际工作台、下载页、启动设置、个性化界面，以及配套源码核对，包括快捷工作台、内置 MCTier 协作、双来源 Java 下载、可调玻璃效果、完整单文件交付和可恢复的优化选项。未将同条件下未经测量的性能或帧数差异写为事实。

`compare.html` 左侧固定 BCCL，右侧可选 PCL、PCL-CE、HMCL，分为安装与管理、联机与协作、外观体验、适用与取舍四类。`comparison-data.js` 保存文案和资料链接；`compare.js` 负责切换、键盘操作及 URL 状态。BCCL 共保留两条使用限制：当前发布仅 Windows x64；完整包较大且首次需准备缓存。正文与对比页的主操作不依赖远程 API。

对比资料核对于 2026-11-20：

- [BCCL 源码与说明](https://github.com/123ugbu1312u/Boat-Chris-Craft-Launcher)
- [PCL 官方源码](https://github.com/Meloong-Git/PCL)
- [PCL-CE 官方 README](https://github.com/PCL-Community/PCL-CE)，以 README 中的平台信息为准，官网旧平台表可能滞后。
- [PCL-CE 官方联机文档](https://docs.pclc.cc/ce/feature/multiplayer)
- [HMCL 官方 README](https://github.com/HMCL-dev/HMCL)

各启动器有各自适用场景；Scaffolding 跨启动器互联不等于可以直接互通 BCCL 的 MCTier 房间。PCL 的 5.5 MiB 仅为用户提供 EXE 样本大小，不能据此比较完整依赖、内存、速度或稳定性。

## 文件与来源

- `index.html`：页面内容、下载入口、FAQ 与元数据。
- `styles.css` / `app.js`：响应式布局与交互。
- `themes.js`：官网的 12 种主题与偏好记忆。
- `compare.html` / `compare.js` / `comparison-data.js`：分组双栏对比、数据与来源。
- `assets/icon.ico` / `assets/icon.png`：用户提供的 BCCL 应用图标，保持原始文件。
- `assets/world.svg`：为本站制作的方块几何矢量插画，与首页内联图形保持一致。
- `scripts/`：无依赖的预览和静态检查工具。

网站代码沿用本仓库 MIT 许可。应用图标、软件品牌及相关第三方内容归各自权利人所有，不因网站代码许可而重新授权。BCCL、PCL、PCL-CE、MCTier 与 Minecraft 的署名和许可说明见页面及对应项目仓库。本站不包含游戏授权，也不改变启动器及内置组件的原有许可。
