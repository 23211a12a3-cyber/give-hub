import { useState } from "react";
import type { User } from "firebase/auth";
import { supabase, IMAGE_BUCKET } from "../lib/supabase";
import { CATEGORIES, CONDITIONS } from "../types";

export default function ItemForm({ user, onDone }: { user: User; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [condition, setCondition] = useState<string>(CONDITIONS[1]);
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      let image_url: string | null = null;
      if (file) {
        const path = `${user.uid}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const { error: upErr } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file);
        if (upErr) throw upErr;
        image_url = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
      }
      const { error: insErr } = await supabase.from("items").insert({
        owner_id: user.uid, owner_name: user.displayName, title, description, category, condition, location, image_url
      });
      if (insErr) throw insErr;
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post the item. Try again.");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-line bg-white p-5">
      <h2 className="text-xl font-bold">Give something away</h2>
      <input required placeholder="What are you giving? (e.g. Winter jacket)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea rows={3} placeholder="Describe it: size, age, anything the recipient should know" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      <input placeholder="Pickup area (e.g. Narsapur)" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button className="btn" disabled={busy}>{busy ? "Posting..." : "Post item"}</button>
        <button type="button" className="btn-ghost" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}
