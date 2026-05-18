import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-center">Welcome back</h1>
      <p className="text-center text-[color:var(--muted-foreground)] mt-1">
        Log in to keep selling and shopping.
      </p>
      <AuthForm mode="login" />
      <p className="text-center text-sm mt-6">
        New here?{" "}
        <Link href="/signup" className="text-[color:var(--primary)] font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}
