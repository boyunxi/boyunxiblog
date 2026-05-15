import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      email: "admin@blog.com",
      password: hashedPassword,
      name: "管理员",
      role: "admin",
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "ge-ren-cheng-zhang" },
      update: {},
      create: { name: "个人成长", slug: "ge-ren-cheng-zhang" },
    }),
    prisma.category.upsert({
      where: { slug: "xue-xi-bi-ji" },
      update: {},
      create: { name: "学习笔记", slug: "xue-xi-bi-ji" },
    }),
    prisma.category.upsert({
      where: { slug: "sheng-huo-gan-wu" },
      update: {},
      create: { name: "生活感悟", slug: "sheng-huo-gan-wu" },
    }),
  ]);

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: "阅读" },
      update: {},
      create: { name: "阅读", slug: "yue-du" },
    }),
    prisma.tag.upsert({
      where: { name: "思考" },
      update: {},
      create: { name: "思考", slug: "si-kao" },
    }),
    prisma.tag.upsert({
      where: { name: "习惯" },
      update: {},
      create: { name: "习惯", slug: "xi-guan" },
    }),
    prisma.tag.upsert({
      where: { name: "编程" },
      update: {},
      create: { name: "编程", slug: "bian-cheng" },
    }),
    prisma.tag.upsert({
      where: { name: "旅行" },
      update: {},
      create: { name: "旅行", slug: "lv-xing" },
    }),
  ]);

  const now = Date.now();

  await prisma.post.upsert({
    where: { slug: `cheng-zhang-zhi-lu-${now}` },
    update: {},
    create: {
      title: "成长之路：从迷茫到坚定",
      slug: `cheng-zhang-zhi-lu-${now}`,
      content:
        "每个人的人生都有一段迷茫的时期，那段时间里我们不知道自己要什么，不知道该往哪里走。但正是这些迷茫，让我们有机会停下来思考，重新审视自己的内心。\n\n记得刚毕业的时候，面对众多的选择，我感到无所适从。是继续深造，还是踏入职场？是留在大城市，还是回到家乡？每一个选择都像是一扇未知的门，门后是光明还是黑暗，无人知晓。\n\n后来我明白，成长不是一条直线，而是一条蜿蜒的河流。重要的不是你走得多快，而是你是否在走。每一步，哪怕是最小的步伐，都是向前。\n\n如今回头看，那些迷茫的日子反而成了最珍贵的记忆。因为正是在那些日子里，我学会了倾听内心的声音，学会了勇敢地做出选择，也学会了接受不完美的自己。",
      excerpt: "每个人的人生都有一段迷茫的时期，那段时间里我们不知道自己要什么，不知道该往哪里走。",
      published: true,
      categoryId: categories[0].id,
      tags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[1].id }],
      },
    },
  });

  await prisma.post.upsert({
    where: { slug: `mei-ri-xi-guan-${now}` },
    update: {},
    create: {
      title: "每日习惯的力量：小改变带来大不同",
      slug: `mei-ri-xi-guan-${now}`,
      content:
        "习惯是人生的基石。我们每天做的事情，看似微不足道，却在潜移默化中塑造着我们的未来。\n\n早起、阅读、运动、冥想——这些简单的习惯，坚持下来却能产生惊人的效果。我曾经也是一个赖床的人，每天早上都在闹钟声中挣扎。直到有一天，我决定每天早起半小时，用这段时间来阅读。\n\n刚开始的时候很痛苦，但坚持了一个月后，我发现自己不再需要闹钟就能自然醒来。那半小时的阅读时间，成了我一天中最享受的时光。\n\n习惯的改变不需要一蹴而就，从小事做起，从今天做起。每天进步一点点，一年后你会发现自己已经走了很远。",
      excerpt: "习惯是人生的基石。我们每天做的事情，看似微不足道，却在潜移默化中塑造着我们的未来。",
      published: false,
      categoryId: categories[0].id,
      tags: {
        create: [{ tagId: tags[2].id }, { tagId: tags[1].id }],
      },
    },
  });

  await prisma.post.upsert({
    where: { slug: `du-shu-bi-ji-${now}` },
    update: {},
    create: {
      title: "读书笔记：如何在信息时代保持深度思考",
      slug: `du-shu-bi-ji-${now}`,
      content:
        "在这个信息爆炸的时代，我们每天都被海量的信息包围。短视频、社交媒体、即时通讯，这些工具让信息获取变得前所未有的便捷，但也让我们的注意力变得前所未有的碎片化。\n\n最近读了一本关于深度思考的书，书中提到一个观点让我印象深刻：真正的思考不是快速地浏览信息，而是慢下来，深入地理解一个问题的本质。\n\n我开始尝试每天留出一个小时的「深度时间」，在这个时间段里，关闭所有通知，只专注于一件事情——读一本书、写一篇文章、或者仅仅是思考一个问题。\n\n效果是显著的。我发现自己的理解力在提升，写作时的思路也更加清晰。深度思考就像肌肉一样，需要不断地锻炼才能变得更强。",
      excerpt: "在这个信息爆炸的时代，我们每天都被海量的信息包围。真正的思考不是快速地浏览信息，而是慢下来。",
      published: false,
      categoryId: categories[1].id,
      tags: {
        create: [{ tagId: tags[0].id }, { tagId: tags[1].id }],
      },
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "薄云隙",
      siteDescription: "窥见世界裂隙",
      logoText: "隙",
      heroTitle: "薄云隙",
      heroSubtitle: "窥见世界裂隙 · 数字古风档案馆",
      archiveLabel: "云 海 档 案 馆",
      emptyStateText: "档案馆中尚无卷宗",
      copyrightText: "薄云隙 · 数字古风档案馆",
      aboutContent: `<section class="scroll-vessel incomplete-border p-8">
  <h2 class="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
    <span class="w-1 h-4" style="background-color:rgba(var(--gold-rgb),0.2)"></span>
    档案馆主
  </h2>
  <p class="text-[var(--text-muted)] text-sm leading-[2.2]">
    薄云隙的创建者。在数字与古典之间穿行，于云层裂隙处窥见光芒。以文字为舟，在信息的深海中寻找那些被遗忘的岛屿。
  </p>
</section>

<section class="scroll-vessel incomplete-border p-8">
  <h2 class="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
    <span class="w-1 h-4" style="background-color:rgba(var(--gold-rgb),0.2)"></span>
    关于此馆
  </h2>
  <p class="text-[var(--text-muted)] text-sm leading-[2.2]">
    薄云隙是一座漂浮于云海中的数字档案馆。这里收藏着思考的碎片、技术的痕迹、与世界的对话。每一篇卷宗，都是从云层裂隙中捕捉到的一缕微光。
  </p>
</section>

<section class="scroll-vessel incomplete-border p-8">
  <h2 class="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] mb-4 flex items-center gap-3">
    <span class="w-1 h-4" style="background-color:rgba(var(--gold-rgb),0.2)"></span>
    联络方式
  </h2>
  <div class="space-y-3">
    <div class="flex items-center gap-4">
      <span class="w-6 h-6 rounded-full border border-[rgba(var(--gold-rgb),0.1)] flex items-center justify-center text-[rgba(var(--gold-rgb),0.3)] text-[10px] font-serif">邮</span>
      <a href="mailto:hello@moyun.dev" class="text-[var(--text-muted)] text-sm hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500 border-b border-[rgba(var(--gold-rgb),0.1)] hover:border-[rgba(var(--gold-rgb),0.25)]">
        hello@moyun.dev
      </a>
    </div>
    <div class="flex items-center gap-4">
      <span class="w-6 h-6 rounded-full border border-[rgba(var(--gold-rgb),0.1)] flex items-center justify-center text-[rgba(var(--gold-rgb),0.3)] text-[10px] font-serif">源</span>
      <a href="https://github.com/moyun" target="_blank" rel="noopener noreferrer" class="text-[var(--text-muted)] text-sm hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500 border-b border-[rgba(var(--gold-rgb),0.1)] hover:border-[rgba(var(--gold-rgb),0.25)]">
        @moyun
      </a>
    </div>
  </div>
</section>`,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
