import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";

export default function DropdownAction({
  menu,
}: {
  menu: {
    label?: string | ReactNode;
    variant?: "destructive" | "default";
    action?: () => void;
    type?: "button" | "link";
    separator?: boolean;
  }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground size-8"
          size="icon"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {menu.map((item, index) => {
          if (item.separator) {
            return (
              <DropdownMenuSeparator
                key={`sep-${index}`}
                className="bg-muted-foreground"
              />
            );
          }

          return (
            <DropdownMenuItem
              key={`item-${index}`}
              variant={item.variant || "default"}
              asChild={item.type === "link"}
              onClick={(e) => {
                e.stopPropagation();
                item.action?.();
              }}
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
