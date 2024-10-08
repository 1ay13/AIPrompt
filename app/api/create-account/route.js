// app/api/create-account/route.js

import NewUser from "@models/newuser"; // Import the NewUser model
import { connectToDB } from "@utils/database";
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

export const POST = async (request) => {
  try {
    // Log the incoming request body
    const requestBody = await request.json();
    console.log("Incoming Request Body:", requestBody);

    // Destructure fields from request body
    const { username, email, password } = requestBody;

    // Check for missing fields
    if (!username || !password) {
      return new Response("Missing required fields: username, email, or password", { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Check if a new user with the given email or username already exists
    const existingUser = await NewUser.findOne({ $or: [ { username }] });
    if (existingUser) {
      return new Response("User already exists with that email or username", { status: 409 });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance using the NewUser model
    const newUser = new NewUser({
      username,
      password: hashedPassword, // Store the hashed password
    });

    // Save the new user to the database
    await newUser.save();

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error("Error creating new user:", error.message, error);
    return new Response(`Failed to create a new user account. Error: ${error.message}`, { status: 500 });
  }
};
