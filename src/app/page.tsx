"use client"

import { supabase } from "@/lib/supabaseClient"

export default function Home() {

const loginWithGoogle = async () => {
  const redirectUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/dashboard"
      : "https://bookmark-f6uchuwqc-afnas-projects-1a8d6b1a.vercel.app/dashboard";

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  });
};



  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={loginWithGoogle}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Login with Google
      </button>
    </div>
  )
}
