// Applies catalog migrations + seed to Supabase Postgres.
// Run from storefront/:  npm run db:setup
// Requires SUPABASE_DB_URL in storefront/.env.local (loaded via --env-file).
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const supabaseDir = join(here, "..", "..", "supabase");

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error(
    "Missing SUPABASE_DB_URL. Add it to storefront/.env.local (Supabase → Project Settings → Database → Connection string → URI).",
  );
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run(label, sql) {
  process.stdout.write(`→ ${label} ... `);
  await client.query(sql);
  console.log("ok");
}

try {
  await client.connect();

  const migrationsDir = join(supabaseDir, "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const f of files) {
    await run(`migration ${f}`, readFileSync(join(migrationsDir, f), "utf8"));
  }

  await run("seed", readFileSync(join(supabaseDir, "seed.sql"), "utf8"));

  console.log("\n✓ Database setup complete.");
} catch (err) {
  console.error("\n✗ Setup failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
