import bcrypt from 'bcrypt';
import User from '@models/user'; // Adjust the import to your User model path
import { connectToDB } from '@utils/database'; // Adjust the import to your database utility

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    await connectToDB();

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}