import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@models/user"; // Ensure this is the correct path to your User model
import { connectToDB } from "@utils/database"; // Ensure this is the correct path to your database utility

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDB(); // Ensure the database is connected

          const { username, password } = credentials;

          // Find the user in the database by their username
          const user = await User.findOne({ username });

          if (!user) {
            throw new Error("No user found with this username");
          }

          // Check if the provided password matches the stored hashed password
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            throw new Error("Invalid username or password");
          }

          // If everything is fine, return the user object
          return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            image: user.image, // Assuming the user document has an image field
          };
        } catch (error) {
          console.log("Authorization error:", error.message);
          return null; // Return null to indicate failed authentication
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add the user ID and role to the session object
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      // Add the user ID and role to the token object if available
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin", // Customize the sign-in page if needed
    newUser: "/auth/new-user",
  },
  debug: true, // Enable debugging to get more detailed logs in case of issues
});

export { handler as GET, handler as POST };
