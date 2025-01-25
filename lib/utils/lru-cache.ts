export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private keysByAge = new Map<K, number>();
  private accessCount = 0;

  constructor(private maxSize: number = 1000) {}

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Update access time
      this.keysByAge.set(key, ++this.accessCount);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    this.cache.set(key, value);
    this.keysByAge.set(key, ++this.accessCount);
  }

  private evictOldest(): void {
    let oldestKey: K | undefined;
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.keysByAge) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.keysByAge.delete(oldestKey);
    }
  }

  clear(): void {
    this.cache.clear();
    this.keysByAge.clear();
    this.accessCount = 0;
  }

  get size(): number {
    return this.cache.size;
  }
}
