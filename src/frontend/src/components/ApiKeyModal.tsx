import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, KeyRound } from "lucide-react";
import { useState } from "react";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentKey: string;
  onSave: (key: string) => void;
}

export function ApiKeyModal({
  open,
  onOpenChange,
  currentKey,
  onSave,
}: ApiKeyModalProps) {
  const [value, setValue] = useState(currentKey);

  const handleSave = () => {
    onSave(value.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-foreground">
            <KeyRound className="h-5 w-5 text-primary" />
            Configure API Key
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your Financial Modeling Prep API key to fetch live market
            data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="apikey-input" className="text-foreground">
              FMP API Key
            </Label>
            <Input
              id="apikey-input"
              data-ocid="apikey.input"
              type="password"
              placeholder="Enter your API key..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="bg-input border-border font-mono text-sm"
            />
          </div>

          <div className="rounded-md bg-muted/40 border border-border p-3 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Get a free API key:</p>
            <a
              href="https://financialmodelingprep.com/developer/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              financialmodelingprep.com
              <ExternalLink className="h-3 w-3" />
            </a>
            <p className="text-xs mt-1">
              Free tier includes basic quote data for common tickers.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            data-ocid="apikey.cancel_button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            data-ocid="apikey.save_button"
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
