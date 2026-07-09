import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma, isDbConnected } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const { handlers, auth, signIn, signOut, unstable_update: updateSession } = NextAuth({
  theme: { logo: "/logo.svg" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Demo mode — no DB connected
        if (!isDbConnected || !prisma) {
          // Check demo credentials (only if ALLOW_DEMO_LOGIN=true)
          if (process.env.ALLOW_DEMO_LOGIN === "true" &&
              email === "demo@medicare.ru" &&
              password === "demo123") {
            return {
              id: crypto.randomUUID(),
              name: "Демо Пользователь",
              email: "demo@medicare.ru",
              image: undefined,
            };
          }
          return null;
        }

        // Real mode — query database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
  secret: process.env.AUTH_SECRET,
});
