import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  DEFAULT_FILTERS,
  type FilterRange,
  type ScreenerFilters,
} from "../types/stock";

interface FilterPanelProps {
  filters: ScreenerFilters;
  onChange: (filters: ScreenerFilters) => void;
}

interface FilterConfig {
  key: keyof ScreenerFilters;
  label: string;
  min: number;
  max: number;
  step: number;
  ocid: string;
  format?: (v: number) => string;
}

const FUNDAMENTAL_FILTERS: FilterConfig[] = [
  {
    key: "pe",
    label: "P/E Ratio",
    min: 0,
    max: 100,
    step: 1,
    ocid: "filter.pe.input",
  },
  {
    key: "debtToEquity",
    label: "Debt / Equity",
    min: 0,
    max: 10,
    step: 0.1,
    ocid: "filter.de.input",
  },
  {
    key: "roce",
    label: "ROCE %",
    min: 0,
    max: 100,
    step: 1,
    ocid: "filter.roce.input",
  },
  {
    key: "roe",
    label: "ROE %",
    min: 0,
    max: 300,
    step: 1,
    ocid: "filter.roe.input",
  },
  {
    key: "marketCap",
    label: "Market Cap ($B)",
    min: 0,
    max: 3000,
    step: 10,
    ocid: "filter.mcap.input",
    format: (v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}T` : `$${v}B`),
  },
];

const TECHNICAL_FILTERS: FilterConfig[] = [
  {
    key: "rsi",
    label: "RSI (14)",
    min: 0,
    max: 100,
    step: 1,
    ocid: "filter.rsi.input",
  },
  {
    key: "ma50Dev",
    label: "50-day MA Dev %",
    min: -50,
    max: 50,
    step: 1,
    ocid: "filter.ma50.input",
    format: (v) => `${v > 0 ? "+" : ""}${v}%`,
  },
  {
    key: "ma200Dev",
    label: "200-day MA Dev %",
    min: -50,
    max: 50,
    step: 1,
    ocid: "filter.ma200.input",
    format: (v) => `${v > 0 ? "+" : ""}${v}%`,
  },
];

function FilterRow({
  config,
  value,
  onChange,
}: {
  config: FilterConfig;
  value: FilterRange;
  onChange: (key: keyof ScreenerFilters, val: FilterRange) => void;
}) {
  const fmt = config.format ?? ((v: number) => String(v));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {config.label}
        </span>
        <span className="text-xs font-mono text-primary">
          {fmt(value.min)} – {fmt(value.max)}
        </span>
      </div>
      <Slider
        min={config.min}
        max={config.max}
        step={config.step}
        value={[value.min, value.max]}
        onValueChange={([min, max]) => onChange(config.key, { min, max })}
        className="w-full"
      />
      <div className="flex gap-2">
        <Input
          data-ocid={config.ocid}
          type="number"
          value={value.min}
          min={config.min}
          max={value.max}
          step={config.step}
          onChange={(e) =>
            onChange(config.key, {
              min: Number.parseFloat(e.target.value) || config.min,
              max: value.max,
            })
          }
          className="h-7 text-xs bg-input border-border font-mono"
          placeholder="Min"
        />
        <Input
          type="number"
          value={value.max}
          min={value.min}
          max={config.max}
          step={config.step}
          onChange={(e) =>
            onChange(config.key, {
              min: value.min,
              max: Number.parseFloat(e.target.value) || config.max,
            })
          }
          className="h-7 text-xs bg-input border-border font-mono"
          placeholder="Max"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  filters,
  values,
  onChange,
}: {
  title: string;
  filters: FilterConfig[];
  values: ScreenerFilters;
  onChange: (key: keyof ScreenerFilters, val: FilterRange) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-4">
              {filters.map((f) => (
                <FilterRow
                  key={f.key}
                  config={f}
                  value={values[f.key]}
                  onChange={onChange}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const handleChange = (key: keyof ScreenerFilters, val: FilterRange) => {
    onChange({ ...filters, [key]: val });
  };

  const handleReset = () => {
    onChange(DEFAULT_FILTERS);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3 h-fit">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-display font-semibold text-foreground">
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          data-ocid="filters.button"
          onClick={handleReset}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      <Section
        title="Fundamentals"
        filters={FUNDAMENTAL_FILTERS}
        values={filters}
        onChange={handleChange}
      />
      <Section
        title="Technicals"
        filters={TECHNICAL_FILTERS}
        values={filters}
        onChange={handleChange}
      />
    </div>
  );
}
