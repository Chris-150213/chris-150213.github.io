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

## 文件与来源

- `index.html`：页面内容、下载入口、FAQ 与元数据。
- `styles.css` / `app.js`：响应式布局与交互。
- `assets/icon.ico` / `assets/icon.png`：用户提供的 BCCL 应用图标，保持原始文件。
- `assets/world.svg`：为本站制作的方块山水矢量插画。
- `scripts/`：无依赖的预览和静态检查工具。

网站代码沿用本仓库 MIT 许可。应用图标、软件品牌及相关第三方内容归各自权利人所有，不因网站代码许可而重新授权。BCCL、PCL、PCL-CE、MCTier 与 Minecraft 的署名和许可说明见页面及对应项目仓库。本站不包含游戏授权，也不改变启动器及内置组件的原有许可。
