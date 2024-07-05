import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Welcome to Tetris!</h1>
        <Link href="/game">Start Playing</Link>
      </div>
    </main>
  );
}
