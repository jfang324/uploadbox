import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'
import { createIfNewUser, changeUserName } from '@/services/userService'

/**
 * POST /api/users
 *
 * Return user details associated with the session, creates a new user if they don't exist
 */
const postHandler = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
        const session = await getSession(req, res)
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const user = session.user
        if (!user || !user.sub || !user.email) {
            return NextResponse.json({ error: 'Invalid user details' }, { status: 422 })
        }

        const accountDetails = await createIfNewUser(user.sub, user.email)

        return NextResponse.json(accountDetails, { status: 200 })
    } catch (error: any) {
        console.error('Error creating user:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error creating user' }, { status: 500 })
    }
}

/**
 * PATCH /api/users
 *
 * Change the name of the user
 */
const patchHandler = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
        const session = await getSession(req, res)
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const requestBody = await req.json()
        if (!requestBody.name) {
            return NextResponse.json({ error: 'Name missing' }, { status: 400 })
        }

        const user = session.user
        if (!user || !user.sub) {
            return NextResponse.json({ error: 'Invalid user details' }, { status: 422 })
        }

        const accountDetails = await changeUserName(user.sub, requestBody.name)

        return NextResponse.json(accountDetails, { status: 200 })
    } catch (error: any) {
        console.error('Error updating user:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error updating user' }, { status: 500 })
    }
}

//wrap in withApiAuthRequired to guarentee session is set
const POST = withApiAuthRequired(postHandler as unknown as NextApiHandler)
const PATCH = withApiAuthRequired(patchHandler as unknown as NextApiHandler)

export { POST, PATCH }
