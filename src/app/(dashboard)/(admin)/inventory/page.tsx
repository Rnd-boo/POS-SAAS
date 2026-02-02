import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INVENTORY_CARD } from "@/constants/inventory.constant";
import Link from "next/link";

export const metadata = {
  title: "LEVPOS | Inventory",
};

export default function InventoryPage() {
  return (
    <Card className="w-full">
      <CardContent className="w-full flex flex-wrap gap-4">
        {INVENTORY_CARD.map((card, cardIndex) => {
          const Icon = card?.icon;
          return (
            <Link href={card.url} key={`item-${cardIndex}`}>
              <Card className="max-w-xs min-h-32 hover:shadow-lg transition-shadow hover:bg-muted/60 ">
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
