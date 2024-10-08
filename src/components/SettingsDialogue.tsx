'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { User, Mail, Key } from 'lucide-react'

interface SettingsDialogProps {
    mongoId: string
    name: string
    email: string
    onSave: () => void
    settingsTriggerRef: React.RefObject<HTMLButtonElement>
    settingsInputRef: React.RefObject<HTMLInputElement>
}

export function SettingsDialog({
    mongoId,
    name,
    email,
    onSave,
    settingsTriggerRef,
    settingsInputRef,
}: SettingsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button ref={settingsTriggerRef} className="hidden">
                    Edit Account Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Account Settings</DialogTitle>
                </DialogHeader>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSave()
                    }}
                >
                    <div className="space-y-2">
                        <Label htmlFor="userId" className="text-sm font-medium text-gray-700">
                            User ID
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Key className="h-4 w-4 text-gray-500" />
                            <Input
                                id="userId"
                                type="text"
                                disabled={true}
                                value={mongoId}
                                className="bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Account Name
                        </Label>
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <Input
                                id="name"
                                ref={settingsInputRef}
                                type="text"
                                placeholder={name}
                                className="bg-white text-gray-800"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <Input
                                id="email"
                                type="email"
                                disabled={true}
                                value={email}
                                className="bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full border bg-blue-600 text-white hover:bg-blue-700">
                        Save Changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
