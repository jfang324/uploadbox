'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { UserDocument } from '@/interfaces/UserDocument'
import FileList from '@/components/FileList'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from './ui/button'
import { Input } from '@/components/ui/input'
import { File } from 'lucide-react'
import { on } from 'events'
import { mongo, set } from 'mongoose'

// Mock data for the file list
const initialFiles = [
    { id: 1, name: 'Document', extension: 'docx', size: '2.5 MB', owner: 'John Doe' },
    { id: 2, name: 'Spreadsheet', extension: 'xlsx', size: '1.8 MB', owner: 'Jane Smith' },
    { id: 3, name: 'Presentation', extension: 'pptx', size: '5.2 MB', owner: 'Mike Johnson' },
    { id: 4, name: 'Image', extension: 'jpg', size: '3.7 MB', owner: 'Sarah Williams' },
    { id: 5, name: 'Video', extension: 'mp4', size: '15.6 MB', owner: 'Chris Brown' },
    { id: 6, name: 'Text File', extension: 'txt', size: '0.1 MB', owner: 'Emily Davis' },
    { id: 7, name: 'PDF Document', extension: 'pdf', size: '4.3 MB', owner: 'Alex Johnson' },
    // Adding more files to demonstrate scrolling
    ...Array.from({ length: 20 }, (_, i) => ({
        id: i + 9,
        name: `File ${i + 9}`,
        extension: 'txt',
        size: '1.0 MB',
        owner: 'Test User',
    })),
]

const HomePage = () => {
    const { user, error, isLoading } = useUser()
    const [mongoId, setMongoId] = useState<string | undefined>()
    const [email, setEmail] = useState<string | undefined>()
    const [name, setName] = useState<string | undefined>()

    const fileUploadRef = useRef<HTMLButtonElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | undefined>()

    const [files, setFiles] = useState(initialFiles)
    const [searchTerm, setSearchTerm] = useState('')
    const [fileTypeFilter, setFileTypeFilter] = useState('all')
    const [selectedFiles, setSelectedFiles] = useState<number[]>([])
    const [activeSection, setActiveSection] = useState('my-files')

    useEffect(() => {
        const init = async () => {
            if (isLoading || error) {
                return
            }

            if (user) {
                const response = await fetch('/api/users', {
                    method: 'POST',
                })

                if (response.status === 200) {
                    const userDetails: UserDocument = await response.json()

                    setMongoId(userDetails._id as string)
                    setEmail(userDetails.email)
                    setName(userDetails.name || userDetails.email)
                } else {
                    alert('Error fetching user details')
                }
            }
        }

        init()
    }, [user, error, isLoading])

    const fileTypes = useMemo(() => {
        const types = new Set(files.map((file) => file.extension).filter(Boolean))
        return ['all', ...Array.from(types)]
    }, [files])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value
        setSearchTerm(term)
        filterFiles(term, fileTypeFilter)
    }

    const handleFileTypeFilter = (type: string) => {
        setFileTypeFilter(type)
        filterFiles(searchTerm, type)
    }

    const filterFiles = (term: string, type: string) => {
        let filteredFiles = initialFiles

        if (term !== '') {
            try {
                const regex = new RegExp(term, 'i')
                filteredFiles = filteredFiles.filter(
                    (file) =>
                        regex.test(file.name) ||
                        (file.extension && regex.test(file.extension)) ||
                        regex.test(file.owner)
                )
            } catch (error) {
                console.error('Invalid regex:', error)
            }
        }

        if (type !== 'all') {
            filteredFiles = filteredFiles.filter((file) => file.extension === type)
        }

        setFiles(filteredFiles)
    }

    const handleSelectFile = (id: number) => {
        setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]))
    }

    const handleDeleteSelected = () => {
        const remainingFiles = files.filter((file) => !selectedFiles.includes(file.id))
        setFiles(remainingFiles)
        setSelectedFiles([])
    }

    const handleUpload = () => {
        fileUploadRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0])
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const formData = new FormData()

        if (mongoId && file) {
            formData.append('mongoId', mongoId as string)
            formData.append('file', file as File)

            const response = await fetch('/api/files', {
                method: 'POST',
                body: formData,
            })

            console.log(formData)

            if (response.status === 200) {
                const savedFile = await response.json()

                console.log(savedFile)

                window.alert(`File uploaded successfully! File ID: ${savedFile._id}`)
            }
        } else {
            window.alert('Please fill in all fields')
        }
    }

    const handleLogout = () => {
        window.location.href = '/api/auth/logout'
    }

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            <FileList
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                fileTypeFilter={fileTypeFilter}
                handleFileTypeFilter={handleFileTypeFilter}
                fileTypes={fileTypes}
                files={files}
                selectedFiles={selectedFiles}
                handleSelectFile={handleSelectFile}
                handleDeleteSelected={handleDeleteSelected}
                handleUpload={handleUpload}
                handleLogout={handleLogout}
            />
            <Dialog>
                <DialogTrigger asChild>
                    <Button ref={fileUploadRef} className="hidden">
                        Upload
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload File</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
                                User ID
                            </Label>
                            <Input
                                id="userId"
                                type="text"
                                disabled={true}
                                value={mongoId}
                                className="bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file" className="text-sm font-medium text-gray-700">
                                File
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-500"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <File className="h-4 w-4 mr-2" />
                                    Choose File
                                </Button>
                                <span className="text-sm text-gray-500">{file ? file.name : 'No file chosen'}</span>
                            </div>
                            <Input
                                id="file"
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Button
                            type="button"
                            className="w-full border bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleSubmit}
                        >
                            Upload
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default HomePage
