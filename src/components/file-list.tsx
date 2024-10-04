'use client'

import { useState, useRef, useMemo } from 'react'
import { LeftColumn } from './left-column'
import { MainContent } from './main-content'

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

export function FileListComponent() {
    const [files, setFiles] = useState(initialFiles)
    const [searchTerm, setSearchTerm] = useState('')
    const [fileTypeFilter, setFileTypeFilter] = useState('all')
    const [selectedFiles, setSelectedFiles] = useState<number[]>([])
    const [activeSection, setActiveSection] = useState('my-files')
    const fileInputRef = useRef<HTMLInputElement>(null)

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
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const newFile = {
                id: files.length + 1,
                name: file.name.split('.').slice(0, -1).join('.'),
                extension: file.name.split('.').pop() || '',
                size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                owner: 'Current User',
            }
            setFiles((prev) => [...prev, newFile])
        }
    }

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logging out...')
    }

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            <LeftColumn
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                handleUpload={handleUpload}
                handleLogout={handleLogout}
            />
            <MainContent
                activeSection={activeSection}
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                fileTypeFilter={fileTypeFilter}
                handleFileTypeFilter={handleFileTypeFilter}
                fileTypes={fileTypes}
                files={files}
                selectedFiles={selectedFiles}
                handleSelectFile={handleSelectFile}
                handleDeleteSelected={handleDeleteSelected}
            />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
    )
}
