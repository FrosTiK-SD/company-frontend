// constants/basePath.ts
export const BASE_PATH = "https://tpc.iitbhu.ac.in";

export const stripBasePath = (path: string): string => {
  if (path.startsWith(BASE_PATH)) {
    return path.slice(BASE_PATH.length) || "/";
  }
  return path;
};
