"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response status is 200 (successful registration)
      if (res.status === 200) {
        setError("");
        // Redirect to verification page after successful registration
        router.push("/verify");
      } else if (res.status === 400) {
        // Handle specific error for already registered email
        setError("This email is already registered");
      } else {
        // Handle other unexpected errors
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      // Handle network or unexpected errors
      setError("Error occurred, try again");
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-96">
        <h1 className="text-4xl text-center font-semibold mb-8 text-white">
          Register
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            className="bg-black text-white p-2 rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="bg-black text-white p-2 rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
          <p className="text-red-500 mt-2">{error && error}</p>
        </form>
        <div className="text-center text-white mt-4">----OR----</div>
        <Link href="/login" className="flex text-center text-blue-400 mt-4">
          Login with an existing account
        </Link>
      </div>
    </div>
  );
};

export default Register;
