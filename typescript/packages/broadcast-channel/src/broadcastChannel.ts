export class CounterBroadcaster<T> {
  private channel: BroadcastChannel;
  private onMessageCallback?: (msg: T) => void;

  constructor(channelName: string) {
    this.channel = new BroadcastChannel(channelName);
    this.channel.onmessage = (event) => {
      this.onMessageCallback?.(event.data as T);
    };
  }

  broadcast(message: T) {
    this.channel.postMessage(message);
  }

  onMessage(callback: (msg: T) => void) {
    this.onMessageCallback = callback;
  }

  close() {
    this.channel.close();
  }
}
