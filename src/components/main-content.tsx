'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trash2 } from 'lucide-react'
import { FileEntry } from './file-entry'

interface MainContentProps {
  activeSection: string
  searchTerm: string
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileTypeFilter: string
  handleFileTypeFilter: (type: string) => void
  fileTypes: string[]
  files: Array<{ id: number; name: string; extension?: string; size: string; owner: string }>
  selectedFiles: number[]
  handleSelectFile: (id: number) => void
  handleDeleteSelected: () => void
}

export function MainContent({
  activeSection,
  searchTerm,
  handleSearch,
  fileTypeFilter,
  handleFileTypeFilter,
  fileTypes,
  files,
  selectedFiles,
  handleSelectFile,
  handleDeleteSelected
}: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 bg-blue-600">
        <h1 className="text-2xl font-bold text-white mb-4">
          {activeSection === 'my-files' && 'My Files'}
          {activeSection === 'shared' && 'Shared with Me'}
          {activeSection === 'deleted' && 'Deleted Files'}
        </h1>
        <div className="flex space-x-4 mb-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search files (supports regex)"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white text-gray-800 placeholder-gray-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          </div>
          <Select value={fileTypeFilter} onValueChange={handleFileTypeFilter}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {fileTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-white">{files.length} files</p>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteSelected}
            disabled={selectedFiles.length === 0}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <ul className="divide-y divide-gray-200">
          {files.map(file => (
            <FileEntry
              key={file.id}
              id={file.id}
              name={file.name}
              extension={file.extension}
              size={file.size}
              owner={file.owner}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={handleSelectFile}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}