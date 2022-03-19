export const createNumbersArray = (from, to) => new Array((to - from) + 1).fill().map((_, i) => i + from);
