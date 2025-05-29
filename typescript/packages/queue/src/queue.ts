export class Queue<T> {
  private items: T[] = [];
  private head: number = 0;
  private tail: number = 0;
  private clearThreshold: number = 50;

  constructor(clearThreshold?: number) {
    if (clearThreshold) {
      this.clearThreshold = clearThreshold;
    }
  }

  enqueue(item: T) {
    this.items[this.tail] = item;
    this.tail++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this.items[this.head];
    this.items[this.head] = undefined!; // Help GC
    this.head++;

    // Optional: Reset to save memory when a lot of dequeues happen
    if (this.head > this.clearThreshold) {
      this.items = this.items.slice(this.head, this.tail);
      this.tail -= this.head;
      this.head = 0;
    }

    return item;
  }

  peek(): T | undefined {
    return this.items[this.head];
  }

  isEmpty() {
    return this.head === this.tail;
  }

  size() {
    return this.tail - this.head;
  }

  clear() {
    this.items = [];
    this.head = 0;
    this.tail = 0;
  }
}
