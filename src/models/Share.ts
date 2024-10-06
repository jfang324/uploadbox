// import mongoose, { Schema } from 'mongoose'
// import { ShareDocument } from '@/interfaces/ShareDocument'

// const shareSchema: Schema<ShareDocument> = new Schema({
//     fileId: {
//         type: Schema.Types.ObjectId,
//         ref: 'File',
//         required: true,
//     },
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
// })

// shareSchema.pre('save', async function (next) {
//     if (!this.fileId) {
//         this.fileId = this._id as mongoose.Types.ObjectId
//     }
//     next()
// })

// const Share = mongoose.model<ShareDocument>('Share', shareSchema)
// export default Share
