'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FileDocument } from '@/interfaces/FileDocument'
import {
    retrieveUserDetails,
    retrieveUserFiles,
    uploadFile,
    deleteFile,
    changeUserName,
    initializeUserDetails,
} from '@/lib/utils'
import FileList from '@/components/FileList'
import UploadDialog from './UploadDialogue'
import { SettingsDialog } from './SettingsDialogue'
import { Button } from '@/components/ui/button'

const HomePage = () => {
    //state associated with the account
    const { user, error, isLoading } = useUser()
    const [mongoId, setMongoId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    //state & refs associated with file uploads
    const fileUploadTriggerRef = useRef<HTMLButtonElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | undefined>()

    //refs associated with the account settings
    const settingsTriggerRef = useRef<HTMLButtonElement>(null)
    const settingsInputRef = useRef<HTMLInputElement>(null)

    //state associated with the file list & visibility
    const [files, setFiles] = useState<(FileDocument & { owner: string })[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [fileTypeFilter, setFileTypeFilter] = useState('all')
    const [visibleFiles, setVisibleFiles] = useState<(FileDocument & { owner: string })[]>([])

    //state associated with file selection
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
    const [activeSection, setActiveSection] = useState('my-files')

    //initialize user details and files
    useEffect(() => {
        const init = async () => {
            if (isLoading || error) {
                return
            }

            if (user) {
                try {
                    const userDetails = await retrieveUserDetails()
                    initializeUserDetails(setMongoId, setName, setEmail, userDetails)
                    const userFiles = await retrieveUserFiles(userDetails._id as string)
                    setFiles(userFiles)
                    setVisibleFiles(userFiles)
                } catch (error) {
                    alert(error)
                }
            } else {
                alert('Error fetching user details')
            }
        }
        init()
    }, [user, error, isLoading])

    //calculates the available file types
    const fileTypes = useMemo(() => {
        const types = new Set(files.map((file) => file.extension).filter(Boolean))
        return ['all', ...Array.from(types)]
    }, [files])

    //keeps visible files updated
    useEffect(() => {
        const filterFiles = (term: string, type: string) => {
            let filteredFiles = files

            if (term !== '') {
                try {
                    const regex = new RegExp(term, 'i')
                    filteredFiles = filteredFiles.filter(
                        (file) => regex.test(file.name) || regex.test(file.extension) || regex.test(file.owner)
                    )
                } catch (error) {
                    console.error('Invalid regex:', error)
                }
            }

            if (type !== 'all') {
                filteredFiles = filteredFiles.filter((file) => file.extension === type)
            }

            setVisibleFiles(filteredFiles)
        }

        filterFiles(searchTerm, fileTypeFilter)
    }, [searchTerm, fileTypeFilter, files])

    /**
     * Handles the file upload by triggering the popup
     */
    const handleUpload = () => {
        fileUploadTriggerRef.current?.click()
    }

    /**
     * Updates the file state when a file is selected
     *
     * @param event - The file change event from the file upload input
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0])
    }

    /**
     * Handles the actual file upload and refreshing files
     */
    const handleSubmit = async () => {
        if (mongoId && file) {
            try {
                const fileDetails = await uploadFile(file)
                if (fileDetails) {
                    const updatedFiles = await retrieveUserFiles(mongoId)
                    if (updatedFiles) {
                        setFiles(updatedFiles)
                    }
                }
            } catch (error) {
                alert(error)
            }
        } else {
            alert('Please fill in all fields')
        }
    }

    /**
     * Handles file selection
     *
     * @param id - The mongoId of the file
     */
    const handleSelectFile = (id: string) => {
        const existingSet = new Set(selectedFiles)

        if (existingSet.has(id)) {
            existingSet.delete(id)
        } else {
            existingSet.add(id)
        }

        setSelectedFiles(existingSet)
    }

    /**
     * Handles file deletion
     */
    const handleDeleteSelected = async () => {
        if (mongoId && selectedFiles.size > 0) {
            try {
                await Promise.all(Array.from(selectedFiles).map((fileId) => deleteFile(fileId)))
                const updatedFiles = await retrieveUserFiles(mongoId)
                if (updatedFiles) {
                    setFiles(updatedFiles)
                }
                setSelectedFiles(new Set())
            } catch (error) {
                alert(error)
            }
        } else {
            alert(`Error deleting files. ${selectedFiles.size} files selected. mongoId: ${mongoId}`)
        }
    }

    /**
     * Handles user name change
     */
    const handleChangeName = async () => {
        const name = settingsInputRef.current?.value
        if (name) {
            try {
                const userDetails = await changeUserName(name)
                if (userDetails) {
                    initializeUserDetails(setMongoId, setName, setEmail, userDetails)
                    const userFiles = await retrieveUserFiles(userDetails._id as string)
                    if (userFiles) {
                        setFiles(userFiles)
                        setVisibleFiles(userFiles)
                    }
                }
            } catch (error) {
                alert(error)
            }
        }
    }

    /**
     * Handles user logout
     */
    const handleLogout = () => {
        window.location.href = '/api/auth/logout'
    }

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            <FileList
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                searchTerm={searchTerm}
                handleSearch={(e) => setSearchTerm(e.target.value)}
                fileTypeFilter={fileTypeFilter}
                handleFileTypeFilter={(type) => setFileTypeFilter(type)}
                fileTypes={fileTypes}
                files={visibleFiles}
                selectedFiles={selectedFiles}
                handleSelectFile={handleSelectFile}
                handleDeleteSelected={handleDeleteSelected}
                handleUpload={handleUpload}
                handleLogout={handleLogout}
            />
            <UploadDialog
                mongoId={mongoId}
                file={file}
                fileInputRef={fileInputRef}
                fileUploadTriggerRef={fileUploadTriggerRef}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
            />
            <SettingsDialog
                mongoId={mongoId}
                name={name}
                email={email}
                onSave={handleChangeName}
                settingsTriggerRef={settingsTriggerRef}
                settingsInputRef={settingsInputRef}
            />
            <Button
                onClick={() => {
                    settingsTriggerRef.current?.click()
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
            >
                Edit Account Settings
            </Button>
        </div>
    )
}

export default HomePage
