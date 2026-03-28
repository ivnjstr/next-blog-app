import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TEMPORARY ADMIN CREDENTIALS
        const adminEmail = "admin@gmail.com";
        const adminPass = "admin";

        if (credentials.email === adminEmail && credentials.password === adminPass) {
          return { id: "1", name: "Ivan Jester", email: adminEmail };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const adminEmails = ["your-google-email@gmail.com"];
        return adminEmails.includes(user.email);
      }
      return true; // Credentials already checked in authorize
    },
  },
  pages: {
    signIn: '/login',
  }
});

export { handler as GET, handler as POST };