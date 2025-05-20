"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, []);
  return <div>{children}</div>;
};

export default AuthWrapper;
