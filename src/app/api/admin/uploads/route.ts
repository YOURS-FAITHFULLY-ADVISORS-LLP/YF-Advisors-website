import { NextRequest } from 'next/server';
import { withApiHandler } from '@/src/lib/api-handler';
import { apiError, apiSuccess } from '@/src/lib/api-response';
import { uploadToStorage, validateFile } from '@/src/lib/storage';

export const POST = withApiHandler(async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string | null) || 'cms';

  if (!file) {
    return apiError('Upload failed', ['No file provided in form data'], 400);
  }

  const validationError = validateFile(file, file.name);
  if (validationError) {
    return apiError('Validation error', [validationError], 422);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await uploadToStorage(buffer, file.name, file.type, folder);

  return apiSuccess(
    {
      url: uploadResult.url,
      path: uploadResult.path,
    },
    'File uploaded successfully',
    undefined,
    201
  );
});
