// Polyfill для Map.getOrInsertComputed (ES2024)
if (!Map.prototype.getOrInsertComputed) {
  (Map.prototype as any).getOrInsertComputed = function <K, V>(
    key: K,
    compute: () => V
  ): V {
    const existing = this.get(key);
    if (existing !== undefined) return existing;
    const value = compute();
    this.set(key, value);
    return value;
  };
}

// Polyfill для Math.sumPrecise (ES2023)
if (!Math.sumPrecise) {
  (Math as any).sumPrecise = function (numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const positive = numbers.filter((n) => n > 0);
    const negative = numbers.filter((n) => n < 0);
    return (
      positive.reduce((a, b) => a + b, 0) +
      negative.reduce((a, b) => a + b, 0)
    );
  };
}

// Polyfill для crypto.randomUUID
if (!window.crypto?.randomUUID) {
  (window.crypto as Crypto).randomUUID = function (): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  } as Crypto['randomUUID'];
}
