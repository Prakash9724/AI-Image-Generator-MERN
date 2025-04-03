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

        console.log('Received prompt:', prompt); // Debug log

        const response = await fetch(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",  // Changed model
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                },
                body: JSON.stringify({ 
                    inputs: prompt,
                    parameters: {
                        num_inference_steps: 30,
                        guidance_scale: 7.5,
                    },
                    options: {
                        wait_for_model: true,
                        use_cache: false
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const imageBlob = await response.blob();
        const buffer = await imageBlob.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        console.log('Image generated successfully'); // Debug log

        res.status(200).json({ 
            success: true, 
            photo: base64Image 
        });

    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to generate image',
            error: error.message,
            stack: error.stack
        });
    }
});

export default router; 