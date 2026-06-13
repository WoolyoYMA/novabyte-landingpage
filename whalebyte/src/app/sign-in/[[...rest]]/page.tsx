import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
      <SignIn 
        redirectUrl="/dashboard"
        signUpUrl="/sign-up"
        appearance={{
          variables: {
            colorPrimary: '#000000',
          }
        }}
      />
    </div>
  );
}