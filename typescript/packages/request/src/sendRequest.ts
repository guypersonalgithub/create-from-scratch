import { type RequestResponse } from "./types";

type SetupURLArgs<T> = Pick<SendRequestArgs<T>, "url" | "params">;

const setupURL = <T>({ url, params }: SetupURLArgs<T>) => {
  if (!params) {
    return url;
  }

  const urlObject = new URL(url);

  for (const param in params) {
    const values = params[param];
    if (Array.isArray(values)) {
      values.forEach((value) => {
        urlObject.searchParams.append(param, String(value));
      });
    } else {
      urlObject.searchParams.append(param, String(values));
    }
  }

  return urlObject;
};

export type SendRequestArgs<T> = {
  url: string;
  params?: Record<string, string | number | boolean | string[] | number[] | boolean[] | undefined>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  body?: BodyInit | null;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  fallback?: T;
  stream?: boolean;
};

async function sendRequest<T>(
  args: SendRequestArgs<T> & { fallback: T },
): Promise<RequestResponse<T>>;
async function sendRequest<T>(args: SendRequestArgs<T>): Promise<RequestResponse<T> | undefined>;

async function sendRequest<T>({
  url,
  params,
  method,
  body,
  headers = {},
  signal,
  fallback,
  stream,
}: SendRequestArgs<T>): Promise<{ response?: T; aborted?: boolean } | undefined> {
  try {
    const parsedURL = setupURL<T>({ url, params });
    const response = await fetch(parsedURL, {
      method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json", ...headers },
      signal,
    });

    if (response.ok) {
      if (stream) {
        if (!response.body) {
          throw new Error("Response body doesn't exist!");
        }

        let streamedContent = "";

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          streamedContent += chunk;
        }
      }

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        return { response: (await response.json()) as T };
      } else {
        return { response: (await response.text()) as T };
      }
    }

    const errorMessage = await response.text();
    throw new Error(errorMessage);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("Request was aborted");

      return { response: fallback, aborted: true };
    }

    if (error instanceof Error) {
      console.error(error.message);
    }

    return { response: fallback };
  }
}

export { sendRequest };
