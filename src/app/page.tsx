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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Smart Bookmark
        </h1>
        <p className="text-gray-500 mb-8">
          Save and manage your favorite links securely.
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
        >
          Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Your bookmarks stay private 🔒
        </p>
      </div>
    </div>
  );
}
