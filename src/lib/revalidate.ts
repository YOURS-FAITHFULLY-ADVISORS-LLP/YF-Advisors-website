import { revalidatePath } from 'next/cache';

export function revalidateCmsPaths(paths: string[] = ['/']) {
  try {
    for (const path of paths) {
      revalidatePath(path);
    }
  } catch (error) {
    console.error('Failed to revalidate cache paths:', error);
  }
}
