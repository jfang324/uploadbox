import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { createIfNewUser } from '@/services/userService'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'

/**
 * POST /api/users
 *
 * Return user details associated with the session, creates a new user if they don't exist
 */
const unprotectedRouteHandler = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    const session = await getSession(req, res)

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const user = session.user
        const accountDetails = await createIfNewUser(user.email, user.sub)

        return NextResponse.json(accountDetails, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
    }
}

const POST = withApiAuthRequired(unprotectedRouteHandler as unknown as NextApiHandler)

export { POST }
