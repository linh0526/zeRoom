import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: any = {
  adapter: MongoDBAdapter(clientPromise) as any,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      httpOptions: {
        timeout: 10000,
      },
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        if (credentials?.email && credentials?.password) {
          let user: any = await User.findOne({ email: credentials.email }).lean();
          if (!user) {
             return null;
          }
          
          if (!user.password) {
            return null; // This account probably used Google sign in implicitly
          }

          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordsMatch) {
             return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser && !dbUser.role) {
          await User.findByIdAndUpdate(dbUser._id, { role: "user" });
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  events: {
    async createUser({ user }: any) {
      await dbConnect();
      // Đảm bảo role được lưu vào DB khi user được tạo qua Google/Adapter
      await User.findByIdAndUpdate(user.id, { role: "user" });
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "zeroom-secret-123",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
