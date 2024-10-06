import mongoose from 'mongoose'

export interface ShareDocument extends mongoose.Document {
    fileId: string | mongoose.Types.ObjectId
    userId: string | mongoose.Types.ObjectId
}
