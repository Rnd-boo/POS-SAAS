import { Funnel, SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import Link from "next/link";
import { ReactNode } from "react";

export default function PageHeader({
  pathname,
  handleChangeSearch,
  filters,
  setFilters,
  setOpenDialogFilters,
  title,
  DialogCreateComponent,
}: {
  pathname?: string;
  handleChangeSearch: (value: string) => void;
  filters?: Record<string, string>;
  setFilters?: (filters: Record<string, string>) => void;
  setOpenDialogFilters?: (open: boolean) => void;
  title: string;
  DialogCreateComponent?: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold capitalize">
          {title} Management
        </h1>
      </div>
      <div className="mb-2 flex justify-between ">
        <div className="flex gap-2 w-full max-w-md">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              placeholder={`Search by ${title} name`}
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
          {filters !== undefined && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDialogFilters && setOpenDialogFilters(true)}
            >
              <Funnel />
              Filters
              {Object.keys(filters).length > 0 && (
                <>
                  <span className="text-xs font-medium bg-accent rounded-full px-2 py-0.5">
                    {Object.keys(filters).length}
                  </span>
                  <span
                    className="ml-1 size-6 rounded hover:bg-muted cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (setFilters) {
                        setFilters({});
                      }
                    }}
                  >
                    x
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        {pathname ? (
          <Link href={`${pathname}/create`}>
            <Button variant="outline">Create</Button>
          </Link>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            {DialogCreateComponent && DialogCreateComponent}
          </Dialog>
        )}
      </div>
    </>
  );
}
