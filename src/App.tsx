import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { supabase } from "./lib/supabase";
import { CATEGORIES, type Item } from "./types";
import AuthPanel from "./components/AuthPanel";
import ItemForm from "./components/ItemForm";
import ItemCard from "./components/ItemCard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setReady(true); }), []);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message); else { setError(""); setItems(data as Item[]); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  async function update(id: string, patch: Partial<Item>) {
    const { error } = await supabase.from("items").update(patch).eq("id", id);
    if (error) setError(error.message);
    load();
  }
  async function remove(item: Item) {
    const { error } = await supabase.from("items").delete().eq("id", item.id);
    if (error) setError(error.message);
    load();
  }

  if (!ready) return <p className="p-8">Loading...</p>;
  if (!user) return <AuthPanel />;

  const shown = items.filter((i) =>
    (category === "All" || i.category === category) &&
    (i.title + " " + (i.description ?? "")).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <header className="flex flex-wrap items-center justify-between gap-3 py-5">
        <h1 className="text-3xl font-bold text-pine">Give Hub</h1>
        <div className="flex items-center gap-3 text-sm">
          <span>{user.displayName ?? user.email}</span>
          <button className="btn-ghost" onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </header>

      <section className="mb-6 rounded-lg bg-pine p-6 text-white">
        <p className="max-w-xl text-xl">Pass on what you no longer need. Find what you do, from people nearby.</p>
        <button className="mt-4 rounded-md bg-marigold px-4 py-2 font-medium text-ink focus:outline-none focus:ring-2 focus:ring-white" onClick={() => setPosting(true)}>
          Give something away
        </button>
      </section>

      {posting && <div className="mb-6"><ItemForm user={user} onDone={() => { setPosting(false); load(); }} /></div>}

      <div className="mb-5 flex flex-wrap gap-3">
        <input className="max-w-xs" placeholder="Search items" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="max-w-[10rem]" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      {shown.length === 0 ? (
        <p className="py-12 text-center text-pine">Nothing listed here yet. Be the first to give something away.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((i) => (
            <ItemCard key={i.id} item={i} uid={user.uid}
              onClaim={(it) => update(it.id, { status: "claimed", claimed_by: user.uid })}
              onRelist={(it) => update(it.id, { status: "available", claimed_by: null })}
              onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
