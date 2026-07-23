import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateTeamSchema } from '@/src/validations/team.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

export const GET = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const teamMember = await prisma.team.findUnique({
    where: { id },
  });

  if (!teamMember) {
    return apiError('Team member not found', ['No team member found with the specified ID'], 404);
  }

  return apiSuccess(teamMember, 'Team member retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingMember = await prisma.team.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingMember) {
    return apiError('Team member not found', ['Cannot update non-existing team member'], 404);
  }

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateTeamSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const updatedMember = await prisma.team.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.designation !== undefined ? { designation: data.designation } : {}),
      ...(data.profileImage !== undefined ? { profileImage: data.profileImage } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.experience !== undefined ? { experience: data.experience || null } : {}),
      ...(data.linkedinUrl !== undefined ? { linkedinUrl: data.linkedinUrl || null } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
    },
  });

  revalidateCmsPaths(['/about', '/team', '/']);

  return apiSuccess(updatedMember, 'Team member updated successfully', undefined, 200);
});

export const DELETE = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existingMember = await prisma.team.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingMember) {
    return apiError('Team member not found', ['Cannot delete non-existing team member'], 404);
  }

  await prisma.team.delete({
    where: { id },
  });

  revalidateCmsPaths(['/about', '/team', '/']);

  return apiSuccess({ id }, 'Team member deleted successfully', undefined, 200);
});
