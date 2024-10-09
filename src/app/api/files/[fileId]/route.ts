import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'
import { deleteFile, getFileById } from '@/services/fileService'
import { getUserById } from '@/services/userService'
import { isShared } from '@/services/shareService'
import { deleteS3File, getS3PresignedUrl } from '@/services/s3Service'

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
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match file ownerId' },
                { status: 403 }
            )
        }

        const deleteResult = await deleteFile(file._id.toString())
        const deleteS3Result = await deleteS3File(params.fileId)
        if (!deleteS3Result) {
            return NextResponse.json({ error: 'Failed to delete file from S3' }, { status: 500 })
        }

        return NextResponse.json(
            { message: `File ${params.fileId} deleted successfully. Deleted: ${deleteResult}` },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error deleting file:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error deleting file' }, { status: 500 })
    }
}

const getHandler = async (
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
        const isSharedResult = await isShared(userMongoId, params.fileId)

        if (fileOwnerMongoId !== userMongoId && !isSharedResult) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match file ownerId' },
                { status: 403 }
            )
        }

        const signedUrl = await getS3PresignedUrl(params.fileId)
        if (!signedUrl) {
            return NextResponse.json({ error: 'Failed to get S3 presigned URL' }, { status: 500 })
        }

        return NextResponse.json(signedUrl, { status: 200 })
    } catch (error: any) {
        console.error('Error getting file:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error getting file' }, { status: 500 })
    }
}

// wrap in withApiAuthRequired to guarentee session is set
const DELETE = withApiAuthRequired(deleteHandler as unknown as NextApiHandler)
const GET = withApiAuthRequired(getHandler as unknown as NextApiHandler)

export { DELETE, GET }
