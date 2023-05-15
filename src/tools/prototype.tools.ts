declare global {
  // @ts-ignore - ignore recursion
  interface Array<T> extends Array<T> {
    last: () => T;
    lastIndex: () => number;
    first: () => T;
    isLast: (index: number) => boolean;
    isLastItem: (item: T) => boolean;
  }
}

export function updatePrototypes() {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
  Array.prototype.lastIndex = function () {
    return this ? this.length - 1 : -1;
  };
  Array.prototype.first = function () {
    return this ? this[0] : undefined;
  };
  Array.prototype.isLast = function (index: number) {
    return this ? index === this.length - 1 : false;
  };
  Array.prototype.isLastItem = function <T>(item: T) {
    return this ? this.last() === item : false;
  };
}
