# 古风个人博客设计文档

## 项目概述

面向广泛互联网读者的个人博客，聚焦个人成长和学习记录，同时建设个人品牌。采用纯 Next.js 全栈架构，前后端一体化实现。设计风格融合艺术感、创意感、高级感与古风 UI/UX。

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 14 (App Router) | 前端页面 + API Routes 后端接口 |
| TypeScript | 类型安全 |
| Tailwind CSS 3 | 样式系统 + 自定义古风主题 |
| Prisma ORM | 数据库操作 |
| SQLite | 数据库 |
| NextAuth.js | 管理员认证 |
| Tiptap | 富文本编辑器 |
| Lucide React | 图标库 |

## 页面结构

### 前台页面

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `/` | 文章列表、轮播推荐、分类导航 |
| 文章详情 | `/posts/[slug]` | 文章内容、标签、分享按钮 |
| 分类页 | `/categories/[name]` | 按分类筛选文章 |
| 标签页 | `/tags/[name]` | 按标签筛选文章 |
| 搜索页 | `/search` | 全文搜索功能 |
| 关于我 | `/about` | 个人介绍、联系方式 |

### 后台页面

| 页面 | 路径 | 功能 |
|------|------|------|
| 登录 | `/admin/login` | 管理员登录 |
| 后台首页 | `/admin` | 数据概览、快捷操作 |
| 文章管理 | `/admin/posts` | 文章列表、增删改查 |
| 分类管理 | `/admin/categories` | 分类增删改查 |
| 标签管理 | `/admin/tags` | 标签增删改查 |
| 数据看板 | `/admin/dashboard` | 访问统计、文章统计、趋势图表 |

## API 接口

| 接口 | 方法 | 功能 |
|------|------|------|
| `/api/posts` | GET | 获取文章列表（支持分页、筛选） |
| `/api/posts` | POST | 创建文章 |
| `/api/posts/[id]` | GET | 获取单篇文章 |
| `/api/posts/[id]` | PUT | 更新文章 |
| `/api/posts/[id]` | DELETE | 删除文章 |
| `/api/categories` | GET/POST | 获取/创建分类 |
| `/api/categories/[id]` | PUT/DELETE | 更新/删除分类 |
| `/api/tags` | GET/POST | 获取/创建标签 |
| `/api/tags/[id]` | PUT/DELETE | 更新/删除标签 |
| `/api/search` | GET | 全文搜索 |
| `/api/auth/[...nextauth]` | - | NextAuth 认证 |
| `/api/stats` | GET | 看板统计数据 |

## 数据库模型

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  name     String
  role     String @default("admin")
}

model Post {
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(255)
  slug        String    @unique @db.VarChar(255)
  content     String
  excerpt     String?   @db.VarChar(500)
  coverImage  String?
  published   Boolean   @default(false)
  categoryId  Int?
  category    Category? @relation(fields: [categoryId], references: [id])
  tags        PostTag[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  views       Int       @default(0)
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique @db.VarChar(100)
  slug  String @unique @db.VarChar(100)
  posts Post[]
}

model Tag {
  id    Int      @id @default(autoincrement())
  name  String   @unique @db.VarChar(100)
  posts PostTag[]
}

model PostTag {
  postId Int  @map("post_id")
  tagId  Int  @map("tag_id")
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
}
```

## 古风 UI 设计规范

### 配色方案

| 名称 | 色值 | 用途 |
|------|------|------|
| 墨绿 | #2D5A4A | 主色调、导航、标题 |
| 赭石 | #8B4513 | 辅助色、链接、按钮 |
| 宣纸白 | #F5F0E1 | 背景色 |
| 金色 | #D4AF37 | 点缀色、高亮、装饰 |
| 水墨灰 | #4A4A4A | 正文文字 |
| 云白 | #FAFAF5 | 卡片背景 |

### 字体

- 标题：思源宋体 (Noto Serif SC)
- 正文：思源黑体 (Noto Sans SC)
- 装饰：楷体 (KaiTi)

### 设计元素

- 卷轴边框：文章卡片使用卷轴式边框装饰
- 水墨纹理：背景使用淡雅水墨画纹理
- 印章装饰：标签和分类使用印章风格
- 古典花纹：分隔线和装饰使用古典花纹
- 留白充足：整体布局保持大量留白，营造意境

### 交互设计

- 页面切换：淡入淡出过渡动画
- 文章卡片：悬停时微微上浮并显示水墨晕染效果
- 滚动：视差滚动效果
- 导航：侧边栏导航，古风卷轴展开效果

## 项目目录结构

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── posts/[slug]/page.tsx
│   │   ├── categories/[name]/page.tsx
│   │   ├── tags/[name]/page.tsx
│   │   ├── search/page.tsx
│   │   └── about/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   ├── posts/page.tsx
│   │   ├── posts/new/page.tsx
│   │   ├── posts/[id]/edit/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── tags/page.tsx
│   │   └── dashboard/page.tsx
│   └── api/
│       ├── posts/route.ts
│       ├── posts/[id]/route.ts
│       ├── categories/route.ts
│       ├── categories/[id]/route.ts
│       ├── tags/route.ts
│       ├── tags/[id]/route.ts
│       ├── search/route.ts
│       ├── stats/route.ts
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── AdminSidebar.tsx
│   ├── ui/
│   │   ├── ScrollCard.tsx
│   │   ├── SealTag.tsx
│   │   ├── InkDivider.tsx
│   │   └── SearchBar.tsx
│   ├── frontend/
│   │   ├── PostCard.tsx
│   │   ├── PostList.tsx
│   │   ├── CategoryNav.tsx
│   │   └── ShareButtons.tsx
│   └── admin/
│       ├── PostEditor.tsx
│       ├── StatsChart.tsx
│       └── DataTable.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── styles/
    └── globals.css
```

## 核心功能详述

### 文章系统
- 支持草稿和发布状态
- 自动生成 slug
- 支持封面图
- 支持摘要自动提取
- 文章浏览量统计

### 分类与标签
- 分类为树形结构（一级）
- 标签为扁平结构
- 文章可关联一个分类和多个标签

### 搜索功能
- 基于标题和内容的全文搜索
- 支持按分类和标签筛选
- 搜索结果高亮关键词

### 社交分享
- 支持分享到微信、微博、Twitter
- 复制链接分享

### 后台管理
- 管理员登录认证
- 文章增删改查，富文本编辑
- 分类和标签管理
- 文章发布/草稿状态切换

### 数据看板
- 文章总数、分类总数、标签总数
- 总浏览量
- 最近文章趋势图
- 热门文章排行

## 错误处理

- API 统一返回 `{ success, data, error }` 格式
- 前端使用统一的错误提示组件
- 404 页面使用古风设计
- 表单验证使用 Zod schema

## 安全

- 管理员路由使用 NextAuth 中间件保护
- API 接口验证管理员权限
- 密码使用 bcrypt 加密
- 防止 XSS、CSRF 攻击
