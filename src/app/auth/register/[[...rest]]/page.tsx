"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/doctors";
  const doctorId = searchParams.get("id");

  const finalRedirect = doctorId ? `${redirect}?id=${doctorId}` : redirect;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignUp
        redirectUrl={finalRedirect}
        appearance={{
          elements: {
            formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white",
          },
        }}
      />
    </div>
  );
}
