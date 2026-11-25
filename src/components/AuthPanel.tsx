import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function AuthPanel() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      if (mode === "up") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-16 max-w-sm space-y-3 rounded-lg border border-line bg-white p-6">
      <h2 className="text-2xl font-bold">{mode === "in" ? "Sign in to Give Hub" : "Create your account"}</h2>
      {mode === "up" && <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />}
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input required type="password" minLength={6} placeholder="Password (6+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button className="btn w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Sign up"}</button>
      <button type="button" className="text-sm underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
