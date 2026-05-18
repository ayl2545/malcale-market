import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold text-center">Join malcale</h1>
      <p className="text-center text-[color:var(--muted-foreground)] mt-1">
        Free to join. Start selling in minutes.
      </p>
      <AuthForm mode="signup" />
      <p className="text-center text-sm mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[color:var(--primary)] font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
