import { Router } from 'express';
import { mockResearchData } from '../data/research.js';

export const researchRouter = Router();

researchRouter.get('/', async (req, res) => {
  try {
    const { domain, search } = req.query;

    let filteredData = mockResearchData;

    if (domain && typeof domain === 'string') {
      filteredData = filteredData.filter(item => 
        item.metadata.domain.toLowerCase() === domain.toLowerCase()
      );
    }

    if (search && typeof search === 'string') {
      const lowerSearch = search.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.text.toLowerCase().includes(lowerSearch) ||
        item.metadata.title.toLowerCase().includes(lowerSearch)
      );
    }

    res.json(filteredData);
  } catch (error) {
    console.error('Failed to fetch research data:', error);
    res.status(500).json({ error: 'Failed to fetch research data' });
  }
});
