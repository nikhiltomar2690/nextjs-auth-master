// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const VerifyPage = () => {
//   const [code, setCode] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("/api/verify", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ code, email }),
//       });

//       if (res.status === 200) {
//         setError("");
//         // Redirect to home page upon successful verification
//         router.push("/login");
//       } else {
//         const errorMessage = await res.text();
//         setError(errorMessage || "Verification failed. Please try again.");
//       }
//     } catch (error) {
//       setError("An unexpected error occurred. Please try again.");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-24">
//       <div className="bg-[#212121] p-8 rounded shadow-md w-96">
//         <h1 className="text-4xl text-center font-semibold mb-8">
//           Verify Your Email
//         </h1>
//         <form className="flex flex-col" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="bg-black text-white p-2 rounded mb-4"
//           />
//           <input
//             type="text"
//             placeholder="Enter verification code"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             required
//             className="bg-black text-white p-2 rounded mb-4"
//           />
//           <button type="submit">Verify</button>
//           <p className="text-red-500 mt-2">{error && error}</p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VerifyPage;
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const VerifyPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (res.status === 200) {
        setError("");
        // Redirect to the login page upon successful verification
        router.push("/login");
      } else {
        const errorMessage = await res.text();
        setError(errorMessage || "Verification failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-[#212121] p-8 rounded shadow-md w-96">
        <h1 className="text-4xl text-center font-semibold mb-8">
          Verify Your Email
        </h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="bg-black text-white p-2 rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Verify
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
