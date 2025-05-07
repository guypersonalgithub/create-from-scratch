import { Request, Response, NextFunction } from "express";
import { TokenBucket } from "./types";

type InitializeRateLimiterArgs = {
  refillInterval?: number;
  bucketTTLinMS?: number;
};

type InitializeCleanupArgs = {
  intervalInMS?: number;
};

export const initializeRateLimiter = ({
  refillInterval = 1000,
  bucketTTLinMS = 5 * 60 * 1000,
}: InitializeRateLimiterArgs) => {
  const buckets = new Map<string, TokenBucket>();

  const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;

    if (!ip) {
      return res.status(429).send("Too Many Requests");
    }

    const now = Date.now();

    const bucket = buckets.get(ip) ?? {
      lastRefill: 0,
      hasToken: true,
      lastSeen: now,
    };

    // Refill token if interval passed
    if (now - bucket.lastRefill >= refillInterval) {
      bucket.hasToken = true;
      bucket.lastRefill = now;
    }

    bucket.lastSeen = now;

    if (bucket.hasToken) {
      bucket.hasToken = false;
      buckets.set(ip, bucket);
      next();
    } else {
      res.status(429).send("Too Many Requests");
    }
  };

  const initializeCleanup = ({ intervalInMS = 60 * 1000 }: InitializeCleanupArgs) => {
    return setInterval(() => {
      const now = Date.now();
      for (const [ip, bucket] of buckets.entries()) {
        if (now - bucket.lastSeen > bucketTTLinMS) {
          buckets.delete(ip);
        }
      }
    }, intervalInMS);
  };

  return {
    buckets,
    rateLimiter,
    initializeCleanup,
  };
};
