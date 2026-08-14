import { Router } from 'express';
import { mockArchives } from '../data/archives.js';

export const archiveRouter = Router();

archiveRouter.get('/', (req, res) => {
  try {
    const { query, category, civilizationId } = req.query;

    let filteredRecords = mockArchives;
    if (query) {
        const q = String(query).toLowerCase();
        filteredRecords = mockArchives.filter(r => 
            r.title.toLowerCase().includes(q) || 
            r.description.toLowerCase().includes(q)
        );
    }

    if (civilizationId) {
        filteredRecords = filteredRecords.filter(r => r.civilizationId === civilizationId);
    }
    
    if (category) {
        filteredRecords = filteredRecords.filter(r => r.category === category);
    }

    res.json({ records: filteredRecords.slice(0, 100) });
  } catch (error) {
    console.error('Archive query error:', error);
    res.status(500).json({ error: 'Failed to query archives' });
  }
});
