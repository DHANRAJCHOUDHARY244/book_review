import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@config/s3";
import logger from "@utils/pino";
const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
class S3Service {
    async uploadFile(fileBuffer: Buffer, key: string, contentType: string = "application/octet-stream") {
      try {
        const params = {
          Bucket: BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
        };
        const urlData =await s3Client.send(new PutObjectCommand(params));
        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        logger.info(`File uploaded successfully: ${fileUrl}`);
         // Return the file URL
         
       return fileUrl;
      } catch (error) {
         logger.error(`Upload error: ${error}`)
      }
    }
  
    async getFileUrl(key: string, expiresIn: number = 3600) {
      try {
        const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
        return await getSignedUrl(s3Client, command, { expiresIn });
      } catch (error) {
        logger.error(`Error getting file URL: ${error}`);
      }
    }
  
    async deleteFile(key: string) {
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
        logger.info(`File deleted successfully: ${key}`);
      } catch (error) {
        logger.error(`Error deleting file: ${error}`);
      }
    }
  
  }
  
export const s3Service = new S3Service();