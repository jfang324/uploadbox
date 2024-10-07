import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { getUserFiles } from '@/services/fileService'
import { getUserById } from '@/services/userService'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'

type Params = {
    userId: string
}

/*
 * GET /api/users/:userId/files
 *
 * Get all files owned by the user, verifies the user is the one associated with the userId
 */
const unprotectedRouteHandler = async (
    req: NextRequest,
    context: { params: Params },
    res: NextResponse
): Promise<NextResponse> => {
    const requestMongoId = context.params.userId
    const session = await getSession(req, res)

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const user = await getUserById(session.user.sub)
        const userMongoId = user?._id?.toString() || ''

        if (!user || userMongoId !== requestMongoId) {
            return NextResponse.json({ error: 'user does not match provided userId' }, { status: 400 })
        }

        const files = await getUserFiles(userMongoId)

        return NextResponse.json(files, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error getting user files' }, { status: 500 })
    }
}

const GET = withApiAuthRequired(unprotectedRouteHandler as unknown as NextApiHandler)

export { GET }
