"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const session = useSession();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/home");
    }
  }, [session, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    // use zod for validation

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
      if (res?.url) router.replace("/home");
    } else {
      setError("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-96 ">
        <h1 className="text-4xl text-center font-semibold mb-8 text-white">
          Login
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
            Sign In
          </button>
          <p className="text-red-500 mt-2">{error && error}</p>
        </form>
        <button
          onClick={() => signIn("google")}
          className="bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600 "
        >
          Sign in with Google
        </button>
        <div className="text-center text-white mt-4">----OR----</div>
        <Link href="/register" className="flex text-center text-blue-400 mt-4">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
