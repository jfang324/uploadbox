'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Download, Share2 } from 'lucide-react'

interface FileEntryProps {
    id: number
    name: string
    extension: string
    size: string
    owner: string
    isSelected: boolean
    onSelect: (id: number) => void
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
                            {size} • Owned by {owner}
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
