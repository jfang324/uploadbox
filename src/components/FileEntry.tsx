'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Download, Share2 } from 'lucide-react'

/**
 * A single file entry in the file list
 *
 * @param id - The unique identifier of the file. Likely the hashed filename
 * @param name - The name of the file
 * @param extension - The file extension
 * @param size - The size of the file in bytes
 * @param owner - The owner of the file
 * @param isSelected - Whether the file is selected for deletion
 * @param onSelect - A function to handle file selection
 */
interface FileEntryProps {
    id: string
    name: string
    extension: string
    size: number
    owner: string
    isSelected: boolean
    onSelect: (id: string) => void
}

const FileEntry = ({ id, name, extension, size, owner, isSelected, onSelect }: FileEntryProps) => {
    return (
        <li className="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
            <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                    <Checkbox
                        className="my-auto"
                        id={`file-${id}`}
                        checked={isSelected}
                        onCheckedChange={() => onSelect(id)}
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {name}
                            {extension ? `.${extension}` : ''}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {(size / (1024 * 1024)).toFixed(2)} MB • Owned by {owner}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                    <Button variant="outline" className="flex items-center space-x-1">
                        <Download size={16} />
                        <span>Download</span>
                    </Button>
                    <Button variant="outline" className="flex items-center space-x-1">
                        <Share2 size={16} />
                        <span>Share</span>
                    </Button>
                </div>
            </div>
        </li>
    )
}

export default FileEntry
