"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {

  useEffect(() => {

    // 1. If OAuth token exists in URL → go dashboard
    if (window.location.hash.includes("access_token")) {
      window.location.replace("/dashboard");
      return;
    }

    // 2. Check stored session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.replace("/dashboard");
      }
    });

    // 3. Listen for login event
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          window.location.replace("/dashboard");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
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
  );
}
