import express from 'express';
import { createlink, deleteLink, getAllLinks, getLinkDetails } from '../controllers/linksController.js';

const linksRoutes = express.Router();

linksRoutes.get('/api/links',getAllLinks)
linksRoutes.post('/api/links',createlink)
linksRoutes.get('/api/links/:code',getLinkDetails)
linksRoutes.delete('/api/links/:code',deleteLink)

export default linksRoutes;