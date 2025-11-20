import express from 'express';
import Link from '../models/linkModel.js';

const redirectRoutes = express.Router();

redirectRoutes.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        // Logic to find the original URL from the database using the code
        const originalUrl =  await Link.findOneAndUpdate({ code }, { 
            $inc: { clicks: 1 },
            $set: { last_clickedAt: new Date()}
        }, 
            { new: true });

        if (originalUrl) {
            return res.status(302).redirect(originalUrl.targetUrl);
        } else {
            return res.status(404).json({ message: "Link not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

export default redirectRoutes;