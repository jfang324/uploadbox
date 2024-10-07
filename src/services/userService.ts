import connectToDb from '@/config/db'
import { UserDocument } from '@/interfaces/UserDocument'
import User from '@/models/User'

/**
 * Create a new user if they don't exist and return the user document
 *
 * @param email - The email address of the user
 * @param id - The id of the user
 * @returns The user document
 */
export const createIfNewUser = async (email: string, id: string): Promise<UserDocument | void> => {
    await connectToDb()
    if (!email || !id) {
        throw new Error('Missing required parameters')
    }

    const existingUser = await User.findOne({
        id: id,
    })

    if (existingUser) {
        return existingUser
    } else {
        try {
            const newUser = new User({
                email: email,
                id: id,
            })
            await newUser.save()

            return newUser
        } catch (error) {
            console.error(error)
            throw new Error('Error creating user')
        }
    }
}

/**
 * Get a user by their id
 *
 * @param id - The id of the user
 * @returns The user document
 */
export const getUserById = async (id: string): Promise<UserDocument | void> => {
    await connectToDb()
    if (!id) {
        throw new Error('No user id provided')
    }

    try {
        const user = await User.findOne({
            id: id,
        })

        return user
    } catch (error) {
        throw new Error('Error getting user')
    }
}
