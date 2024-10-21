import NextAuth, { Session, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }): Promise<ExtendedSession> => {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
        } as ExtendedSession;
      }
      return session as ExtendedSession;
    },
    async signIn({ user, account, profile, email, credentials }) {
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || [];
      if (user.email && allowedEmails.includes(user.email)) {
        return true;
      }
      // Retorna um objeto de erro com uma URL personalizada
      return '/acesso-negado';
    }
    },
  },
  
)
