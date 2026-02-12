import Link from "next/link";

export default function AdminSignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm card text-center">
        <h1 className="mb-2 text-xl font-semibold text-white">Admin sign up is disabled</h1>
        <p className="mb-6 text-sm text-gray-400">
          Admin accounts are created during initial setup only. No one can sign up as admin through this site.
        </p>
        <p className="mb-6 text-sm text-gray-400">
          If you are the admin, use your existing account to log in. Workers get their accounts from the admin.
        </p>
        <Link href="/login" className="btn-primary inline-block w-full">
          Go to Log in
        </Link>
        <p className="mt-4">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-400">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
