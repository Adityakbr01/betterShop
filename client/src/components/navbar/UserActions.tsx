import Link from "next/link";
import { IoBagOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";

interface UserActionsProps {
  onCartClick: () => void;
}

export default function UserActions({ onCartClick }: UserActionsProps) {
  return (
    <div className="flex items-center gap-4 flex-1 justify-end">
      <Link href="/account" aria-label="Account">
        <CiUser size={22} aria-hidden="true" />
      </Link>
      <button
        onClick={onCartClick}
        className="relative"
        aria-label="Open cart"
      >
        <IoBagOutline size={22} aria-hidden="true" />
      </button>
    </div>
  );
}
