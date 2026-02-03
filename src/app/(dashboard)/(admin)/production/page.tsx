import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRODUCTION_CARD } from "@/constants/production.constant";
import Link from "next/link";

export const metadata = {
  title: "LEV | Production",
};

export default function InventoryPage() {
  return (
    <Card className="w-full">
      <CardContent className="w-full flex flex-wrap gap-4">
        {PRODUCTION_CARD.map((card, cardIndex) => {
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
