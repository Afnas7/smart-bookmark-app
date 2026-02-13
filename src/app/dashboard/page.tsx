"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [bookmarks, setBookmarks] = useState<any[]>([])

useEffect(() => {
  getUser();
}, []);

useEffect(() => {
  if (!user) return;

  const channel = supabase
    .channel("bookmarks-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookmarks" },
      () => {
        fetchBookmarks(user.id);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);


  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      window.location.href = "/"
    } else {
      setUser(data.user)
      fetchBookmarks(data.user.id)
    }
  }

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
  }

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id
      }
    ])

    setTitle("")
    setUrl("")
    fetchBookmarks(user.id)
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
    fetchBookmarks(user.id)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">

    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome {user.email}
      </h1>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>

    <div className="space-y-3 mb-8">
      <input
        placeholder="Bookmark Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={addBookmark}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        Add Bookmark
      </button>
    </div>

    <h2 className="text-lg font-semibold mb-4 text-gray-700">
      Your Bookmarks
    </h2>

    <div className="space-y-3">
      {bookmarks.length === 0 && (
        <p className="text-gray-400 text-center">No bookmarks yet.</p>
      )}

      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
        >
          <a
            href={b.url}
            target="_blank"
            className="text-indigo-600 font-medium hover:underline"
          >
            {b.title}
          </a>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      ))}
    </div>

  </div>
</div>

  )
}
