'use client'

import { Button } from "@/components/ui/button"
import { FolderOpen, Share2, Trash, Upload, LogOut } from 'lucide-react'

interface LeftColumnProps {
  activeSection: string
  setActiveSection: (section: string) => void
  handleUpload: () => void
  handleLogout: () => void
}

export function LeftColumn({ activeSection, setActiveSection, handleUpload, handleLogout }: LeftColumnProps) {
  return (
    <div className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">File Manager</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveSection('my-files')}
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${activeSection === 'my-files' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FolderOpen size={20} />
                <span>My Files</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('shared')}
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${activeSection === 'shared' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Share2 size={20} />
                <span>Shared with Me</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('deleted')}
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${activeSection === 'deleted' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Trash size={20} />
                <span>Deleted</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleUpload}
                className="flex items-center space-x-2 w-full p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Upload size={20} />
                <span>Upload File</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  )
}