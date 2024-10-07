import mongoose, { Schema } from 'mongoose'
import { ShareDocument } from '@/interfaces/ShareDocument'

const shareSchema: Schema<ShareDocument> = new Schema({
    fileId: {
        type: Schema.Types.ObjectId,
        ref: 'File',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
})

export default mongoose.models.Share || mongoose.model<ShareDocument>('Share', shareSchema)
