#!/usr/bin/env node

/**
 * Helper script to verify Supabase connection string format
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔍 Supabase Connection String Checker\n');
console.log('This will help you verify your connection string format.\n');

rl.question('Enter your Supabase project reference (e.g., udsbjwtfezsiylmocfng): ', (projectRef) => {
  rl.question('Enter your database password: ', (password) => {
    rl.question('Enter your region (e.g., us-east-1, or press Enter for default): ', (region) => {
      rl.close();

      const encodedPassword = encodeURIComponent(password);
      const regionPart = region || 'us-east-1';
      
      console.log('\n📋 Generated Connection Strings:\n');
      
      // Direct connection (often IPv6-only on Supabase)
      const directUrl = `postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`;
      console.log('1️⃣ Direct Connection (requires IPv6 network support):');
      console.log(`   DATABASE_URL_DIRECT="${directUrl}"\n`);

      // Pooler session mode (recommended for Prisma + Prisma Studio on IPv4 networks)
      const poolerSessionUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-${regionPart}.pooler.supabase.com:5432/postgres?sslmode=require`;
      console.log('2️⃣ Pooler Session Mode (Recommended for Prisma + Studio):');
      console.log(`   DATABASE_URL="${poolerSessionUrl}"\n`);
      
      // Pooler transaction mode (recommended for serverless; may require disabling prepared statements)
      const poolerTransactionUrl = `postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-${regionPart}.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1`;
      console.log('3️⃣ Pooler Transaction Mode (Serverless / Edge - use with care):');
      console.log(`   DATABASE_URL_POOLER_TRANSACTION="${poolerTransactionUrl}"\n`);
      
      console.log('📝 Instructions:');
      console.log('1. Copy the POOLER SESSION MODE connection string (DATABASE_URL) to your .env file');
      console.log('2. Make sure your password is URL-encoded (special chars like @, $, #, etc.)');
      console.log('3. Test with: npx prisma studio (then click a model)');
      console.log('\n⚠️  If you get "Can\'t reach database server":');
      console.log('   - Check Supabase Dashboard → Settings → Database → Network Restrictions');
      console.log('   - Make sure your IP is whitelisted (or disable restrictions for dev)');
      console.log('   - Verify your project is Active (not paused)');
      console.log('\n✅ If MCP server works but Prisma doesn\'t, it may be IPv6 routing or network firewall blocking port 5432.\n');
    });
  });
});
