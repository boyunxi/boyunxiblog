# 博云隙 共享组件契约

## 1. 通用状态模型

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading"; previous?: T }
  | { status: "success"; data: T }
  | { status: "error"; message: string; retry?: () => void };

interface FormFieldError {
  field: string;
  message: string;
}

interface PostCardData {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  createdAt: string | Date;
  views?: number;
  readingMinutes?: number;
  category?: { name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
}

interface PostMetaData {
  date?: string;
  readingMinutes?: number;
  views?: number;
  category?: string;
}

interface TableColumn<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  hideBelow?: "md" | "lg";
}

interface EditorDocumentState {
  dirty: boolean;
  saving: boolean;
  lastSavedAt?: string;
  mode: "edit" | "preview" | "split";
}
```

所有异步组件必须实现 loading、error、empty 和 retry 行为；不允许只渲染空白区域。

## 2. 前台组件

| 组件 | 结构与行为 | 响应式与无障碍 |
| --- | --- | --- |
| `SiteHeader` | 品牌链接、主导航、搜索、主题切换、移动菜单 | 移动端菜单为模态层；菜单按钮有 `aria-expanded` 和 `aria-controls` |
| `PrimaryNav` | 当前页面使用文本和底部边框标记 | 支持 Tab；不只用颜色表示当前项 |
| `ThemeToggle` | 夜间/白昼两态，切换后保留用户偏好 | 44px 图标按钮，动态 `aria-label` |
| `PageHeader` | 页面标题、可选副标题、结果统计插槽 | 标题最多两行，禁止固定宽度溢出 |
| `PostCard` | 标题、摘要、分类、标签、日期、阅读时长、可选封面 | 桌面横向，移动纵向；整卡可点击但内部链接不嵌套 |
| `PostMeta` | 图标只作辅助，文本始终可见 | 图标不承担唯一语义，使用 `aria-hidden` |
| `CategoryFilter` | 当前分类、清除、排序入口 | 移动端变为底部抽屉，支持 Escape 关闭 |
| `Tag` | 可点击和只读两种状态 | 胶囊仅用于标签，不承载主要操作 |
| `SearchBar` | 输入、提交、清除、加载状态 | 支持 Enter 提交，清除按钮有明确标签 |
| `ReadingProgress` | 顶部进度条，不影响内容布局 | `aria-hidden="true"`，减少动效时静态显示 |
| `ArticleToc` | 由 h2/h3 自动生成，当前章节高亮 | 移动端可折叠；锚点可键盘访问 |
| `ShareActions` | 复制链接、外部分享，复制后显示成功反馈 | 外部链接说明新窗口行为 |
| `PrevNextNavigation` | 上一篇、下一篇、无数据占位 | 小屏纵向堆叠，标题允许换行 |
| `EmptyState` | 说明、原因、下一步按钮 | 必须提供明确行动，不只显示“暂无数据” |
| `LoadingState` | 骨架或简短状态文本 | 使用 `aria-live="polite"`，不使用无限闪烁 |
| `ErrorState` | 错误说明和重试操作 | 使用 `role="alert"`，保留已有内容时不清空 |

### 前台组件状态矩阵

每个可操作组件至少支持：默认、hover、focus-visible、pressed、disabled、loading、error、empty。卡片 hover 仅改变边框/背景；按钮 loading 时保留原尺寸并禁用重复提交。

## 3. 后台组件

| 组件 | 结构与行为 | 响应式与无障碍 |
| --- | --- | --- |
| `AdminShell` | 侧栏、顶栏、内容工作区、全局 Toast | 侧栏折叠状态不影响主内容可访问性 |
| `AdminSidebar` | 分组导航、当前项、返回前台、退出登录 | 移动端抽屉；当前项有文本和边框双重标记 |
| `AdminTopbar` | 面包屑、页面操作、账户入口 | 操作按主次排序，窄屏收进菜单 |
| `StatCard` | 数字、标签、趋势/行动入口 | 数字不使用过大字体；趋势同时有文本 |
| `DataTable` | 表头、排序、筛选、行操作、分页 | 小屏转为卡片；表格操作有按钮标签 |
| `StatusBadge` | 已发布、草稿、错误等状态 | 颜色之外提供文本和图标 |
| `FilterBar` | 搜索、状态、分类、日期、清除 | 小屏可折叠；筛选结果数量可读出 |
| `FormField` | 标签、控件、帮助文本、错误文本 | 错误通过 `aria-describedby` 关联 |
| `Modal` | 标题、内容、取消/确认、关闭 | 打开后焦点陷阱，Escape 关闭 |
| `ConfirmDialog` | 风险说明、明确破坏性操作按钮 | 破坏性按钮使用 danger 样式，默认焦点在取消 |
| `EditorToolbar` | Markdown/MDX 格式操作、模式切换 | 每个图标按钮有 tooltip、快捷键和 `aria-label` |
| `PreviewPane` | 渲染内容、错误提示、空内容提示 | 预览内容使用语义标题和安全渲染 |
| `Toast` | 成功、错误、警告、撤销 | `aria-live`；自动消失时间不少于 4 秒 |
| `Pagination` | 上一页、下一页、页码、总数 | 当前页有 `aria-current`，无效按钮禁用 |

## 4. 组件实现约束

- 组件 API 使用语义 props，不直接暴露颜色类名。
- 图标统一使用 `lucide-react`，禁止手写重复 SVG。
- 仅图标按钮必须提供 tooltip 或可见辅助说明。
- 交互反馈优先使用边框、背景、文本和图标组合，而不是只改变颜色。
- 组件必须有稳定尺寸，避免加载文本或 hover 导致布局跳动。
