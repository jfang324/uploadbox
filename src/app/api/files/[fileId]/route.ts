import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'
import { deleteFile, getFileById } from '@/services/fileService'
import { getUserById } from '@/services/userService'

/**
 * DELETE /api/files/:fileId
 *
 * Delete a file from the database and S3 bucket
 */
const deleteHandler = async (
    req: NextRequest,
    { params }: { params: { fileId: string } },
    res: NextResponse
): Promise<NextResponse> => {
    try {
        const session = await getSession(req, res)
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const user = await getUserById(session.user.sub)
        if (!user || !user._id) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const file = await getFileById(params.fileId)
        if (!file || !file._id) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        const userMongoId = user._id.toString()
        const fileOwnerMongoId = file.ownerId.toString()

        if (fileOwnerMongoId !== userMongoId) {
            return NextResponse.json({ error: 'Unauthorized: userId does not match file ownerId' }, { status: 403 })
        }

        const deleteResult = await deleteFile(params.fileId)

        return NextResponse.json(
            { message: `File ${params.fileId} deleted successfully. Deleted: ${deleteResult}` },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error deleting file:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error deleting file' }, { status: 500 })
    }
}

// wrap in withApiAuthRequired to guarentee session is set
const DELETE = withApiAuthRequired(deleteHandler as unknown as NextApiHandler)

export { DELETE }
