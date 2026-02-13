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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl mb-4">Welcome {user.email}</h1>

      <div className="space-y-2 mb-6">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={addBookmark}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.map((b) => (
          <div key={b.id} className="border p-3 flex justify-between">
            <a href={b.url} target="_blank" className="text-blue-600">
              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}
