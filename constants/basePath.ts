// constants/basePath.ts
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/recruiter";

export const stripBasePath = (path: string): string => {
  if (path.startsWith(BASE_PATH)) {
    return path.slice(BASE_PATH.length) || "/";
  }
  return path;
};