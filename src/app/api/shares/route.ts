import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'
import { getFileById } from '@/services/fileService'
import { getUserById, getUserByEmail } from '@/services/userService'
import { createShare, deleteShare } from '@/services/shareService'

/**
 * POST /api/shares
 *
 * Create a new share between the file and the recipient
 */
const postHandler = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
        const session = await getSession(req, res)
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const requestBody = await req.json()
        if (!requestBody.fileId || !requestBody.recipientEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const user = await getUserById(session.user.sub)
        const recipient = await getUserByEmail(requestBody.recipientEmail)
        if (!user || !user._id || !recipient || !recipient._id) {
            return NextResponse.json({ error: `${user ? 'User' : 'Recipient'} not found` }, { status: 404 })
        }

        const file = await getFileById(requestBody.fileId)
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

        const share = await createShare(file._id.toString(), recipient._id.toString())

        return NextResponse.json(share, { status: 200 })
    } catch (error: any) {
        console.error('Error creating share:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error creating share' }, { status: 500 })
    }
}

/**
 * DELETE /api/shares
 *
 * Delete a share between the file and the recipient
 */
const deleteHandler = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
        const session = await getSession(req, res)
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const requestBody = await req.json()
        if (!requestBody.fileId || !requestBody.recipientEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const user = await getUserById(session.user.sub)
        const recipient = await getUserByEmail(requestBody.recipientEmail)
        if (!user || !user._id || !recipient || !recipient._id) {
            return NextResponse.json({ error: `${user ? 'User' : 'Recipient'} not found` }, { status: 404 })
        }

        const file = await getFileById(requestBody.fileId)
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

        const share = await deleteShare(file._id.toString(), recipient._id.toString())

        return NextResponse.json(share, { status: 200 })
    } catch (error: any) {
        console.error('Error deleting share:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error deleting share' }, { status: 500 })
    }
}

// wrap in withApiAuthRequired to guarentee session is set
const POST = withApiAuthRequired(postHandler as unknown as NextApiHandler)
const DELETE = withApiAuthRequired(deleteHandler as unknown as NextApiHandler)

export { POST, DELETE }
