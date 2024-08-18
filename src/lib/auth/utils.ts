import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { redirect } from "next/navigation";
import Credentials from "next-auth/providers/credentials"
import { checkUserDb } from "../api/users/queries";
import { comparePasswords } from "../utils";


declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
}

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      type: "credentials",
      credentials: {
        email: { label: "Username" },
        password: {label: "Username", password: "password"},
      },
      authorize: async (credentials, req) => {

        let user = null

        user = await checkUserDb(credentials?.email)

        if (!user) {
          throw new Error("User not found.")
        }

        const valid = await comparePasswords(credentials?.password, user.password)
        if (!valid) {
          throw new Error("Invalid password.")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      }
    })
  ],
};


export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-in");
};

