type SendRequestArgs = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  body?: string | URLSearchParams;
  headers?: Record<string, string>;
};

export const sendRequest = async <T>({
  url,
  method,
  body,
  headers,
}: SendRequestArgs): Promise<T> => {
  try {
    const response = await fetch(url, { method, body, headers });
    const contentType = response.headers.get("content-type");
    if (response.ok) {
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return (await response.text()) as T;
      }
    }

    const errorMessage = await response.text();
    throw new Error(errorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
};
