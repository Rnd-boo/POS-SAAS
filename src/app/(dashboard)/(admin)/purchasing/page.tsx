import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PURCHASING_CARD } from "@/constants/purchasing.constant";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "LEVPOS | Purchasing",
};

export default function InventoryPage() {
  return (
    <Card className="w-full">
      <CardContent className="w-full flex flex-wrap gap-4">
        {PURCHASING_CARD.map((card, cardIndex) => {
          const Icon = card?.icon;
          return (
            <Link
              href={card.disabled ? "#" : card.url}
              key={`item-${cardIndex}`}
            >
              <Card
                className={cn(
                  "max-w-xs min-h-32 hover:shadow-lg transition-shadow hover:bg-muted/60 ",
                  { "opacity-50 cursor-not-allowed": card.disabled },
                )}
              >
                <CardContent>
                  <h1 className="font-semibold flex items-center gap-2">
                    {Icon && <Icon className=" text-primary size-5" />}
                    {card.title}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-2">
                    {card?.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
