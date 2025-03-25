import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";
import { AuthProtectedLoginPage } from "@/components/auth/AuthProtectedLoginPage";

export const metadata: Metadata = {
  title: "Login - SB Admin",
  description: "Login to SB Admin Dashboard",
};

export default function LoginPage() {
  return (
    <AuthProtectedLoginPage>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-[400px] text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to SB Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Login with SB credentials given by the management
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthProtectedLoginPage>
  );
}
