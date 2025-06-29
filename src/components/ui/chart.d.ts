import * as React from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Props as TooltipContentProps, Payload, NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { LegendPayload } from "recharts/types/component/DefaultLegendContent";
declare const THEMES: {
    readonly light: "";
    readonly dark: ".dark";
};
export type ChartConfig = {
    [k in string]: {
        label?: React.ReactNode;
        icon?: React.ComponentType;
    } & ({
        color?: string;
        theme?: never;
    } | {
        color?: never;
        theme: Record<keyof typeof THEMES, string>;
    });
};
declare const ChartContainer: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
    children: React.ReactElement;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ChartLegend: React.ForwardRefExoticComponent<Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    onItemClick?: (item: LegendPayload) => void;
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ChartTooltip: typeof Tooltip;
declare const ChartTooltipContent: React.ForwardRefExoticComponent<Omit<TooltipContentProps<ValueType, NameType> & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
    payload?: Payload<ValueType, NameType>[];
}, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, RadialBar, RadialBarChart, ResponsiveContainer, XAxis, YAxis, };
