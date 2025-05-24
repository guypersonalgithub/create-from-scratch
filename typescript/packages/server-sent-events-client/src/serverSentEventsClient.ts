type InitializeServerSentEventsArgs<T> = {
  url: string;
  withCredentials?: boolean;
  onMessageCallback: (event: MessageEvent<T>) => void;
  onErrorCallback: (error: Event) => void;
};

export const initializeServerSentEvents = <T>({
  url,
  withCredentials,
  onMessageCallback,
  onErrorCallback,
}: InitializeServerSentEventsArgs<T>) => {
  const eventSource = new EventSource(url, { withCredentials });
  eventSource.onmessage = (event: MessageEvent<T>) => onMessageCallback(event);
  eventSource.onerror = (error) => onErrorCallback(error);
};
