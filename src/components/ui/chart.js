"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, Legend as RechartsLegend, Line, LineChart, Pie, PieChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { cn } from "../../lib/utils";
// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' };
const ChartContext = React.createContext(null);
function useChart() {
    const context = React.useContext(ChartContext);
    if (!context) {
        throw new Error('useChart must be used within a <ChartContainer />');
    }
    return context;
}
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
    const chartId = `chart-${id || React.useId()}`;
    const [activeChart, setActiveChart] = React.useState(null);
    return (_jsx("div", { "data-chart": chartId, ref: ref, className: cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve]:stroke-primary [&_.recharts-dot_path]:fill-primary [&_.recharts-legend-item_text]:text-muted-foreground [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-sector_path]:fill-primary [&_.recharts-surface]:outline-none", className), ...props, children: _jsx(ChartContext.Provider, { value: { chartId, config, activeChart, setActiveChart }, children: children }) }));
});
ChartContainer.displayName = "Chart";
const ChartLegend = React.forwardRef(({ className, ...props }, ref) => {
    const { config, activeChart, setActiveChart } = useChart();
    if (!config || !Object.keys(config).length) {
        return null;
    }
    // Custom legend content as a function
    const renderLegendContent = (legendProps) => {
        const { payload } = legendProps;
        if (!payload || !payload.length)
            return null;
        return (_jsx("ul", { className: cn("flex items-center gap-4 text-sm text-muted-foreground"), children: [...payload].map((item) => {
                const key = item.dataKey;
                const color = item.color;
                if (!key || !(key in config))
                    return null;
                const isActived = activeChart === key;
                return (_jsxs("li", { "data-active": isActived, className: cn("flex cursor-pointer items-center gap-1.5 transition-colors data-[active=true]:text-foreground", isActived ? "font-semibold" : "font-normal"), onClick: () => {
                        setActiveChart(activeChart === key ? null : key);
                        if (props.onItemClick)
                            props.onItemClick(item);
                    }, children: [_jsx("div", { className: "h-2.5 w-2.5 shrink-0 rounded-[2px]", style: { backgroundColor: color } }), config[key]?.label || item.value] }, item.value));
            }) }));
    };
    return (_jsx("div", { ref: ref, className: cn("flex items-center justify-end gap-4", className), children: _jsx(RechartsLegend, { content: renderLegendContent }) }));
});
ChartLegend.displayName = "ChartLegend";
const ChartTooltip = Tooltip;
const ChartTooltipContent = React.forwardRef((props, ref) => {
    const payload = props.payload;
    const className = props.className;
    const label = props.label;
    const { config } = useChart();
    if (!payload || !payload.length) {
        return null;
    }
    return (_jsxs("div", { ref: ref, ...props, className: cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className), children: [typeof label !== 'undefined' && _jsx("div", { className: "font-medium", children: label }), _jsx("ul", { className: "grid gap-1.5", children: payload.map((item, i) => {
                    const key = item.dataKey;
                    const color = item.color;
                    if (!key || !(key in config)) {
                        return null;
                    }
                    return (_jsxs("li", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "h-2.5 w-2.5 shrink-0 rounded-[2px]", style: { backgroundColor: color } }), _jsxs("div", { className: "flex flex-1 justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: config[key]?.label || item.name }), _jsx("span", { className: "font-medium", children: item.value })] })] }, i));
                }) })] }));
});
ChartTooltipContent.displayName = "ChartTooltipContent";
export { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, 
// Direct exports from recharts
Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, RadialBar, RadialBarChart, ResponsiveContainer, XAxis, YAxis, };
