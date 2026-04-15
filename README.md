# macOS Desktop

一个使用 Vue 3 + TypeScript + Vite 构建的仿 macOS 桌面系统 Web 应用。

## How to Run

```bash
# 使用 Docker Compose 构建并运行
docker-compose up --build -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f
```

验证跨平台镜像（ARM64）：
```bash
docker pull --platform linux/arm64 nginx:1.25-alpine
docker pull --platform linux/arm64 node:20-alpine
```

## Services

| 服务名称 | 端口 | 描述 |
|---------|------|------|
| macos-desktop | 8081 | 仿 macOS 桌面前端应用 |

访问地址：http://localhost:8081

## 测试账号

本项目为纯前端应用，无需登录账号。

## 题目内容

用 VUE 写一个仿原生的 MacOS 桌面操作系统，窗口管理使用第三方组件，不要自己写

---

## 功能特性

- 菜单栏 - 顶部固定菜单栏，显示 Apple 图标、应用名称、下拉菜单和系统时间
- Dock 栏 - 底部应用程序坞，支持悬停放大效果和运行状态指示
- 桌面图标 - 可拖拽的桌面图标，支持单击选中和双击打开
- 窗口管理 - 使用 vue-draggable-resizable 实现可拖拽、可缩放的窗口，支持最小化、最大化、关闭操作
- 示例应用 - 包含 Finder（文件浏览器）、System Preferences（系统偏好设置）、Notes（备忘录）三个示例应用
- 毛玻璃效果 - macOS 风格的半透明模糊背景效果

## 技术栈

- Vue 3 (Composition API)
- TypeScript
- Vite
- vue-draggable-resizable（窗口拖拽缩放）

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
src/
├── apps/                    # 示例应用
│   ├── FinderApp.vue        # 文件浏览器
│   ├── SettingsApp.vue      # 系统偏好设置
│   └── NotesApp.vue         # 备忘录
├── components/              # UI 组件
│   ├── AppWindow.vue        # 应用窗口容器
│   ├── Desktop.vue          # 桌面主区域
│   ├── DesktopIcon.vue      # 桌面图标
│   ├── Dock.vue             # 底部程序坞
│   ├── MenuBar.vue          # 顶部菜单栏
│   └── TrafficLightButtons.vue  # 红黄绿窗口按钮
├── stores/                  # 状态管理
│   ├── appStore.ts          # 应用状态
│   └── windowStore.ts       # 窗口状态
├── styles/                  # 全局样式
│   ├── global.css
│   └── variables.css
├── types/                   # TypeScript 类型定义
│   └── index.ts
├── App.vue                  # 根组件
└── main.ts                  # 入口文件
```

## License

MIT
