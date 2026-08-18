"use client";

import { AppSidebar } from "@/components/common/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrowLeftRight } from "lucide-react";
import DashboardBreadCrumb from "./_components/dashboard-breadcrumb";
import { useBrandStore } from "@/stores/brand-store";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useBranchQuery } from "@/hooks/queries/use-branches";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brands = useBrandStore((s) => s.brands);
  const currentBrandId = useBrandStore((s) => s.currentBrandId);
  const currentBrandName = brands.find(
    (brand) => String(brand.id) === currentBrandId,
  )?.name;
  const { data: branches, isLoading } = useBranchQuery();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]:h-12">
          <div className="flex items-center">
            <SidebarTrigger className="cursor-[ew-resize] mx-3" />
            <Separator
              orientation="vertical"
              className="mr-4 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadCrumb />
          </div>
          <div className="flex gap-4 items-center px-6">
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                  Branches <ArrowLeftRight />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>
                    Multiple Branches in {currentBrandName}
                  </DrawerTitle>
                  <DrawerDescription>
                    Overview of all active branches
                  </DrawerDescription>
                </DrawerHeader>
                <div className="capitalize grid list-inside mx-4">
                  {branches?.map((b) => (
                    <li key={b.id}>{b.name}</li>
                  ))}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-start gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
