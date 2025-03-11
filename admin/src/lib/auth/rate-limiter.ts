interface RateLimitEntry {
  attempts: number;
  timestamp: number;
}

class RateLimiter {
  private static instance: RateLimiter;
  private attempts: Map<string, RateLimitEntry>;
  private readonly maxAttempts: number;
  private readonly lockoutDuration: number;

  private constructor() {
    this.attempts = new Map();
    this.maxAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public isRateLimited(identifier: string): boolean {
    const entry = this.attempts.get(identifier);
    
    if (!entry) {
      return false;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.lockoutDuration) {
      this.attempts.delete(identifier);
      return false;
    }

    return entry.attempts >= this.maxAttempts;
  }

  public recordAttempt(identifier: string): void {
    const entry = this.attempts.get(identifier);
    const now = Date.now();

    if (!entry) {
      this.attempts.set(identifier, {
        attempts: 1,
        timestamp: now,
      });
    } else if (now - entry.timestamp > this.lockoutDuration) {
      this.attempts.set(identifier, {
        attempts: 1,
        timestamp: now,
      });
    } else {
      entry.attempts += 1;
    }
  }

  public resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }

  public getRemainingAttempts(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) {
      return this.maxAttempts;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.lockoutDuration) {
      this.attempts.delete(identifier);
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - entry.attempts);
  }

  public getLockoutTimeRemaining(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) {
      return 0;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.lockoutDuration) {
      this.attempts.delete(identifier);
      return 0;
    }

    return Math.max(0, this.lockoutDuration - (now - entry.timestamp));
  }
}

export const rateLimiter = RateLimiter.getInstance(); 