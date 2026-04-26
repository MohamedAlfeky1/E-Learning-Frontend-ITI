import { Search } from "lucide-react";

const SearchBar = ({ className = "" }) => {
  return (
    <form
      className={`flex items-center gap-3 px-4 py-2.5 rounded-full border border-border bg-muted/30 hover:bg-muted/50 focus-within:bg-background focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 focus-within:shadow-md transition-all duration-300 ${className}`}
    >
      <Search size={18} className="text-muted-foreground shrink-0 group-focus-within:text-primary transition-colors" />
      <input
        type="text"
        placeholder="Search for courses..."
        className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
      />
    </form>
  );
};

export default SearchBar;
