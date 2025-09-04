"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect } from "react";

const Provider = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkIsNewUser();
    }
  }, [user]);

  const checkIsNewUser = async () => {
    try {
      // Send full Clerk user object
      const resp = await axios.post("/api/create-user", {
        user: user,
      });
      console.log("User created/exists:", resp.data);
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  return <div>{children}</div>;
};

export default Provider;
