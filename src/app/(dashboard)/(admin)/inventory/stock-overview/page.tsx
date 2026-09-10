import { NuqsAdapter } from "nuqs/adapters/next/app";
import StockOverview from "./_components/stock-overview";

export default function StockOverviewPage() {
  return (
    <NuqsAdapter>
      <StockOverview />
    </NuqsAdapter>
  );
}
