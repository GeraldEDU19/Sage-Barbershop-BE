import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

class ImageService {
  private readonly uploadDir = 'uploads';

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir);
    }
  }

  async uploadImage(file: Express.Multer.File, imageName: string): Promise<void> {
    const imagePath = path.join(this.uploadDir, `${imageName}.jpg`);


    await sharp(file.buffer)
      .resize(1024, 1024, { fit: 'cover' })
      .toFile(imagePath);
  }

  async getImage(imageName: string, size: number): Promise<Buffer> {
    if (size <= 0 || size > 1024) {
      throw new Error(`Invalid size requested. Size must be between 1 and 1024.`);
    }

    const imagePath = path.join(this.uploadDir, `${imageName}.jpg`);
    
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image with name '${imageName}' not found.`);
    }

    const imageBuffer = await sharp(imagePath)
      .resize(size, size, { fit: 'cover' })
      .toBuffer();

    return imageBuffer;
  }

  async getImageAsBase64(imageName: string, size: number): Promise<string> {
    const imageBuffer = await this.getImage(imageName, size);

    // Determine the appropriate content type
    const contentType = path.extname(imageName) === '.png' ? 'image/png' : 'image/jpeg';

    // Convert image buffer to base64
    return `data:${contentType};base64,${imageBuffer.toString('base64')}`;
  }
}

export default new ImageService();
