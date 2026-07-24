import { NextRequest } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { SubmissionStatus } from '@prisma/client';

export const GET = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const submission = await prisma.contactSubmission.findUnique({
    where: { id },
  });

  if (!submission) {
    return apiError('Submission not found', undefined, 404);
  }

  return apiSuccess(submission, 'Submission details retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();

  const { status, notes } = body;

  const existing = await prisma.contactSubmission.findUnique({
    where: { id },
  });

  if (!existing) {
    return apiError('Submission not found', undefined, 404);
  }

  const updateData: any = {};

  if (status && Object.values(SubmissionStatus).includes(status as SubmissionStatus)) {
    updateData.status = status as SubmissionStatus;
  }

  if (typeof notes === 'string') {
    updateData.notes = notes;
  }

  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: updateData,
  });

  return apiSuccess(updated, 'Submission updated successfully', undefined, 200);
});

export const DELETE = withApiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const existing = await prisma.contactSubmission.findUnique({
    where: { id },
  });

  if (!existing) {
    return apiError('Submission not found', undefined, 404);
  }

  await prisma.contactSubmission.delete({
    where: { id },
  });

  return apiSuccess(null, 'Submission deleted successfully', undefined, 200);
});
