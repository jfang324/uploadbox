import connectToDb from '@/config/db'
import { ShareDocument } from '@/interfaces/ShareDocument'
import Share from '@/models/Share'

/**
 * Create a new share document
 *
 * @param fileId - The ID of the file to share
 * @param userId - The ID of the user to share the file with
 * @returns The share document
 */
export const createShare = async (fileId: string, userId: string): Promise<ShareDocument | void> => {
    await connectToDb()
    if (!fileId || !userId) {
        throw new Error('Missing required parameters')
    }

    try {
        const share = new Share({
            fileId: fileId,
            userId: userId,
        })
        await share.save()

        return share
    } catch (error) {
        throw new Error('Error creating share')
    }
}
