import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import getS3Client from '@/config/s3'

const bucketName = process.env.BUCKET_NAME || ''

export const uploadS3File = async (fileId: string, file: File) => {
    if (!fileId || !file) {
        return
    }

    const s3 = getS3Client()

    try {
        const params = {
            Bucket: bucketName,
            Key: fileId,
            Body: Buffer.from(await file.arrayBuffer()),
            ContentType: file.type,
        }

        return await s3.send(new PutObjectCommand(params))
    } catch (error) {
        console.error('Error uploading file to S3:', error)
        throw new Error('Failed to upload file to S3')
    }
}

export const deleteS3File = async (fileId: string) => {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    const s3 = getS3Client()

    try {
        const params = {
            Bucket: bucketName,
            Key: fileId,
        }

        return await s3.send(new DeleteObjectCommand(params))
    } catch (error) {
        console.error('Error deleting file from S3:', error)
        throw new Error('Failed to delete file from S3')
    }
}

export const getS3PresignedUrl = async (fileId: string) => {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    const s3 = getS3Client()

    try {
        const params = {
            Bucket: bucketName,
            Key: fileId,
        }

        const result = await getSignedUrl(s3, new GetObjectCommand(params), { expiresIn: 3600 })

        return result
    } catch (error) {
        console.error('Error getting S3 presigned URL:', error)
        throw new Error('Failed to get S3 presigned URL')
    }
}
