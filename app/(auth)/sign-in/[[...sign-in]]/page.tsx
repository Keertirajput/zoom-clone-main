import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/home"
      />
    </main>
  );
}
