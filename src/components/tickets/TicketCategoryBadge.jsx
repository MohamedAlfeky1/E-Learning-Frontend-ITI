import { TICKET_CATEGORIES } from "@/data/ticketCategories";

const TicketCategoryBadge = ({ category }) => {
  const cat = TICKET_CATEGORIES.find((c) => c.value === category);

  if (!cat) return null;

  const Icon = cat.icon;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cat.color}`}>
      <Icon size={14} />
      {cat.label}
    </div>
  );
};

export default TicketCategoryBadge;