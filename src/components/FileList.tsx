'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Trash2, ListCollapse } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import FileEntry from '@/components/FileEntry'
import LeftColumn from '@/components/LeftColumn'
import { FileDocument } from '@/interfaces/FileDocument'

/**
 * The file list component. Consisting of a left column, a search bar, and a list of files
 *
 * @param activeSection - The active section of the left column
 * @param setActiveSection - A function to set the active section of the left column
 * @param searchTerm - The search term entered by the user
 * @param handleSearch - A function to handle search term changes
 * @param fileTypeFilter - The file type filter selected by the user
 * @param handleFileTypeFilter - A function to handle file type filter changes
 * @param fileTypes - An array of all available file types
 * @param files - An array of all files in the system
 * @param selectedFiles - An array of all selected files
 * @param handleSelectFile - A function to handle file selection
 * @param handleDeleteSelected - A function to handle file deletion
 * @param handleUpload - A function to handle file upload
 * @param handleLogout - A function to handle user logout
 */
interface FileListProps {
    activeSection: string
    setActiveSection: (section: string) => void
    searchTerm: string
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
    fileTypeFilter: string
    handleFileTypeFilter: (type: string) => void
    fileTypes: string[]
    files: Array<FileDocument & { owner: string }>
    selectedFiles: Set<string>
    handleSelectFile: (id: string) => void
    handleDeleteSelected: () => void
    handleUpload: () => void
    handleLogout: () => void
}

const FileList = ({
    activeSection,
    setActiveSection,
    searchTerm,
    handleSearch,
    fileTypeFilter,
    handleFileTypeFilter,
    fileTypes,
    files,
    selectedFiles,
    handleSelectFile,
    handleDeleteSelected,
    handleUpload,
    handleLogout,
}: FileListProps) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-5 bg-blue-600">
                <div className="flex space-x-4 mb-4">
                    <div className="relative flex-grow">
                        <Input
                            type="text"
                            placeholder="Search files"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 rounded-md bg-white text-gray-800 placeholder-gray-500"
                        />
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            size={20}
                        />
                    </div>
                    <Select value={fileTypeFilter} onValueChange={handleFileTypeFilter}>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {fileTypes.map((type) => (
                                <SelectItem className="cursor-pointer" key={type} value={type}>
                                    {type === 'all' ? 'All Types' : type.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-between items-center">
                    <Sheet>
                        <SheetTrigger className="border border-black bg-blue-800 text-white p-1">
                            <ListCollapse size={26} />
                        </SheetTrigger>
                        <SheetContent side={'left'} className="bg-white w-full lg:w-1/4 border border-black p-0">
                            <LeftColumn
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                                handleUpload={handleUpload}
                                handleLogout={handleLogout}
                            />
                        </SheetContent>
                    </Sheet>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteSelected}
                        disabled={selectedFiles.size === 0 || activeSection !== 'my-files'}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Delete Selected
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-white">
                <ul className="divide-y divide-gray-200">
                    {files.map((file: FileDocument & { owner: string }) => (
                        <FileEntry
                            key={file?._id as string}
                            id={file?._id as string}
                            name={file.name}
                            extension={file.extension}
                            size={file.size}
                            owner={file.owner}
                            isSelected={selectedFiles.has(file._id as string)}
                            onSelect={handleSelectFile}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default FileList
