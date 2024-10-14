import User from "@models/user"; // Import the unified User model
import { connectToDB } from "@utils/database";
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

export const POST = async (request) => {
  try {
    // Parse the incoming request body
    const requestBody = await request.json();
    console.log("Incoming Request Body:", requestBody);

    // Destructure fields from request body
    const { username, email, password } = requestBody;

    // Check for missing required fields
    if (!username || !password) {
      return new Response("Missing required fields: username or password", { status: 400 });
    }

    // Connect to the database
    await connectToDB();

    // Check if a user with the given username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email ? email : null }],
    });

    if (existingUser) {
      return new Response("User already exists with that username or email", { status: 409 });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance using the unified User model
    const newUser = new User({
      username,
      email: email || null, // Store email only if provided (null for credential users without email)
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