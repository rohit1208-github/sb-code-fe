'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCountries } from '@/hooks/useCountries'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

export default function CountriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    countries,
    isLoading,
    error,
    deleteCountry,
    isDeleting,
  } = useCountries()

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load countries",
      })
    }
  }, [error, toast])

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        await deleteCountry(id)
        toast({
          title: "Success",
          description: "Country deleted successfully",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete country",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            Loading countries...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || "Failed to load countries"}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Countries</CardTitle>
        <Button
          onClick={() => router.push('/admin/sb-management/countries/new')}
        >
          Add Country
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries?.map((country) => (
              <TableRow key={country.id}>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.code}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      country.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {country.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/sb-management/countries/${country.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(country.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!countries?.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No countries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 