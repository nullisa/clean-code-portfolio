import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

type Props = {
  onMoveUp: (e: React.MouseEvent) => void;
  onMoveDown: (e: React.MouseEvent) => void;
  isFirst: boolean;
  isLast: boolean;
};

const ReorderButtons = ({ onMoveUp, onMoveDown, isFirst, isLast }: Props) => {
  const stop = (handler: (e: React.MouseEvent) => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handler(e);
  };
  return (
    <div className="flex flex-col shrink-0">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        disabled={isFirst}
        onClick={stop(onMoveUp)}
        aria-label="Move up"
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-6 w-6"
        disabled={isLast}
        onClick={stop(onMoveDown)}
        aria-label="Move down"
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ReorderButtons;
