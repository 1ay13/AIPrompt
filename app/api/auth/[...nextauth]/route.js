import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import User from "@models/user"; // Assuming you have a User model
import { connectToDB } from "@utils/database"; // Assuming this connects to your MongoDB

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
        await connectToDB();

        try {
          const user = await User.findOne({ username: credentials.username });

          if (user) {
            const isValidPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isValidPassword) {
              return {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                image: user.image,
              };
            } else {
              throw new Error("Invalid username or password");
            }
          } else {
            throw new Error("No user found with this username");
          }
        } catch (error) {
          console.log("Authorization error:", error);
          return null; // Return null if something goes wrong
        }
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
            password: credentials
              ? await bcrypt.hash(credentials.password, 10)
              : null,
          });
        }

        return true;
      } catch (error) {
        console.log("Sign-in error:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
