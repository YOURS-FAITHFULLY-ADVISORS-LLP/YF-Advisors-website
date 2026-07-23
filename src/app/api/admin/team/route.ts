import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { buildPaginationMeta, parseQueryParams } from '@/src/lib/pagination';
import { prisma } from '@/src/lib/prisma';
import { createTeamSchema } from '@/src/validations/team.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';
import { TeamStatus } from '@prisma/client';

export const GET = withApiHandler(async (req: NextRequest) => {
  const { page, limit, skip, search, status, sortBy, sortOrder } = parseQueryParams(req);

  const where: any = {};

  if (status && (status === 'DRAFT' || status === 'PUBLISHED')) {
    where.status = status as TeamStatus;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { designation: { contains: search, mode: 'insensitive' } },
      { bio: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  if (['displayOrder', 'name', 'createdAt', 'updatedAt'].includes(sortBy)) {
    orderBy[sortBy] = sortOrder;
  } else {
    orderBy.displayOrder = 'asc';
  }

  const [total, teamMembers] = await Promise.all([
    prisma.team.count({ where }),
    prisma.team.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  return apiSuccess(teamMembers, 'Team members retrieved successfully', meta, 200);
});

export const POST = withApiHandler(async (req: NextRequest) => {
  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = createTeamSchema.safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const teamMember = await prisma.team.create({
    data: {
      name: data.name,
      designation: data.designation,
      profileImage: data.profileImage,
      bio: data.bio,
      experience: data.experience || null,
      linkedinUrl: data.linkedinUrl || null,
      status: data.status,
      displayOrder: data.displayOrder ?? 0,
    },
  });

  revalidateCmsPaths(['/about', '/team', '/']);

  return apiSuccess(teamMember, 'Team member created successfully', undefined, 201);
});
