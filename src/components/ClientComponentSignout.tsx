"use client";
import React from "react";
import { signOut } from "next-auth/react";

function ClientComponent() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}

export default ClientComponent;
