import prisma from "@/lib/prisma";
import SessionClient from "@/components/SessionClient";

export default async function Page() {
  const usersCount = await prisma.user.count();

  return (
    <main style={{ padding: 20 }}>
      <h1>Finance AI</h1>
      <p>Users in DB: {usersCount}</p>
      <SessionClient />
    </main>
  );
}
