"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

const SignInForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      // Redirect or do something else after successful sign-in
      window.location.href = "/profile"; // Example redirection after sign-in
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/profile" }); // Adjust the callback URL as needed
  };

  const handleCreateAccount = () => {
    window.location.href = "/auth/newUser"; // Adjust the URL to your create account page
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 font-semibold mb-2"
        >
          Username
        </label>
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
        <label
          htmlFor="password"
          className="block text-gray-700 font-semibold mb-2"
        >
          Password
        </label>
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
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Sign In
      </button>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 mt-4"
      >
        Sign in with Google
      </button>

      <button
        type="button"
        onClick={handleCreateAccount}
        className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 mt-4"
      >
        Create Account
      </button>
    </form>
  );
};

export default SignInForm;
