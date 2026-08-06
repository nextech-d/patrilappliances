/** Split items into a T: all but the last two on top, last two centered on the bottom. */
export function splitItemsForTShape<T>(items: T[]): { topRow: T[]; bottomRow: T[] } {
  if (items.length <= 2) {
    return { topRow: [], bottomRow: items };
  }

  return {
    topRow: items.slice(0, items.length - 2),
    bottomRow: items.slice(-2),
  };
}
