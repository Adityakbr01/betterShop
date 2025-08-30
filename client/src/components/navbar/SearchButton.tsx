import { Search } from "lucide-react";

interface SearchButtonProps {
  onClick: () => void;
  defaultSearch: string;
}

export default function SearchButton({ onClick, defaultSearch }: SearchButtonProps) {
  return (
    <div className="flex items-center gap-1 flex-1 cursor-pointer">
      <button 
        onClick={onClick} 
        aria-label="Search" 
        className="p-2 hover:opacity-70 transition mr-1"
      >
        <Search size={18} aria-hidden="true" />
      </button>
      <p className="uppercase hidden md:flex font-GeistRegular ">
        {defaultSearch}
      </p>
    </div>
  );
}
