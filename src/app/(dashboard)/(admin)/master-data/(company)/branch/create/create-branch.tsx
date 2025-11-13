import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateBranch() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Branch</CardTitle>
        <CardDescription>
          Fill the form below to create a new branch.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
