import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import mime from "mime-types";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = process.env.SUPABASE_BUCKET || "uploads";

// Usage:
// npm run upload:images blog
// npm run upload:images meet-team
// npm run upload:images logo

const localFolder = process.argv[2];

if (!localFolder) {
  console.log(`
Usage:

npm run upload:images blog
npm run upload:images meet-team
npm run upload:images logo
`);
  process.exit(1);
}

// Local Folder  -> Supabase Folder
const folderMap: Record<string, string> = {
  blog: "blog",
  "meet-team": "team",
  logo: "logo",
  product: "product",
};

const remoteFolder = folderMap[localFolder];

if (!remoteFolder) {
  console.error(`Unsupported folder "${localFolder}"`);
  process.exit(1);
}

const LOCAL_DIR = path.join(process.cwd(), "public", localFolder);

const imageMap: Record<string, string> = {};

let uploaded = 0;
let skipped = 0;
let failed = 0;

async function scan(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, {
    withFileTypes: true,
  });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return scan(fullPath);
      }

      return fullPath;
    })
  );

  return files.flat();
}

async function upload(filePath: string) {
  const relativePath = path
    .relative(LOCAL_DIR, filePath)
    .replace(/\\/g, "/");

  const storagePath = `${remoteFolder}/${relativePath}`;

  try {
    // Already exists?
    const { data: existing } = await supabase.storage
      .from(BUCKET)
      .list(path.dirname(storagePath), {
        search: path.basename(storagePath),
      });

    if (
      existing?.find(
        (file) => file.name === path.basename(storagePath)
      )
    ) {
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

      imageMap[`/${localFolder}/${relativePath}`] = publicUrl;

      skipped++;

      console.log(`⏭ Skipped ${relativePath}`);

      return;
    }

    const file = await fs.readFile(filePath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        contentType:
          mime.lookup(filePath) || "application/octet-stream",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

    imageMap[`/${localFolder}/${relativePath}`] = publicUrl;

    uploaded++;

    console.log(`✅ Uploaded ${relativePath}`);
  } catch (e: any) {
    failed++;

    console.log(`❌ Failed ${relativePath}`);
    console.log(e.message);
  }
}

async function main() {
  console.log(`\nScanning ${localFolder}...\n`);

  const files = await scan(LOCAL_DIR);

  const images = files.filter((file) =>
    /\.(jpg|jpeg|png|webp|svg)$/i.test(file)
  );

  console.log(`Found ${images.length} images\n`);

  for (const image of images) {
    await upload(image);
  }

  const output = path.join(
    process.cwd(),
    "scripts",
    `${localFolder}-image-map.json`
  );

  await fs.writeFile(output, JSON.stringify(imageMap, null, 2));

  console.log("\n============================");
  console.log(`Uploaded : ${uploaded}`);
  console.log(`Skipped  : ${skipped}`);
  console.log(`Failed   : ${failed}`);
  console.log("============================");

  console.log(`Generated ${output}\n`);
}

main().catch(console.error);