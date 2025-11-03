import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MASTER_CARD } from "@/constants/master-data.constant";
import Link from "next/link";

export const metadata = {
  title: "POS | Master Data",
};

export default function MasterDataPage() {
  return (
    <>
      {MASTER_CARD.map((card, cardIndex) => (
        <Card className="w-full" key={`card-${cardIndex}`}>
          <CardHeader>
            <CardTitle className="text-lg">{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent className="w-full flex flex-wrap gap-6 overflow-hidden">
            {card.contents.map((content, contentIndex) => (
              <div key={`item-${contentIndex}`}>
                <Link href={content.url}>
                  <Button className="cursor-pointer focus-visible:ring-ring text-primary-foreground bg-primary hover:bg-primary/90 text-lg py-6 min-w-[120px]">
                    {content.title}
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
