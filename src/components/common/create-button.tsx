import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function CreateButton({
  type,
  handleReject,
  isPending,
}: {
  type: "Create" | "Detail" | "Update" | "Approve";
  handleReject?: () => void;
  isPending?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="fixed bottom-0 right-0 w-full flex justify-end gap-x-2 p-4 bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
      <Button type="button" variant="outline" onClick={() => router.back()}>
        {type === "Detail" ? "Back" : "Cancel"}
      </Button>
      {type === "Approve" && (
        <Button type="button" variant="destructive" onClick={handleReject}>
          {isPending ? <Loader2 className="animate-spin" /> : "Reject"}
        </Button>
      )}
      {type !== "Detail" && (
        <Button type="submit">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : type === "Approve" ? (
            "Approve"
          ) : (
            type
          )}
        </Button>
      )}
    </div>
  );
}
