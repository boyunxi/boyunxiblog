<p align="center">
  <img src="src/app/icon.svg" alt="薄云隙" width="80" height="80" />
</p>

<h1 align="center">薄云隙 · Boyunxi Blog</h1>

<p align="center">
  <strong>窥见世界裂隙 · 数字古风档案馆</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-000?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [数据库模型](#数据库模型)
- [API 接口](#api-接口)
- [安全防护](#安全防护)
- [主题系统](#主题系统)
- [组件体系](#组件体系)
- [日志系统](#日志系统)
- [部署指南](#部署指南)
- [开发指南](#开发指南)
- [许可证](#许可证)

---

## 项目简介

**薄云隙** 是一个以「古风水墨」为视觉基调的个人博客系统，融合了东方古典美学与现代 Web 技术。前端采用暗色「云海裂隙」风格，管理后台采用「宣纸墨韵」风格，两者在视觉上形成鲜明对比又和谐统一。

项目基于 Next.js 14 App Router 构建，使用 Server Components 优先策略，搭配 Prisma ORM + SQLite 实现轻量级数据持久化，零外部数据库依赖，开箱即用。

---

## 功能特性

### 前台展示

| 功能 | 说明 |
|------|------|
| 文章展示 | 支持 MDX 渲染、代码高亮（Shiki）、代码块复制按钮 |
| 分类浏览 | 按分类归档文章，支持分类列表和筛选 |
| 标签系统 | 多标签关联文章，支持标签云和筛选 |
| 全文搜索 | 前端实时搜索，搜索结果高亮 |
| 暗色/白昼切换 | 「夜幕」与「白昼」双主题，CSS 变量驱动平滑过渡 |
| 阅读进度条 | 页面顶部金色进度指示 |
| 回到顶部 | 浮动按钮，平滑滚动 |
| 文章分享 | 微博、微信、复制链接等分享方式 |
| 页面访问追踪 | 自动上报页面访问日志 |
| 彩蛋系统 | Logo 点击彩蛋、控制台欢迎语、Konami Code 彩蛋 |

### 管理后台

| 功能 | 说明 |
|------|------|
| 仪表盘 | 文章/分类/标签统计、最近文章、访问趋势 |
| 文章管理 | 新建/编辑/删除文章，MDX 编辑器，封面图，发布控制 |
| 分类管理 | 增删改查，Slug 自动生成 |
| 标签管理 | 增删改查，Slug 自动生成 |
| 站点设置 | 站点名称、描述、SEO、备案号、彩蛋配置等 |
| 系统日志 | 按级别/分类/关键词筛选，支持分页和旧日志清理 |
| 登录锁定 | 密码错误渐进锁定，倒计时提示 |

### 安全防护

| 功能 | 说明 |
|------|------|
| 访问限流 | 基于 IP 的双层滑动窗口限流，超限返回 404 |
| 登录锁定 | 5次→5分钟，10次→25分钟，15次→1小时 |
| 防爬虫 | 拦截 27 种恶意爬虫/攻击工具 UA，空 UA 拦截 |
| 搜索引擎限流 | 对合法搜索引擎施加更严格的限流阈值 |
| API 认证 | 管理类 API 均需 NextAuth JWT 认证 |

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | [Next.js](https://nextjs.org/) (App Router) | 14.2 |
| 语言 | [TypeScript](https://www.typescriptlang.org/) | 5.0+ |
| ORM | [Prisma](https://www.prisma.io/) | 5.22 |
| 数据库 | [SQLite](https://www.sqlite.org/) | 内置 |
| 认证 | [NextAuth.js](https://next-auth.js.org/) | 4.24 |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) | 3.4 |
| 字体 | Noto Serif SC / Noto Sans SC / JetBrains Mono | Google Fonts |
| MDX | [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) | 6.0 |
| 代码高亮 | [Shiki](https://shiki.style/) + [rehype-pretty-code](https://github.com/rehype-pretty/rehype-pretty-code) | 4.0 / 0.14 |
| 密码加密 | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.4 |
| 图标 | [Lucide React](https://lucide.dev/) | 0.453 |
| 校验 | [Zod](https://zod.dev/) | 3.23 |

---

## 项目结构

```
d:\blog
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   ├── seed.ts                # 种子数据（管理员账号 + 站点设置）
│   └── dev.db                 # SQLite 数据库文件（.gitignore）
├── public/
│   └── images/                # 静态图片资源
├── src/
│   ├── app/
│   │   ├── (frontend)/        # 前台页面（Route Group）
│   │   │   ├── layout.tsx     # 前台布局（Header + Footer + 主题 + 彩蛋）
│   │   │   ├── page.tsx       # 首页
│   │   │   ├── about/         # 关于页面
│   │   │   ├── categories/    # 分类列表 / 分类详情
│   │   │   ├── posts/         # 文章详情（[slug]）
│   │   │   ├── search/        # 搜索页面
│   │   │   ├── tags/          # 标签列表 / 标签详情
│   │   │   └── not-found.tsx  # 前台 404
│   │   ├── admin/             # 管理后台页面
│   │   │   ├── layout.tsx     # 后台布局（Sidebar + 认证守卫）
│   │   │   ├── page.tsx       # 后台首页（重定向到 dashboard）
│   │   │   ├── dashboard/     # 仪表盘
│   │   │   ├── posts/         # 文章管理（列表/新建/编辑）
│   │   │   ├── categories/    # 分类管理
│   │   │   ├── tags/          # 标签管理
│   │   │   ├── settings/      # 站点设置
│   │   │   ├── logs/          # 系统日志
│   │   │   ├── login/         # 登录页（含锁定倒计时）
│   │   │   └── not-found.tsx  # 后台 404
│   │   ├── api/               # API 路由
│   │   │   ├── auth/          # NextAuth 认证 + 锁定状态查询
│   │   │   ├── posts/         # 文章 CRUD
│   │   │   ├── categories/    # 分类 CRUD
│   │   │   ├── tags/          # 标签 CRUD
│   │   │   ├── settings/      # 站点设置读写
│   │   │   ├── stats/         # 统计数据
│   │   │   ├── search/        # 全文搜索
│   │   │   ├── logs/          # 日志查询与清理
│   │   │   └── pageview/      # 页面访问上报
│   │   ├── icon.svg           # Favicon（古风水墨风格）
│   │   ├── layout.tsx         # 根布局（字体加载 + 元数据）
│   │   └── not-found.tsx      # 全局 404
│   ├── components/
│   │   ├── frontend/          # 前台业务组件
│   │   │   ├── PostCard.tsx   # 文章卡片（default/compact/hero 变体）
│   │   │   ├── PostList.tsx   # 文章列表（含空状态）
│   │   │   ├── CategoryNav.tsx # 分类导航
│   │   │   └── ShareButtons.tsx # 分享按钮组
│   │   ├── layout/            # 布局组件
│   │   │   ├── Header.tsx     # 前台导航栏（Logo + 菜单 + 主题切换）
│   │   │   ├── Footer.tsx     # 前台页脚（版权 + 备案号）
│   │   │   ├── AdminSidebar.tsx # 后台侧边栏
│   │   │   ├── Providers.tsx  # 全局 Provider（Session + Theme）
│   │   │   └── Sidebar.tsx    # 前台侧边栏
│   │   ├── ui/                # 通用 UI 组件
│   │   │   ├── PageShell.tsx  # 页面外壳（雾气层 + max-w-page）
│   │   │   ├── PageHeader.tsx # 页面标题（rift-line + 副标题）
│   │   │   ├── EmptyState.tsx # 空状态占位
│   │   │   ├── ScrollCard.tsx # 卷轴卡片
│   │   │   ├── InkDivider.tsx # 墨线分隔符
│   │   │   ├── SealTag.tsx    # 印章标签
│   │   │   ├── SearchBar.tsx  # 搜索框
│   │   │   ├── ThemeToggle.tsx # 主题切换按钮
│   │   │   ├── ThemeProvider.tsx # 主题上下文
│   │   │   ├── ReadingProgress.tsx # 阅读进度条
│   │   │   ├── BackToTop.tsx  # 回到顶部
│   │   │   ├── PageViewTracker.tsx # 页面访问追踪器
│   │   │   ├── AdminCard.tsx  # 后台卡片
│   │   │   ├── AdminButton.tsx # 后台按钮（primary/secondary/danger）
│   │   │   ├── AdminInput.tsx # 后台输入框
│   │   │   ├── AdminBadge.tsx # 后台标签
│   │   │   ├── AdminTable.tsx # 后台表格
│   │   │   ├── AdminPageHeader.tsx # 后台页面标题
│   │   │   └── AdminConfirmDialog.tsx # 后台确认弹窗
│   │   └── EasterEggs.tsx     # 彩蛋系统
│   ├── lib/
│   │   ├── prisma.ts          # Prisma 客户端单例
│   │   ├── auth.ts            # NextAuth 配置（含登录锁定守卫）
│   │   ├── logger.ts          # 异步日志工具（写入队列 + 级别过滤）
│   │   ├── with-log.ts        # API 路由日志高阶函数
│   │   ├── login-guard.ts     # 登录渐进锁定（5→5m, 10→25m, 15→1h）
│   │   ├── rate-limit.ts      # IP 滑动窗口限流器
│   │   ├── mdx-renderer.tsx   # MDX 渲染器
│   │   ├── mdx-components.tsx # MDX 自定义组件映射
│   │   ├── code-block.tsx     # 代码块组件（Shiki 高亮 + 复制）
│   │   ├── types.ts           # 全局类型定义
│   │   └── utils.ts           # 工具函数
│   ├── styles/
│   │   └── globals.css        # 全局样式 + CSS 变量（双主题）
│   ├── types/
│   │   └── next-auth.d.ts     # NextAuth 类型扩展
│   └── middleware.ts          # 中间件（限流 + 防爬虫 + 认证守卫）
├── tailwind.config.ts         # Tailwind 主题配置
├── next.config.js             # Next.js 配置
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## 快速开始

### 环境要求

- **Node.js** >= 18.0
- **npm** >= 9.0（或 pnpm / yarn）
- **Git**

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/etoilefixes/boyunxiblog.git
cd boyunxiblog

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env .env.local
# 编辑 .env.local，至少填写 NEXTAUTH_SECRET

# 4. 初始化数据库
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. 启动开发服务器
npm run dev

# 6. 访问
# 前台：http://localhost:3000
# 后台：http://localhost:3000/admin
# 默认账号：admin@blog.com / admin123
```

### 构建生产版本

```bash
npm run build
npm start
```

---

## 环境变量

在项目根目录创建 `.env` 或 `.env.local` 文件：

| 变量名 | 必填 | 说明 | 示例 |
|--------|------|------|------|
| `DATABASE_URL` | 是 | SQLite 数据库连接字符串 | `file:./dev.db` |
| `NEXTAUTH_SECRET` | 是 | NextAuth JWT 签名密钥 | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | 否 | 站点 URL（生产环境必填） | `https://yourdomain.com` |
| `NEXT_PUBLIC_SITE_URL` | 否 | 公开站点 URL | `https://yourdomain.com` |

生成 `NEXTAUTH_SECRET`：

```bash
openssl rand -base64 32
```

---

## 数据库模型

项目使用 Prisma ORM + SQLite，共 7 个模型：

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   User   │     │   Post   │     │ Category │
│──────────│     │──────────│     │──────────│
│ id       │     │ id       │     │ id       │
│ email    │     │ title    │     │ name     │
│ password │     │ slug     │     │ slug     │
│ name     │     │ content  │     └────┬─────┘
│ role     │     │ excerpt  │          │
└──────────┘     │ coverImage│     1:N │
                 │ published │◄────────┘
                 │ views    │
                 └────┬─────┘
                      │
                 N:M  │
            ┌─────────┴──────────┐
            │     PostTag        │
            │────────────────────│
            │ post_id (FK)       │
            │ tag_id  (FK)       │
            └─────────┬──────────┘
                      │
                 N:M  │
            ┌─────────┴──────────┐
            │       Tag          │
            │────────────────────│
            │ id                 │
            │ name               │
            │ slug               │
            └────────────────────┘

┌──────────────┐     ┌──────────────┐
│     Log      │     │  SiteSetting │
│──────────────│     │──────────────│
│ id           │     │ id           │
│ level        │     │ siteName     │
│ category     │     │ siteDescription│
│ action       │     │ heroTitle    │
│ message      │     │ heroSubtitle │
│ meta (JSON)  │     │ seoTitle     │
│ ip           │     │ seoDescription│
│ userId       │     │ aboutContent │
│ createdAt    │     │ easterEgg*   │
└──────────────┘     │ copyrightText│
                     │ icpNumber    │
                     │ policeNumber │
                     └──────────────┘
```

### Log 模型字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `level` | String | 日志级别：`debug` / `info` / `warn` / `error` |
| `category` | String | 分类：`api` / `auth` / `post` / `category` / `tag` / `setting` / `view` / `system` |
| `action` | String | 具体操作，如 `login_success`、`page_view`、`post_created` |
| `message` | String | 人类可读的日志消息 |
| `meta` | String? | JSON 格式的附加数据 |
| `ip` | String? | 请求来源 IP |

---

## API 接口

所有管理类 API 均需要 NextAuth JWT 认证（`Authorization` 或 Cookie）。

### 文章

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/posts` | 获取文章列表（支持分页、分类筛选、搜索） |
| POST | `/api/posts` | 创建文章 |
| GET | `/api/posts/[id]` | 获取单篇文章（含浏览量自增） |
| PUT | `/api/posts/[id]` | 更新文章 |
| DELETE | `/api/posts/[id]` | 删除文章 |

### 分类

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/categories` | 获取分类列表 |
| POST | `/api/categories` | 创建分类 |
| PUT | `/api/categories/[id]` | 更新分类 |
| DELETE | `/api/categories/[id]` | 删除分类 |

### 标签

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/tags` | 获取标签列表 |
| POST | `/api/tags` | 创建标签 |
| PUT | `/api/tags/[id]` | 更新标签 |
| DELETE | `/api/tags/[id]` | 删除标签 |

### 站点设置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/settings` | 获取站点设置 |
| PUT | `/api/settings` | 更新站点设置 |

### 统计

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/stats` | 获取仪表盘统计数据 |

### 搜索

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/search?q=keyword` | 全文搜索文章 |

### 日志

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/logs` | 查询日志（支持 level/category/search/分页） |
| DELETE | `/api/logs?days=30` | 清理指定天数前的旧日志 |

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/signin` | 登录 |
| POST | `/api/auth/signout` | 登出 |
| GET | `/api/auth/session` | 获取当前会话 |
| GET | `/api/auth/lockout-status` | 查询当前 IP 的登录锁定状态 |

### 页面访问

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/pageview` | 上报页面访问（path + referrer） |

---

## 安全防护

### 访问限流

基于 IP 的**双层滑动窗口**计数器，短窗口防突发 + 长窗口防持续：

| 路由类型 | 短窗口 | 长窗口 | 超限行为 |
|---------|--------|--------|---------|
| 页面 | 20次/10秒 | 120次/60秒 | 返回 404 |
| API | 30次/10秒 | 120次/60秒 | 返回 404 |
| 登录端点 | 5次/10秒 | 10次/60秒 | 返回 404 |
| 搜索引擎爬虫 | 5次/10秒 | 20次/60秒 | 返回 404 |

### 登录渐进锁定

| 累计失败次数 | 锁定时长 |
|------------|---------|
| 5 次 | 5 分钟 |
| 10 次 | 25 分钟 |
| 15+ 次 | 1 小时 |

- 登录成功自动重置计数
- 锁定期间登录页显示实时倒计时
- 锁定状态通过 `/api/auth/lockout-status` 查询

### 防爬虫

拦截以下恶意 User-Agent（返回 404）：

- **攻击工具**：sqlmap、nikto、masscan、nmap、dirbuster、gobuster、hydra、burpsuite、wpscan
- **SEO 爬虫**：semrush、ahrefs、mj12bot、dotbot、rogerbot、exabot、blexbot、megaindex、sistrix、spyfu
- **AI 爬虫**：gptbot、chatgpt-user、claudebot、ccbot、bytespider、petalbot、dataforseo
- **空 User-Agent**：直接拦截

放行的合法搜索引擎（施加更严格限流）：

- Googlebot、Bingbot、Slurp (Yahoo)、DuckDuckBot
- Baiduspider、YandexBot
- FacebookExternalHit、TwitterBot、LinkedInBot

---

## 主题系统

项目采用 **CSS 变量驱动**的双主题系统，通过 `data-theme` 属性切换：

### 夜幕主题（默认）

```
背景：#0a0e17（深渊蓝黑）
文字：rgba(255,255,255,0.95)（冷白）
金色：#D4AF37（暗金）
表面：rgba(255,255,255,0.02)（微光雾面）
```

### 白昼主题

```
背景：#FAF8F3（宣纸白）
文字：rgba(26,26,26,0.95)（墨黑）
金色：#B8960F（深金）
表面：rgba(255,255,255,0.65)（半透明白）
```

### 自定义颜色体系

| Tailwind 类名 | 色值 | 用途 |
|---------------|------|------|
| `void` | `#0a0e17` | 主背景 |
| `fog` | `rgba(255,255,255,0.04)` | 雾面表面 |
| `gold` | `#D4AF37` | 强调/装饰 |
| `pale` | `rgba(255,255,255,0.85)` | 主文字 |
| `ink` | `#1a1a1a` | 后台主色 |
| `ricepaper` | `#FAF8F3` | 后台背景 |
| `ochre` | `#a0752a` | 后台警告/强调 |

### 自定义动画

| 动画名 | 效果 |
|--------|------|
| `fade-up` | 上浮淡入 |
| `fade-in` | 淡入 |
| `rift-glow` | 裂隙光芒脉动 |
| `rift-pulse` | 裂隙宽度脉动 |
| `fog-drift` | 雾气漂移（20s/35s） |
| `gold-breathe` | 金色呼吸灯 |
| `float-idle` | 悬浮闲置 |
| `particle-fall` | 粒子坠落 |
| `seal-stamp` | 印章盖下效果 |

---

## 组件体系

### 前台共享组件

| 组件 | 说明 |
|------|------|
| `PageShell` | 页面外壳：雾气背景层 + `max-w-page` 内容区 |
| `PageHeader` | 页面标题：rift-line 分隔线 + 副标题 + 主标题 |
| `EmptyState` | 空状态：印章图标 + 提示文字 |
| `PostCard` | 文章卡片：`default` / `compact` / `hero` 三种变体 |
| `PostList` | 文章列表：使用 PostCard + EmptyState |

### 后台共享组件

| 组件 | 说明 |
|------|------|
| `AdminCard` | 内容卡片 |
| `AdminButton` | 按钮：`primary` / `secondary` / `danger` |
| `AdminInput` | 输入框 |
| `AdminBadge` | 标签/徽章 |
| `AdminTable` | 数据表格 |
| `AdminPageHeader` | 页面标题 + 操作按钮 |
| `AdminConfirmDialog` | 确认弹窗 |

---

## 日志系统

### 架构

```
请求 → withLog/API → logger.info/warn/error → 写入队列 → Prisma → SQLite
```

### 特性

- **异步写入队列**：日志先入内存队列，批量写入数据库，不阻塞主流程
- **级别过滤**：支持 `debug` / `info` / `warn` / `error` 四级
- **分类体系**：`api` / `auth` / `post` / `category` / `tag` / `setting` / `view` / `system`
- **自动记录**：`withLog` 高阶函数自动包装 API 路由，记录请求方法/路径/状态码/耗时/IP
- **页面访问**：`PageViewTracker` 客户端组件自动上报每次路由变化的访问
- **日志清理**：`cleanOldLogs(days)` 按保留天数自动清理旧日志

### 使用示例

```typescript
import { logger } from "@/lib/logger";
import { withLog } from "@/lib/with-log";

// 直接记录日志
void logger.info({
  category: "post",
  action: "post_created",
  message: "文章已创建",
  meta: { title: "Hello World" },
  ip: "127.0.0.1",
});

// 包装 API 路由自动记录
export const GET = withLog(async (request, context) => {
  // 业务逻辑
  return NextResponse.json({ data: "hello" });
});
```

---

## 部署指南

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入仓库
3. 配置环境变量：`DATABASE_URL`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL`
4. 部署

> **注意**：Vercel 无持久化文件系统，SQLite 不适合生产环境。建议迁移到 PostgreSQL：
> 1. 修改 `prisma/schema.prisma` 中 `provider` 为 `"postgresql"`
> 2. 更新 `DATABASE_URL` 为 PostgreSQL 连接字符串
> 3. 运行 `npx prisma db push`

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 自托管 / VPS

```bash
# 克隆并构建
git clone https://github.com/etoilefixes/boyunxiblog.git
cd boyunxiblog
npm ci
npx prisma generate
npx prisma db push
npx prisma db seed
npm run build

# 使用 PM2 守护进程
npm install -g pm2
pm2 start npm --name "boyunxiblog" -- start
pm2 save
pm2 startup
```

---

## 开发指南

### 添加新页面

1. 在 `src/app/(frontend)/` 或 `src/app/admin/` 下创建目录和 `page.tsx`
2. 前台页面使用 `PageShell` + `PageHeader` + `EmptyState` 组件保持一致性
3. 后台页面使用 `AdminPageHeader` + `AdminCard` + `AdminButton` 等组件

### 添加新 API

1. 在 `src/app/api/` 下创建路由文件
2. 使用 `withLog` 包装 handler 自动记录日志
3. 管理 API 需要在前端使用 NextAuth session

```typescript
import { withLog } from "@/lib/with-log";
import { NextRequest, NextResponse } from "next/server";

export const GET = withLog(async (request: NextRequest) => {
  return NextResponse.json({ data: "hello" });
});
```

### 添加新日志分类

1. 在 `src/lib/logger.ts` 的 `LogCategory` 类型中添加新分类
2. 在 `src/lib/with-log.ts` 的 `inferCategory` 函数中添加路径映射
3. 在管理后台日志页面的分类筛选中添加选项

### 修改主题

1. **CSS 变量**：编辑 `src/styles/globals.css` 中的 `:root` 和 `[data-theme="day"]`
2. **Tailwind 配置**：编辑 `tailwind.config.ts` 中的 `theme.extend.colors`
3. **动画**：编辑 `tailwind.config.ts` 中的 `theme.extend.animation` 和 `keyframes`

---

## 许可证

本项目基于 [MIT License](./LICENSE) 开源。

```
MIT License

Copyright (c) 2026 etoilefixes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
