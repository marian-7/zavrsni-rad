export function includes(arr1: any[], arr2: any[]) {
  return arr1.some((item) => {
    return arr2.includes(item);
  });
}

export function includesEvery(arr1: any[], arr2: any[]) {
  return arr1.every((item) => {
    return arr2.includes(item);
  });
}
