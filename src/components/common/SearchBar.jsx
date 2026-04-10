import { Search } from "lucide-react";

const SearchBar = ({ className = "" }) => {
  return (
    <form
      className={`flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-muted/50 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200 ${className}`}
    >
      <Search size={15} className="text-muted-foreground shrink-0" />
      <input
        type="text"
        placeholder="Search courses..."
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
    </form>
  );
};

export default SearchBar;
