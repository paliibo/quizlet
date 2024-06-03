import { QuizData } from "@/types/types";

export const mockApi = (delay = 1): Promise<QuizData[] | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // @ts-ignore
      resolve(localStorageUtil("quiz").get());
    }, delay);
  });
};
export const localStorageUtil = <T>(key: string) => ({
  delete: () => localStorage.removeItem(key),
  get: () => {
    // TODO: use zod for validation of local storage
    const response = localStorage.getItem(key);
    if (!response) return null;
    try {
      return JSON.parse(response) as T;
    } catch (e) {
      return response;
    }
  },
  key,
  set: (value: T) => localStorage.setItem(key, JSON.stringify(value)),
});
