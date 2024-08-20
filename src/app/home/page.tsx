"use client";
import { redirect } from "next/navigation";
import ClientComponent from "@/components/ClientComponentSignout";
import { useSession } from "next-auth/react";

const Home = () => {
  const session = useSession();
  if (!session) {
    redirect("/login");
  } else {
    console.log(session);
  }

  return <ClientComponent />;
};

export default Home;
