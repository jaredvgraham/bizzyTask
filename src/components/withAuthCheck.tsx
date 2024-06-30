"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const withAuthCheck = (Component: React.ComponentType) => {
  return function AuthCheckWrapper(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      console.log("Loading:", loading);
      console.log("User:", user);
      if (!loading && !user) {
        router.push("/signin");
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return user ? <Component {...props} /> : null;
  };
};

export default withAuthCheck;
