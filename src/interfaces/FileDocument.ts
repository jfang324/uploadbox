import mongoose from 'mongoose'

export interface FileDocument extends mongoose.Document {
    name: string
    extension: string
    size: number
    ownerId: string | mongoose.Types.ObjectId
}
