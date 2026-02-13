"use client"

import { supabase } from "@/lib/supabaseClient"

export default function Home() {

const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    console.error(error);
    alert("Login failed");
  }
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
