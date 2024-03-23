import Link from "next/link";

export default function Home() {
  return (
    <main>
      hi!
      <Link href="/registration">Register here</Link>
    </main>
  );
}
