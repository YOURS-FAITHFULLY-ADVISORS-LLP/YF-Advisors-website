import { prisma } from './prisma';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function generateUniqueSlug(
  model: 'blog' | 'service',
  titleOrSlug: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(titleOrSlug) || 'untitled';
  let candidateSlug = baseSlug;
  let counter = 1;

  while (true) {
    let existingRecord: { id: string } | null = null;

    if (model === 'blog') {
      existingRecord = await prisma.blog.findUnique({
        where: { slug: candidateSlug },
        select: { id: true },
      });
    } else if (model === 'service') {
      existingRecord = await prisma.service.findUnique({
        where: { slug: candidateSlug },
        select: { id: true },
      });
    }

    if (!existingRecord || existingRecord.id === excludeId) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }
}
