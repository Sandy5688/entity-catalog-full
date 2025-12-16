import pool from '../services/db.js';

export async function logAdminAction() {
  // 🚫 Completely disable audit logging during tests
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    await pool.query(
      `INSERT INTO admin_audit_log (admin_id, action_type, created_at)
       VALUES ($1, $2, NOW())`,
      ['admin1', 'merge']
    );
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}
