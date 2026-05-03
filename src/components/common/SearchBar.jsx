import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = ({ className = "" }) => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/courses?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-muted/30 hover:bg-muted/50 focus-within:bg-background focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 focus-within:shadow-md transition-all duration-300 ${className}`}
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search for courses..."
        className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
      />
      <button
        type="submit"
        className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-pointer"
      >
        <Search size={14} />
      </button>
    </form>
  );
};

export default SearchBar;
