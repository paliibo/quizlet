export const mockApi = (delay = 1000): Promise<null | string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(window.localStorage.getItem("quiz"));
    }, delay);
  });
};
