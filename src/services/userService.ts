import connectToDb from '@/config/db'
import { UserDocument } from '@/interfaces/UserDocument'
import User from '@/models/User'

export const createIfNewUser = async (email: string): Promise<UserDocument | void> => {
    await connectToDb()
    if (!email) {
        throw new Error('No email provided when creating user')
    }

    const existingUser = User.findOne({ email: email })

    if (existingUser) {
        return existingUser
    } else {
        try {
            const newUser = new User({ email })
            await newUser.save()

            return newUser
        } catch (error) {
            throw new Error('Error creating user')
        }
    }
}
