import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password", placeholder: "admin" },
      },
      async authorize(credentials) {
        console.log("Credentials:", credentials);
        const { username, password } = credentials || {};
        return { id: "1", name: "everyone", imdbKey: process.env.TMDB_KEY };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/discover",
    signOut: "/discover",
  },
  callbacks:{
    session({ session, token }: { session: Session; token: any;}) {
      (session as Session & { imdbKey: string }).imdbKey = token.imdbKey as string;
      return session;
    },
    jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.imdbKey =  process.env.TMDB_KEY;
      }
      return token;
    }
  }
};

export default NextAuth(authOptions);