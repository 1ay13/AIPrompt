'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Example logic for creating an account (customize according to your backend)
    try {
      // Assuming you have an API route to handle user registration
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Automatically sign in the user after successful registration
        await signIn("credentials", {
          redirect: false,
          username,
          password,
        });

        // Redirect to profile page after successful sign-in
        window.location.href = "/profile";
      }
    } catch (err) {
      setError("An error occurred while creating the account.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Create an Account</h2>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Create Account</button>
    </form>
  );
};

export default CreateAccount;