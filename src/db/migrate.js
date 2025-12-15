import { execSync } from 'node:child_process';

try {
  console.log('📦 Running database migrations...');
  execSync('npx sequelize db:migrate', { stdio: 'inherit' });
  console.log('✅ Migrations complete');
} catch (err) {
  console.error('❌ Migration failed');
  process.exit(1);
}
