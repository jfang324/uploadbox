import connectToDb from '@/config/db'
import { FileDocument } from '@/interfaces/FileDocument'
import File from '@/models/File'

/**
 * Create a new file document
 *
 * @param name - The name of the file
 * @param extension - The file extension
 * @param size - The size of the file in bytes
 * @param ownerId - The mongoId of the user who owns the file
 * @returns The file document
 */
export const createFile = async (
    name: string,
    extension: string,
    size: number,
    ownerId: string
): Promise<FileDocument | void> => {
    await connectToDb()
    if (!name || !extension || !size || !ownerId) {
        throw new Error('Missing required parameters')
    }

    try {
        const file = new File({
            name: name.split('.')[0],
            extension: extension.split('/')[1],
            size: size,
            ownerId: ownerId,
        })
        await file.save()

        return file
    } catch (error) {
        console.error(error)
        throw new Error('Error creating file')
    }
}

/**
 * Returns all files owned by the user
 *
 * @param userId - The mongoId of the user
 * @returns - An array of file documents
 */
export const getUserFiles = async (userId: string): Promise<FileDocument[]> => {
    await connectToDb()
    if (!userId) {
        throw new Error('Missing userId')
    }

    try {
        const files = await File.find({ ownerId: userId })

        return files
    } catch (error) {
        throw new Error('Error getting user files')
    }
}
