import { ShoppingBag, UtensilsCrossed, Search, Clock } from "lucide-react";

interface Props {
  icon: "cart" | "orders" | "search" | "profile";
  title: string;
  description?: string;
}

const config = {
  cart: { icon: ShoppingBag, title: "Корзина пуста" },
  orders: { icon: UtensilsCrossed, title: "Заказов пока нет" },
  search: { icon: Search, title: "Ничего не найдено" },
  profile: { icon: Clock, title: "История пуста" },
};

export default function EmptyState({ icon, description, title }: Props) {
  const { icon: Icon, title: defaultTitle } = config[icon];
  return (
    <div className="text-center py-16 md:py-20">
      <Icon size={40} className="mx-auto text-white/10 mb-3" />
      <p className="text-sm font-medium text-white/40">{title || defaultTitle}</p>
      {description && <p className="text-xs text-white/20 mt-1">{description}</p>}
    </div>
  );
}
