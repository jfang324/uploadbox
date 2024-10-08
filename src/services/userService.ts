import connectToDb from '@/config/db'
import { UserDocument } from '@/interfaces/UserDocument'
import User from '@/models/User'

/**
 * Create a new user if they don't exist and return the user document
 *
 * @param id - The id of the user. This is user.sub from auth0
 * @param name - The name of the user
 * @returns The user document
 */
export const createIfNewUser = async (id: string, email: string): Promise<UserDocument> => {
    if (!email || !id) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()
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
            console.error('Error creating new user:', error)
            throw new Error('Error creating new user')
        }
    }
}

/**
 * Change the name of the user with the given id
 *
 * @param id - The id of the user. This is user.sub from auth0
 * @param name - The new name of the user
 * @returns The updated user document
 */
export const changeUserName = async (id: string, name: string): Promise<UserDocument> => {
    if (!id || !name) {
        throw new Error('Missing required parameters')
    }

    await connectToDb()

    try {
        const user = await User.findOneAndUpdate(
            {
                id: id,
            },
            {
                name: name,
            },
            {
                new: true,
            }
        )

        return user
    } catch (error) {
        console.error('Error changing user name:', error)
        throw new Error('Error changing user name')
    }
}

/**
 * Get a user by their id
 *
 * @param id - The id of the user
 * @returns The user document
 */
export const getUserById = async (id: string): Promise<UserDocument> => {
    if (!id) {
        throw new Error('Missing id')
    }

    await connectToDb()

    try {
        const user = await User.findOne({
            id: id,
        })

        return user
    } catch (error) {
        console.error('Error getting user:', error)
        throw new Error('Error getting user')
    }
}
