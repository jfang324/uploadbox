import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from './ui/button'
import { Input } from '@/components/ui/input'
import { File } from 'lucide-react'

/**
 * The upload dialogue component
 *
 * @param mongoId - The mongoId of the user
 * @param file - The file to upload
 * @param fileInputRef - A ref object for the file input
 * @param fileUploadTriggerRef - A ref object for the file upload button
 * @param handleFileChange - A function to handle file change
 * @param handleSubmit - A function to handle file upload
 */
interface UploadDialogProps {
    mongoId: string | undefined
    file: File | undefined
    fileInputRef: React.RefObject<HTMLInputElement>
    fileUploadTriggerRef: React.RefObject<HTMLButtonElement>
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>
}

const UploadDialog: React.FC<UploadDialogProps> = ({
    mongoId,
    file,
    fileInputRef,
    fileUploadTriggerRef,
    handleFileChange,
    handleSubmit,
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button ref={fileUploadTriggerRef} className="hidden">
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
    )
}

export default UploadDialog
