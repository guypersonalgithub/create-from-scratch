"use client";
import { useParams, useSearchParams } from "next/navigation";

export default function Id() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const fetchFromApi = async () => {
    try {
      const response = await fetch("/api/user???", {
        headers: {
          Accept: "application/json",
          method: "GET",
        },
      });

      if (!response) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const test = searchParams.get("new");
  if (test) {
    alert(test);
  }

  return (
    <div>
      <div>{id}</div>
      <button onClick={fetchFromApi}>Test</button>
    </div>
  );
}
