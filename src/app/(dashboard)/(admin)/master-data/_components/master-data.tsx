import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MASTER_POS, MASTER_PRODUCT } from "@/constants/master-data.constant";
import Link from "next/link";

export default function MasterData() {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your product</CardDescription>
        </CardHeader>
        <CardContent className="w-full flex flex-wrap gap-6 overflow-hidden">
          {MASTER_PRODUCT.map((product, index) => (
            <div key={`product-${index}`}>
              <Link href={product.url}>
                <Button className="cursor-pointer text-lg py-6 w-[120px] ">
                  {product.title}
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Point of Sale</CardTitle>
          <CardDescription>Manage your POS</CardDescription>
        </CardHeader>
        <CardContent className="w-full flex flex-wrap gap-6 overflow-hidden">
          {MASTER_POS.map((item, index) => (
            <div key={`item-${index}`}>
              <Link href={item.url}>
                <Button className="cursor-pointer text-lg py-6 w-[120px] ">
                  {item.title}
                </Button>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
