import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { createFile } from '@/services/fileService'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiHandler } from 'next'

/**
 * POST /api/files
 *
 * Create a new file in the database and S3 bucket
 */
const unprotectedRouteHandler = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    const formData: FormData = await req.formData()
    const mongoId = formData.get('mongoId')
    const file = formData.get('file')

    if (!(file instanceof File) || typeof mongoId !== 'string') {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    try {
        const fileDocument = await createFile(file.name, file.type, file.size, mongoId)

        return NextResponse.json(fileDocument, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error creating file' }, { status: 500 })
    }
}

const POST = withApiAuthRequired(unprotectedRouteHandler as unknown as NextApiHandler)

export { POST }
