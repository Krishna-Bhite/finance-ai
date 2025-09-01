"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SessionClient() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn("github")}>
          Sign in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
