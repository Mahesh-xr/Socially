import ModeToggle from "@/components/ModeToggel";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-4">
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign In</Button>
        </SignInButton>

      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>

      <ModeToggle/>
    </div>
  );
}
