import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { UserDocument } from '@/interfaces/UserDocument'
import { FileDocument } from '@/interfaces/FileDocument'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Fetches the user details and returns the user document if successful
 *
 * @returns The user document
 */
export const retrieveUserDetails = async (): Promise<UserDocument> => {
    const response = await fetch('/api/users', {
        method: 'POST',
    })

    if (response.status === 200) {
        const userDetails: UserDocument = await response.json()

        return userDetails
    } else {
        throw new Error(`Error fetching user details. Status: ${response.status}`)
    }
}

/**
 * Initializes the user details
 *
 * @param setMongoId - A function to set state for the mongoId
 * @param setName - A function to set state for the name
 * @param setEmail - A function to set state for the email
 * @param userDetails - The user document
 */
export const initializeUserDetails = (
    setMongoId: (mongoId: string) => void,
    setName: (name: string) => void,
    setEmail: (email: string) => void,
    userDetails: UserDocument
) => {
    if (userDetails) {
        setMongoId(userDetails._id as string)
        setName(userDetails.name || userDetails.email)
        setEmail(userDetails.email)
    } else {
        throw new Error('Error initializing user details')
    }
}

/**
 * Fetches the user files and returns the file documents
 *
 * @param userId - The mongoId of the user
 * @returns An array of file documents + owner
 */
export const retrieveUserFiles = async (userId: string): Promise<(FileDocument & { owner: string })[]> => {
    if (!userId) {
        throw new Error('Missing userId')
    }

    const response = await fetch(`/api/users/${userId}/files`, {
        method: 'GET',
    })

    if (response.status === 200) {
        const userFiles = await response.json()

        return userFiles
    } else {
        throw new Error(`Error fetching user files. Status: ${response.status}`)
    }
}

/**
 * Uploads a file to the server
 *
 * @param file - The file to upload
 * @returns The file document
 */
export const uploadFile = async (file: File): Promise<FileDocument> => {
    if (!file) {
        throw new Error('Missing file')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
    })

    if (response.status === 200) {
        const savedFile = await response.json()

        return savedFile
    } else {
        throw new Error(`Error uploading file. Status: ${response.status}`)
    }
}

/**
 * Deletes the file with the given id
 *
 * @param fileId - The mongoId of the file
 * @returns The result from the delete operation
 */
export const deleteFile = async (fileId: string) => {
    if (!fileId) {
        throw new Error('Missing fileId')
    }

    const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
    })

    if (response.status === 200) {
        const deletedFile = await response.json()

        return deletedFile
    } else {
        throw new Error(`Error deleting file. Status: ${response.status}`)
    }
}

/**
 * Change the name of the user with the given id
 *
 * @param name - The new name of the user
 * @returns The updated user document
 */
export const changeUserName = async (name: string) => {
    if (!name) {
        throw new Error('Missing name')
    }

    const response = await fetch('/api/users', {
        method: 'PATCH',
        body: JSON.stringify({
            name: name,
        }),
    })

    if (response.status === 200) {
        const updatedUser = await response.json()

        return updatedUser
    } else {
        throw new Error(`Error changing user name. Status: ${response.status}`)
    }
}
