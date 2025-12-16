import pool from '../services/db.js';
import { logAdminAction } from '../services/adminAudit.service.js';

export async function mergeEntities(req, res) {
  const { sourceId, targetId, dryRun = false } = req.body;
  const adminId = req.user?.id;

  if (!sourceId || !targetId) {
    return res.status(400).json({
      error: 'sourceId and targetId are required',
    });
  }

  // Fetch entities
  const sourceRes = await pool.query(
    'SELECT * FROM entity_catalog WHERE id = $1',
    [sourceId]
  );
  const targetRes = await pool.query(
    'SELECT * FROM entity_catalog WHERE id = $1',
    [targetId]
  );

  if (!sourceRes.rows.length || !targetRes.rows.length) {
    return res.status(404).json({
      error: 'One or both entities not found',
    });
  }

  const actionDetails = {
    source: sourceRes.rows[0],
    target: targetRes.rows[0],
    dryRun,
  };

  let merged = false;

  if (!dryRun) {
    const fieldsToMerge = [
      'display_name',
      'entity_category',
      'website_url',
    ];

    const updates = fieldsToMerge
      .map((field, idx) => `${field} = $${idx + 2}`)
      .join(', ');

    await pool.query(
      `UPDATE entity_catalog SET ${updates} WHERE id = $1`,
      [targetId, ...fieldsToMerge.map(f => sourceRes.rows[0][f])]
    );

    await pool.query(
      'UPDATE entity_catalog SET is_active = false WHERE id = $1',
      [sourceId]
    );

    merged = true;
  }

  // Admin audit logging (safe in tests)
  await logAdminAction({
    adminId,
    actionType: 'merge',
    entityIds: [sourceId, targetId],
    details: actionDetails,
  });

  // ✅ RESPONSE CONTRACT (WHAT TESTS EXPECT)
  return res.status(200).json({
    merged,
    dryRun,
    sourceId,
    targetId,
  });
}
