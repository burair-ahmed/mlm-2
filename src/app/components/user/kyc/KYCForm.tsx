'use client'

import { useState, } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { SimpleCalendar } from '@/components/ui/simple-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function KYCForm({ kyc }: { kyc?: any }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const isApproved = kyc?.status === 'approved'
  const [fullName, setFullName] = useState(kyc?.fullName || '')
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    kyc?.dateOfBirth ? new Date(kyc.dateOfBirth) : undefined
  )
  const [address, setAddress] = useState(kyc?.address || '')
  const [idType, setIdType] = useState(kyc?.idType || '')
  const [idNumber, setIdNumber] = useState(kyc?.idNumber || '')
  const [documents, setDocuments] = useState<string[]>(kyc?.documents || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const base64Promises = Array.from(files).map(file =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    )

    try {
      const results = await Promise.all(base64Promises)
      setDocuments(results)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to read files')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !dateOfBirth || !address || !idType || !idNumber || documents.length === 0) {
      return toast.error('Please fill in all fields and upload documents')
    }

    setIsSubmitting(true)

    const payload = {
      fullName,
      dateOfBirth,
      address,
      idType,
      idNumber,
      documents,
    }

    try {
      const res = await fetch('/api/users/kyc/submit', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (res.ok) {
        toast.success('KYC submitted successfully')
      } else {
        toast.error(result.error || 'Submission failed')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-muted rounded-2xl shadow-md">
      <div className="grid gap-4">
        <div>
          <Label>Full Name (As Per Documents)</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isApproved}
          />
        </div>

        <div>
          <Label>Date of Birth (As Per Documents)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateOfBirth && "text-muted-foreground")}
                disabled={isApproved}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            {!isApproved && (
              <PopoverContent className="w-auto p-0">
                <SimpleCalendar selected={dateOfBirth} onSelect={setDateOfBirth} />
              </PopoverContent>
            )}
          </Popover>
        </div>

        <div>
          <Label>Address (As Per Documents)</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isApproved}
          />
        </div>

        <div>
          <Label>ID Type</Label>
          <Select value={idType} onValueChange={setIdType} disabled={isApproved}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select ID Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="National ID">National ID</SelectItem>
              <SelectItem value="Passport">Passport</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>ID Number</Label>
          <Input
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            disabled={isApproved}
          />
        </div>

        <div>
          <Label>Upload Documents</Label>
          <Input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            disabled={isApproved}
          />
          {documents.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {documents.length} file(s) {isApproved ? 'submitted' : 'selected'}
            </p>
          )}
        </div>
      </div>

      {!isApproved && (
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit KYC'}
        </Button>
      )}
    </form>
  )
}
