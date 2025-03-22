import { LoginForm } from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - SB Admin',
  description: 'Login to SB Admin Dashboard',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[400px] text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please sign in to your account
        </p>
      </div>
      <LoginForm />
    </div>
  )
} 