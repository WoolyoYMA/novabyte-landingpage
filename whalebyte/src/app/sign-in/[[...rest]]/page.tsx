import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] p-4">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}