// pages/signin.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";
import RedirectIfAuthenticated from "../../components/RedirectIfAuthenticated";

const SignIn = dynamic(() => import("@/pages/Signin"), {
  ssr: false,
});

const SignInPage = () => {
  return (
    <RedirectIfAuthenticated>
      <SignIn />
    </RedirectIfAuthenticated>
  );
};

export default SignInPage;
