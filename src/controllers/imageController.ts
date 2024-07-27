import { Request, Response, NextFunction } from 'express';
import imageService from '../services/imageService';

export const getImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { imageName, imageSize } = req.query;
  
      if (!imageName || !imageSize) {
        res.status(400).send('Image name and size are required.');
        return;
      }
  
      const imageBuffer = await imageService.getImage(imageName as string, parseInt(imageSize as string, 10));
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(imageBuffer, 'binary');
    } catch (error) {
      next(error);
    }
  };
