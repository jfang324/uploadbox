import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'
import { getUserById } from '@/services/userService'
import { getSharedFiles } from '@/services/shareService'

/**
 * GET /api/users/:userId/shared
 *
 * Get all files shared with the user
 */
const getHandler = async (
    req: NextRequest,
    { params }: { params: { userId: string } },
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

        const userMongoId = user._id.toString()
        const filesOwnerMongoId = params.userId

        if (filesOwnerMongoId !== userMongoId) {
            return NextResponse.json(
                { error: 'Unauthorized: requesting userId does not match provided userId' },
                { status: 403 }
            )
        }

        const files = await getSharedFiles(userMongoId)

        return NextResponse.json(files, { status: 200 })
    } catch (error: any) {
        console.error('Error getting user files:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error getting user files' }, { status: 500 })
    }
}

//wrap in withApiAuthRequired to guarentee session is set
const GET = withApiAuthRequired(getHandler as unknown as NextApiHandler)

export { GET }
