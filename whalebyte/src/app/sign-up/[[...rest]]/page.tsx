import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
      <SignUp 
        redirectUrl="/dashboard"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: '#000000',
          }
        }}
      />
    </div>
  );
}