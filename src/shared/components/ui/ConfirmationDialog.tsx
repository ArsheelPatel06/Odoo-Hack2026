import { Card } from "./Card";
import { Button } from "./Button";

type ConfirmationDialogProps = {
  title: string;
  description?: string;
};

export function ConfirmationDialog({ title, description }: ConfirmationDialogProps) {
  return (
    <Card role="dialog" aria-label={title} className="max-w-md">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" type="button">
          Cancel
        </Button>
        <Button type="button">Confirm</Button>
      </div>
    </Card>
  );
}
