import { prismaClient } from "@/server/prisma-client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers/index";

const providers: Provider[] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  }),
];

if (process.env.NODE_ENV === "development") {
  providers.push(
    CredentialsProvider({
      name: "DevProvider",
      credentials: {},
      authorize() {
        return {
          id: "test-user",
          name: "Dev User",
          email: "test.user@sentry.io",
        };
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient) as Adapter,
  providers: providers,
  session: {
    strategy: "jwt",
  },
};
