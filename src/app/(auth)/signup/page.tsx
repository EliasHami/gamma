import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <section className="mx-auto flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
    <SignUp path="/signup" routing="path" signInUrl="/signin" />
  </section>
}