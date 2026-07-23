import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { statusToggleSchema } from '@/src/validations/common.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingMember = await prisma.team.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingMember) {
    return apiError('Team member not found', ['Cannot update status of non-existing team member'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = statusToggleSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const { status } = validation.data;

  const teamMember = await prisma.team.update({
    where: { id },
    data: { status },
  });

  revalidateCmsPaths(['/about', '/team', '/']);

  return apiSuccess(teamMember, 'Team member status updated successfully', undefined, 200);
});
