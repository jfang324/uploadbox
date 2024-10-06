'use client'
import HomePage from '@/components/HomePage'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
    const { user, error, isLoading } = useUser()

    return user ? (
        <div>
            <div>user.name: {user.name}</div>
            <div>user.email: {user.email}</div>
            <div>user.picture: {user.picture}</div>
            <div>user.sub: {user.sub}</div>
            <div>user.updated_at: {user.updated_at}</div>
            <HomePage />
        </div>
    ) : isLoading ? (
        <div>Loading...</div>
    ) : error ? (
        <div>Error: {error.message}</div>
    ) : (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Welcome to UploadBox</h1>
                <p className="text-lg">Please log in to continue</p>
                <button
                    onClick={() => {
                        window.location.href = '/api/auth/login'
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Log In
                </button>
            </div>
        </div>
    )
}
