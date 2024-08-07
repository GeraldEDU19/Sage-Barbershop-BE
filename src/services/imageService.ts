import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

class ImageService {
  private readonly uploadDir = path.resolve('src/assets/images');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, imageName: string): Promise<void> {
    const imagePath = path.join(this.uploadDir, `${imageName}.jpg`);

    try {
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    } catch (error: any) {
      console.error(`Error deleting file: ${imagePath}`, error);
      if (error.code === 'EPERM') {
        console.error(`Failed to delete file due to permissions issue: ${error.message}`);
      }
      throw new Error(`Failed to delete existing image: ${error.message}`);
    }

    try {
      await sharp(file.buffer)
        .resize(512, 512, { fit: 'cover' })
        .toFile(imagePath);
    } catch (error: any) {
      console.error(`Error saving file: ${imagePath}`, error);
      throw new Error(`Failed to save image: ${error.message}`);
    }
  }

  async getImage(imageName: string, size: number): Promise<Buffer> {
    if (size <= 0 || size > 1024) {
      throw new Error(`Invalid size requested. Size must be between 1 and 1024.`);
    }

    const imagePath = path.join(this.uploadDir, `${imageName}.jpg`);

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image with name '${imageName}' not found.`);
    }

    try {
      const imageBuffer = await sharp(imagePath)
        .resize(size, size, { fit: 'cover' })
        .toBuffer();

      return imageBuffer;
    } catch (error: any) {
      console.error(`Error processing image: ${imagePath}`, error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  async getImageAsBase64(imageName: string, size: number): Promise<string> {
    const imageBuffer = await this.getImage(imageName, size);

    const contentType = path.extname(imageName) === '.png' ? 'image/png' : 'image/jpeg';

    return `data:${contentType};base64,${imageBuffer.toString('base64')}`;
  }
}

export default new ImageService();
