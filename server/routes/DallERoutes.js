import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from Image Generator!' });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a prompt' 
            });
        }

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3.5-large",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const imageBlob = await response.blob();
        const buffer = await imageBlob.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        res.status(200).json({ 
            success: true, 
            photo: base64Image 
        });

    } catch (error) {
        console.error('Image Generation Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to generate image',
            error: error.message
        });
    }
});

export default router; 