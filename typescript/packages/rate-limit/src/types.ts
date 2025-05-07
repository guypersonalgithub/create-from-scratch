export type TokenBucket = {
  lastRefill: number; // last token refill time
  hasToken: boolean; // token availability
  lastSeen: number; // last request time (for cleanup)
};
