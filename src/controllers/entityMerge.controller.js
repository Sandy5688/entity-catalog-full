import pool from '../services/db.js';
import { logAdminAction } from '../services/adminAudit.service.js';

export async function mergeEntities(req, res) {
  const { sourceId, targetId, dryRun = true } = req.body;
  const adminId = req.user?.id;

  if (!sourceId || !targetId) {
    return res.status(400).json({ error: 'sourceId and targetId are required' });
  }

  // Fetch entities
  const sourceRes = await pool.query('SELECT * FROM entity_catalog WHERE id=$1', [sourceId]);
  const targetRes = await pool.query('SELECT * FROM entity_catalog WHERE id=$1', [targetId]);

  if (!sourceRes.rows.length || !targetRes.rows.length) {
    return res.status(404).json({ error: 'One or both entities not found' });
  }

  const actionDetails = {
    source: sourceRes.rows[0],
    target: targetRes.rows[0],
    dryRun,
  };

  if (!dryRun) {
    // Example: merge simple fields (expand as needed)
    const fieldsToMerge = ['display_name', 'entity_category', 'website_url'];
    const updates = fieldsToMerge.map(f => `${f} = $${fieldsToMerge.indexOf(f)+2}`).join(', ');

    await pool.query(
      `UPDATE entity_catalog SET ${updates} WHERE id=$1`,
      [targetId, ...fieldsToMerge.map(f => sourceRes.rows[0][f])]
    );

    // Delete the source entity
    await pool.query('DELETE FROM entity_catalog WHERE id=$1', [sourceId]);
  }

  // Log admin action
  await logAdminAction({
    adminId,
    actionType: 'merge',
    entityIds: [sourceId, targetId],
    details: actionDetails,
  });

  res.status(200).json({ message: 'Merge logged', dryRun, actionDetails });
}
