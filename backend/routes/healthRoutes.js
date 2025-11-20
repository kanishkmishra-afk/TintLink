import express from 'express';

const healthRoutes = express.Router();

healthRoutes.get('/healthz', (req, res) => {
  return res.status(200).json({ "ok": true,"version": "1.0.0" });
});

export default healthRoutes;