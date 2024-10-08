import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'
import { createFile } from '@/services/fileService'
import { getUserById } from '@/services/userService'

/**
 * POST /api/files
 *
 * Create a new file in the database and S3 bucket
 */
const postHandler = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    try {
        const session = await getSession(req, res)
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const formData: FormData = await req.formData()
        const file = formData.get('file')

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'File missing' }, { status: 400 })
        }

        const user = await getUserById(session.user.sub)
        if (!user || !user._id) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const newFile = await createFile(file.name, file.type, file.size, user._id.toString())

        return NextResponse.json(newFile, { status: 200 })
    } catch (error: any) {
        console.error('Error creating file:', error.message || error)
        return NextResponse.json({ error: error.message || 'Error creating file' }, { status: 500 })
    }
}

// wrap in withApiAuthRequired to guarentee session is set
const POST = withApiAuthRequired(postHandler as unknown as NextApiHandler)

export { POST }
