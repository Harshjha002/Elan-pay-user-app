import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials: any) {
        const existingUser = await prisma.user.findFirst({
          where: { number: credentials.phone },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.number,
            };
          }
          return null;
        }

        // New user — create them
        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const user = await prisma.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword,
            },
          });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number,
          };
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],

  secret: process.env.JWT_SECRET || "secret",

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ token, session }: any) {
      if (session.user) session.user.id = token.sub;
      return session;
    },
  },
};