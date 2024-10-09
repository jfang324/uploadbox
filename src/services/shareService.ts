import connectToDb from '@/config/db'
import { ShareDocument } from '@/interfaces/ShareDocument'
import Share from '@/models/Share'
import { FileDocument } from '@/interfaces/FileDocument'

/**
 * Create a new share between the file and the recipient if it doesn't exist and return the share document
 *
 * @param fileId - The mongoId of the file
 * @param receipientId - The mongoId of the recipient
 * @returns The share document
 */
export const createShare = async (fileId: string, receipientId: string): Promise<ShareDocument> => {
    if (!fileId || !receipientId) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()
    const existingShare = await Share.findOne({
        fileId: fileId,
        userId: receipientId,
    })

    if (existingShare) {
        return existingShare
    } else {
        try {
            const share = new Share({
                fileId: fileId,
                userId: receipientId,
            })
            await share.save()

            return share
        } catch (error) {
            console.error('Error creating share:', error)
            throw new Error('Error creating share')
        }
    }
}

/**
 * Delete a share between the file and the recipient and return the share document
 *
 * @param fileId - The mongoId of the file
 * @param receipientId - The mongoId of the recipient
 * @returns The share document
 */
export const deleteShare = async (fileId: string, receipientId: string): Promise<ShareDocument> => {
    if (!fileId || !receipientId) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()

    try {
        const share = await Share.findOneAndDelete({
            fileId: fileId,
            userId: receipientId,
        })

        return share
    } catch (error) {
        console.error('Error deleting share:', error)
        throw new Error('Error deleting share')
    }
}

/**
 * Get all files shared with the user
 *
 * @param userId - The mongoId of the user
 * @returns An array of file documents + owner
 */
export const getSharedFiles = async (userId: string): Promise<(FileDocument & { owner: string })[]> => {
    if (!userId) {
        throw new Error('Missing userId')
    }

    await connectToDb()

    try {
        const shares = await Share.find({ userId: userId }).populate({
            path: 'fileId',
            select: 'name extension size ownerId',
        })

        const sharedFiles = shares.map((share) => {
            const file = share.fileId
            console.log(file)
            return {
                ...file._doc,
                owner: (file.ownerId.name !== undefined ? file.ownerId.name : file.ownerId.email) as string,
            }
        })

        return sharedFiles
    } catch (error) {
        console.error('Error getting shared files:', error)
        throw new Error('Failed to get shared files')
    }
}

export const isShared = async (userId: string, fileId: string): Promise<boolean> => {
    if (!userId || !fileId) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()

    try {
        const share = await Share.findOne({ fileId: fileId, userId: userId })

        return !!share
    } catch (error) {
        console.error('Error checking if file is shared:', error)
        throw new Error('Error checking if file is shared')
    }
}
