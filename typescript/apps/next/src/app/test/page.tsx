"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Test() {
  const router = useRouter();
  const url = "./test/1";

  return (
    <div>
      Hello
      <div onClick={() => router.push(url)}>1</div>
      <Link href={url}>1 link</Link>
      <Link
        href={{
          pathname: "./test/2",
          query: {
            test: "true",
          },
        }}
        scroll={false}
      >
        2 link
      </Link>
    </div>
  );
}
