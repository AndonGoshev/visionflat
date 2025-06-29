"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend as RechartsLegend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Props as TooltipContentProps, Payload, NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent"

import { cn } from "../../lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  chartId: string;
  config: ChartConfig;
  activeChart: keyof ChartConfig | null;
  setActiveChart: (key: keyof ChartConfig | null) => void;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ReactElement;
  }
>(({ id, className, children, config, ...props }, ref) => {
  const chartId = `chart-${id || React.useId()}`;
  const [activeChart, setActiveChart] = React.useState<keyof typeof config | null>(
    null
  );

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve]:stroke-primary [&_.recharts-dot_path]:fill-primary [&_.recharts-legend-item_text]:text-muted-foreground [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-sector_path]:fill-primary [&_.recharts-surface]:outline-none",
        className
      )}
      {...props}
    >
      <ChartContext.Provider value={{ chartId, config, activeChart, setActiveChart }}>
        {children}
      </ChartContext.Provider>
    </div>
  );
});
ChartContainer.displayName = "Chart";

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { onItemClick?: (item: LegendPayload) => void }
>(({ className, ...props }, ref) => {
  const { config, activeChart, setActiveChart } = useChart();

  if (!config || !Object.keys(config).length) {
    return null;
  }

  // Custom legend content as a function
  const renderLegendContent = (legendProps: { payload?: ReadonlyArray<LegendPayload> }) => {
    const { payload } = legendProps;
    if (!payload || !payload.length) return null;
    return (
      <ul className={cn("flex items-center gap-4 text-sm text-muted-foreground")}> 
        {[...payload].map((item) => {
          const key = item.dataKey as keyof ChartConfig;
          const color = item.color as string;
          if (!key || !(key in config)) return null;
          const isActived = activeChart === key;
          return (
            <li
              key={item.value}
              data-active={isActived}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 transition-colors data-[active=true]:text-foreground",
                isActived ? "font-semibold" : "font-normal"
              )}
              onClick={() => {
                setActiveChart(activeChart === key ? null : (key as string));
                if (props.onItemClick) props.onItemClick(item);
              }}
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
              {config[key]?.label || item.value}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div ref={ref} className={cn("flex items-center justify-end gap-4", className)}>
      <RechartsLegend content={renderLegendContent} />
    </div>
  );
});
ChartLegend.displayName = "ChartLegend";

const ChartTooltip = Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps<ValueType, NameType> & React.ComponentProps<"div"> & { payload?: Payload<ValueType, NameType>[] }
>((props, ref) => {
  const payload = (props as TooltipContentProps<ValueType, NameType>).payload;
  const className = (props as React.ComponentProps<"div">).className;
  const label = (props as TooltipContentProps<ValueType, NameType>).label;
  const { config } = useChart();

  if (!payload || !payload.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {typeof label !== 'undefined' && <div className="font-medium">{label}</div>}
      <ul className="grid gap-1.5">
        {payload.map((item, i) => {
          const key = item.dataKey as keyof ChartConfig;
          const color = item.color as string;

          if (!key || !(key in config)) {
            return null;
          }

          return (
            <li key={i} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
              <div className="flex flex-1 justify-between">
                <span className="text-muted-foreground">
                  {config[key]?.label || item.name}
                </span>
                <span className="font-medium">{item.value as string}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
ChartTooltipContent.displayName = "ChartTooltipContent";

export {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  // Direct exports from recharts
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
};