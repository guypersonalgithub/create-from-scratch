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
  params?: Record<string, string | number | boolean | string[] | number[] | boolean[]>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  body?: string | URLSearchParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  fallback?: T;
};

async function sendRequest<T>(args: SendRequestArgs<T> & { fallback: T }): Promise<T>;
async function sendRequest<T>(args: SendRequestArgs<T>): Promise<T | undefined>;

async function sendRequest<T>({
  url,
  params,
  method,
  body,
  headers,
  signal,
  fallback,
}: SendRequestArgs<T>): Promise<T | undefined> {
  try {
    const parsedURL = setupURL<T>({ url, params });
    const response = await fetch(parsedURL, { method, body, headers, signal });
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
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Request was aborted');
      return fallback;
    }

    if (error instanceof Error) {
      console.error(error.message);
    }

    return fallback;
  }
}

export { sendRequest };
