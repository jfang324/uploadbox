import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { createIfNewUser } from '@/services/userService'

const POST = withApiAuthRequired(async (req: Request): Promise<Response> => {
    const requestBody = await req.json()

    if (!requestBody || !('email' in requestBody)) {
        return new Response('Invalid request body', { status: 400 })
    }

    try {
        const user = await createIfNewUser(requestBody.email)

        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error: any) {
        return new Response(JSON.stringify(error.message), { status: 500 })
    }
})

export { POST }
