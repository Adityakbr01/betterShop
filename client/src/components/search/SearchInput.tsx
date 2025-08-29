import { CommandInput } from "@/components/ui/command";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Search products..." 
}: SearchInputProps) {
  return (
    <div className="flex items-center border-b px-3 py-3">
      <CommandInput
        value={value}
        onValueChange={onChange}
        placeholder={placeholder}
        className="flex h-11 w-full placeholder:font-NeuMechina rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}
