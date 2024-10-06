// import mongoose, { Schema } from 'mongoose'
// import { FileDocument } from '@/interfaces/FileDocument'

// const fileSchema: Schema<FileDocument> = new Schema({
//     fileId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         unique: true,
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     extension: {
//         type: String,
//         required: true,
//     },
//     size: {
//         type: Number,
//         required: true,
//     },
//     ownerId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
// })

// fileSchema.pre('save', async function (next) {
//     if (!this.fileId) {
//         this.fileId = this._id as mongoose.Types.ObjectId
//     }
//     next()
// })

// const File = mongoose.model<FileDocument>('File', fileSchema)
// export default File
