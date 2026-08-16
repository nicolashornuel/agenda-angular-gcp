export class Utils {
  static sortByAsc<T>(array: T[], key: keyof T): T[] {
    return Utils.sortBy(array, key, 'asc');
  }

  static sortByDesc<T>(array: T[], key: keyof T): T[] {
    return Utils.sortBy(array, key, 'desc');
  }

  static sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA === valueB) {
        return 0;
      }

      const result = valueA < valueB ? -1 : 1;

      return direction === 'asc' ? result : -result;
    });
  }
}
