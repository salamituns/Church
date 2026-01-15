#!/usr/bin/env node

/**
 * Helper script to generate properly formatted Supabase connection string
 * Usage: node scripts/generate-supabase-url.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔗 Supabase Connection String Generator\n');

rl.question('Enter your Supabase project reference (e.g., udsbjwtfezsiylmocfng): ', (projectRef) => {
  rl.question('Enter your database password: ', (password) => {
    rl.question('Enter your region (e.g., us-east-1, or press Enter for default): ', (region) => {
      rl.close();

      const encodedPassword = encodeURIComponent(password);
      const regionPart = region ? `aws-0-${region}` : 'aws-0-us-east-1';
      
      // Supabase direct DB host is often IPv6-only. If your network can't route IPv6,
      // Prisma won't be able to connect to db.<ref>.supabase.co:5432.
      // Use Supavisor pooler *session mode* (5432) for Prisma and Prisma Studio.
      const poolerSessionUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@${regionPart}.pooler.supabase.com:5432/postgres?sslmode=require`;

      // Pooler transaction mode (6543) is ideal for serverless/edge functions, but prepared statements may break.
      // Use only if your client library supports disabling prepared statements (e.g. Prisma with pgbouncer=true).
      const poolerTransactionUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@${regionPart}.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1`;
      
      // Direct connection (often IPv6-only)
      const directUrl = `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`;

      console.log('\n✅ Generated Connection Strings:\n');
      console.log('📦 Pooler (Session mode) — Recommended for Prisma + Prisma Studio:');
      console.log(`DATABASE_URL="${poolerSessionUrl}"\n`);

      console.log('⚡ Pooler (Transaction mode) — Recommended for serverless (use with care):');
      console.log(`DATABASE_URL_POOLER_TRANSACTION="${poolerTransactionUrl}"\n`);
      
      console.log('🔌 Direct Connection (requires IPv6 network support):');
      console.log(`DATABASE_URL_DIRECT="${directUrl}"\n`);
      
      console.log('📝 Put DATABASE_URL (session mode) in your .env for local development.\n');
    });
  });
});
