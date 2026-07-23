import { revalidatePath } from 'next/cache';

export function revalidateCmsPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}
