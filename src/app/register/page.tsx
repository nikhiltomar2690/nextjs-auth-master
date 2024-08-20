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
    // use zod for validation

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 400) {
        setError("This email is already registered");
      }
      if (res.status == 200) {
        setError("");
        router.push("/login");
      }
    } catch (error) {
      setError("Error Occurred, Try Again");
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-96">
        <h1 className="text-4xl text-center font-semibold mb-8">Register</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Register</button>
          <p>{error && error}</p>
        </form>
        <div className="text-center">----OR----</div>
        <Link href="/login" className="flex text-center">
          Login with an existing account
        </Link>
      </div>
    </div>
  );
};

export default Register;
