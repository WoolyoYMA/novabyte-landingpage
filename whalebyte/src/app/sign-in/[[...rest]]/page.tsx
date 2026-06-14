import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <SignIn />
    </div>
  );
}
