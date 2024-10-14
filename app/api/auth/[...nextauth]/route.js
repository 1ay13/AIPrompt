import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@utils/database";
import User from "@models/user"; // Use the unified User model
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Credentials Provider for username/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        // Find the user by username
        const user = await User.findOne({ username: credentials.username }).select('+password');
        
        if (!user) {
          return null; // No user found
        }

        // Compare the password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          return null; // Invalid password
        }

        // Return user object (without password)
        return { id: user._id, name: user.username, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Define the sign-in page
  },
  session: {
    strategy: 'jwt',  // Use JWT for session management
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;  // Store user ID in session
      session.user.name = token.name; // Add name (optional)
      session.user.email = token.email; // Add email (optional)
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;  // Store user ID in JWT token
        token.name = user.name;  // Store username in token
        token.email = user.email;  // Store email in token
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };