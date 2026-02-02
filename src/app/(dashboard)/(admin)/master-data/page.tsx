import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          </CardHeader>
          <CardContent className="w-full flex flex-wrap gap-4">
            {card.contents.map((content, contentIndex) => {
              const Icon = content?.icon;
              return (
                <Link href={content.url} key={`item-${contentIndex}`}>
                  <Card className="max-w-xs min-h-32 hover:shadow-lg transition-shadow hover:bg-muted/60 ">
                    <CardContent>
                      <h1 className="font-semibold flex items-center gap-2">
                        {Icon && <Icon className=" text-primary size-5" />}
                        {content.title}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-2">
                        {content?.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
