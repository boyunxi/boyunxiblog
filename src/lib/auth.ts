import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logger } from "./logger";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          void logger.warn({
            category: "auth",
            action: "login_failed",
            message: "登录失败：缺少凭证",
            ip: (req?.headers && (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip"))) || "unknown",
          });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          void logger.warn({
            category: "auth",
            action: "login_failed",
            message: `登录失败：用户不存在 (${credentials.email})`,
            meta: { email: credentials.email },
            ip: (req?.headers && (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip"))) || "unknown",
          });
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          void logger.warn({
            category: "auth",
            action: "login_failed",
            message: `登录失败：密码错误 (${credentials.email})`,
            meta: { email: credentials.email },
            ip: (req?.headers && (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip"))) || "unknown",
          });
          return null;
        }

        void logger.info({
          category: "auth",
          action: "login_success",
          message: `登录成功: ${credentials.email}`,
          meta: { email: credentials.email },
          userId: user.id,
          ip: (req?.headers && (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip"))) || "unknown",
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
