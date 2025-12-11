import NextAuth, { type NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getMongoClient } from '@/lib/mongodb';
import { findUserByEmail } from '@/lib/models/user';
import { getMembershipsForUser } from '@/lib/models/workspace-membership';
import { logAuditEvent } from '@/lib/models/audit-log';
import { getDb } from '@/lib/mongodb';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set');
}

export const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(getMongoClient(), {
    databaseName: process.env.MONGODB_DB_NAME
  }),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  trustHost: true,
  providers: [
    Google({
      clientId: googleClientId ?? '',
      clientSecret: googleClientSecret ?? ''
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;
        const user = await findUserByEmail(email);
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? undefined
        };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }

      // attach memberships for workspace-aware routing
      if (token.sub) {
        const memberships = await getMembershipsForUser(new ObjectId(token.sub));
        const ids = memberships.map((m) => m.workspaceId);
        const db = await getDb();
        const workspaces = await db
          .collection('workspaces')
          .find({ _id: { $in: ids } }, { projection: { subdomain: 1 } })
          .toArray();
        const wsMap = new Map(
          workspaces.map((w: any) => [w._id.toString(), w.subdomain as string])
        );

        token.memberships = memberships.map((m) => ({
          workspaceId: m.workspaceId.toString(),
          role: m.role,
          workspaceType: m.workspaceType,
          subdomain: wsMap.get(m.workspaceId.toString()) || null
        }));
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token?.sub) {
        (session.user as any).id = token.sub;
      }
      (session as any).memberships = token.memberships ?? [];
      return session;
    }
  },
  events: {
    signIn: async ({ user }) => {
      if (!user?.id) return;
      await logAuditEvent({
        userId: new ObjectId(user.id),
        action: 'LOGIN',
        workspaceId: null,
        resourceType: 'user',
        resourceId: user.id,
        createdAt: new Date()
      });
    }
  },
  pages: {
    signIn: '/login'
  }
};

export const { handlers: authHandlers, auth, signIn, signOut } = NextAuth(
  authConfig
);

