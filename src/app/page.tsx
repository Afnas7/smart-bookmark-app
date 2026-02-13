"use client";

import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
    <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Smart Bookmark
      </h1>

      <p className="text-gray-500 mb-8">
        Save, organize, and access your favorite links anywhere.
      </p>

      <button
        onClick={loginWithGoogle}
        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
      >
        Continue with Google
      </button>

      <p className="text-xs text-gray-400 mt-6">
        Secure login powered by Google 🔐
      </p>

    </div>
  </div>
);

}
