import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";
import { checkLockout, recordFail, recordSuccess } from "./login-guard";

function extractIp(req: any): string {
  return (
    req?.headers &&
    (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip"))
  ) || "unknown";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const ip = extractIp(req);

        const { locked, remainingMs } = checkLockout(ip);
        if (locked) {
          void logger.warn({
            category: "auth",
            action: "login_blocked",
            message: `登录被锁定，剩余 ${Math.ceil(remainingMs / 60000)} 分钟`,
            ip,
          });
          return null;
        }

        if (!credentials?.email || !credentials?.password) {
          recordFail(ip);
          void logger.warn({
            category: "auth",
            action: "login_failed",
            message: "登录失败：缺少凭证",
            ip,
          });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          recordFail(ip);
          void logger.warn({
            category: "auth",
            action: "login_failed",
            message: `登录失败：用户不存在 (${credentials.email})`,
            meta: { email: credentials.email },
            ip,
          });
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          const result = recordFail(ip);
          void logger.warn({
            category: "auth",
            action: "login_failed",
            message: `登录失败：密码错误 (${credentials.email})${result.locked ? `，已锁定 ${Math.ceil(result.remainingMs / 60000)} 分钟` : ""}`,
            meta: { email: credentials.email, locked: result.locked },
            ip,
          });
          return null;
        }

        recordSuccess(ip);
        void logger.info({
          category: "auth",
          action: "login_success",
          message: `登录成功: ${credentials.email}`,
          meta: { email: credentials.email },
          userId: user.id,
          ip,
        });

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
