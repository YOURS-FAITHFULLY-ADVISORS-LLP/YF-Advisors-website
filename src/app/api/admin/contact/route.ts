import { NextRequest } from 'next/server';
import { withApiHandler, formatZodIssues } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { prisma } from '@/src/lib/prisma';
import { updateContactSchema } from '@/src/validations/contact.schema';
import { sanitizeInput } from '@/src/lib/sanitize';
import { revalidateCmsPaths } from '@/src/lib/revalidate';

async function getOrCreateContactRecord() {
  let contact = await prisma.contact.findFirst();

  if (!contact) {
    contact = await prisma.contact.create({
      data: {
        title: 'Contact Details',
        officeTitle: 'Our Office',
        address: 'YF Advisors Office Address, New Delhi, India',
        emailTitle: 'Email Us',
        email: 'info@yfadvisors.in',
        phoneTitle: 'Call Us',
        phone: '+91 99999 99999',
        officeHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
      },
    });
  }

  return contact;
}

export const GET = withApiHandler(async () => {
  const contact = await getOrCreateContactRecord();
  return apiSuccess(contact, 'Contact details retrieved successfully', undefined, 200);
});

export const PATCH = withApiHandler(async (req: NextRequest) => {
  const currentRecord = await getOrCreateContactRecord();

  const rawBody = await req.json();
  const body = sanitizeInput(rawBody);

  const validation = updateContactSchema.partial().safeParse(body);
  if (!validation.success) {
    return apiError('Validation error', formatZodIssues(validation.error.issues), 422);
  }

  const data = validation.data;

  const updatedContact = await prisma.contact.update({
    where: { id: currentRecord.id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.officeTitle !== undefined ? { officeTitle: data.officeTitle } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.emailTitle !== undefined ? { emailTitle: data.emailTitle } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.phoneTitle !== undefined ? { phoneTitle: data.phoneTitle } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.googleMap !== undefined ? { googleMap: data.googleMap || null } : {}),
      ...(data.officeHours !== undefined ? { officeHours: data.officeHours || null } : {}),
    },
  });

  revalidateCmsPaths(['/contact', '/']);

  return apiSuccess(updatedContact, 'Contact details updated successfully', undefined, 200);
});
