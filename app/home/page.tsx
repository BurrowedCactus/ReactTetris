import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Tetris!</h1>
      <Link href="/game">Start Playing</Link>
    </div>
  );
}
