"use client";

import { useState } from "react";

export type ChartDataItem = {
  label: string;
  value: number;
  color: string;
};

export type BreakdownData = {
  orderStatuses?: Record<string, number>;
  roles?: Record<string, number>;
  userStatuses?: Record<string, number>;
};

export type StatsData = {
  products: number;
  users: number;
  blogs: number;
  orders: number;
};

type ViewMode = "orders" | "system" | "roles";

interface Props {
  stats: StatsData;
  breakdown?: BreakdownData;
}

const COLOR_PALETTES = {
  orders: {
    processing: "#3B82F6", // Blue
    shipped: "#8B5CF6",    // Purple
    delivered: "#10B981",  // Emerald
    cancelled: "#EF4444",  // Red
  },
  system: [
    "#10B981", // Products (Emerald)
    "#F59E0B", // Users (Amber)
    "#6366F1", // Blogs (Indigo)
    "#EC4899", // Orders (Pink)
  ],
  roles: {
    Admin: "#EF4444",    // Red
    Manager: "#F59E0B",  // Amber
    Staff: "#3B82F6",    // Blue
    Customer: "#10B981", // Emerald
  },
};

export function DashboardPieChart({ stats, breakdown }: Props) {
  const [activeTab, setActiveTab] = useState<ViewMode>("orders");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate chart items based on tab
  const getItems = (): ChartDataItem[] => {
    if (activeTab === "orders") {
      const orderCounts = breakdown?.orderStatuses || {
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };
      return [
        { label: "Delivered", value: orderCounts.delivered || 0, color: COLOR_PALETTES.orders.delivered },
        { label: "Processing", value: orderCounts.processing || 0, color: COLOR_PALETTES.orders.processing },
        { label: "Shipped", value: orderCounts.shipped || 0, color: COLOR_PALETTES.orders.shipped },
        { label: "Cancelled", value: orderCounts.cancelled || 0, color: COLOR_PALETTES.orders.cancelled },
      ].filter((item) => item.value >= 0);
    }

    if (activeTab === "system") {
      return [
        { label: "Products", value: stats.products || 0, color: COLOR_PALETTES.system[0] },
        { label: "Users", value: stats.users || 0, color: COLOR_PALETTES.system[1] },
        { label: "Blogs", value: stats.blogs || 0, color: COLOR_PALETTES.system[2] },
        { label: "Orders", value: stats.orders || 0, color: COLOR_PALETTES.system[3] },
      ];
    }

    // roles
    const roleCounts = breakdown?.roles || {
      Admin: 0,
      Manager: 0,
      Staff: 0,
      Customer: 0,
    };
    return [
      { label: "Customer", value: roleCounts.Customer || 0, color: COLOR_PALETTES.roles.Customer },
      { label: "Staff", value: roleCounts.Staff || 0, color: COLOR_PALETTES.roles.Staff },
      { label: "Manager", value: roleCounts.Manager || 0, color: COLOR_PALETTES.roles.Manager },
      { label: "Admin", value: roleCounts.Admin || 0, color: COLOR_PALETTES.roles.Admin },
    ];
  };

  const items = getItems();
  const total = items.reduce((acc, item) => acc + item.value, 0);

  // Helper to compute SVG arcs
  const radius = 100;
  const innerRadius = 60;
  const cx = 120;
  const cy = 120;

  let cumulativeAngle = -Math.PI / 2; // Start from top

  const slices = items.map((item, index) => {
    const fraction = total > 0 ? item.value / total : 1 / (items.length || 1);
    const angle = fraction * 2 * Math.PI;

    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    // Ensure clean rendering even for 360 degree full circle
    const isFullCircle = fraction >= 0.999;
    const safeEndAngle = isFullCircle ? startAngle + 2 * Math.PI - 0.0001 : endAngle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(safeEndAngle);
    const y2 = cy + radius * Math.sin(safeEndAngle);

    const ix1 = cx + innerRadius * Math.cos(safeEndAngle);
    const iy1 = cy + innerRadius * Math.sin(safeEndAngle);
    const ix2 = cx + innerRadius * Math.cos(startAngle);
    const iy2 = cy + innerRadius * Math.sin(startAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2}`,
      "Z",
    ].join(" ");

    const percentage = total > 0 ? Math.round(fraction * 100) : 0;

    return {
      ...item,
      pathData,
      percentage,
      index,
    };
  });

  const activeSlice = hoveredIndex !== null ? slices[hoveredIndex] : null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Header & Mode Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-xs text-gray-500 mt-0.5">Distribution breakdown & metrics</p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 text-xs font-semibold text-gray-600">
          <button
            onClick={() => { setActiveTab("orders"); setHoveredIndex(null); }}
            className={`cursor-pointer rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "orders" ? "bg-white text-gray-900 shadow-xs font-bold" : "hover:text-gray-900"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => { setActiveTab("system"); setHoveredIndex(null); }}
            className={`cursor-pointer rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "system" ? "bg-white text-gray-900 shadow-xs font-bold" : "hover:text-gray-900"
            }`}
          >
            System
          </button>
          <button
            onClick={() => { setActiveTab("roles"); setHoveredIndex(null); }}
            className={`cursor-pointer rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "roles" ? "bg-white text-gray-900 shadow-xs font-bold" : "hover:text-gray-900"
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {/* Chart & Legend Content */}
      <div className="mt-6 flex flex-col items-center justify-around gap-8 md:flex-row md:items-center">
        {/* Donut Chart SVG */}
        <div className="relative flex items-center justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-xs">
            {total > 0 ? (
              slices.map((slice) => {
                const isHovered = hoveredIndex === slice.index;
                return (
                  <path
                    key={slice.label}
                    d={slice.pathData}
                    fill={slice.color}
                    className="cursor-pointer transition-all duration-300 hover:opacity-90"
                    style={{
                      transform: isHovered ? "scale(1.04)" : "scale(1)",
                      transformOrigin: "120px 120px",
                    }}
                    onMouseEnter={() => setHoveredIndex(slice.index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })
            ) : (
              <circle cx="120" cy="120" r="100" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
            )}
          </svg>

          {/* Donut Center Info */}
          <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-gray-900">
              {activeSlice ? activeSlice.value : total}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {activeSlice ? activeSlice.label : "Total"}
            </span>
            {activeSlice && (
              <span className="mt-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                {activeSlice.percentage}%
              </span>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex w-full max-w-xs flex-col gap-3">
          {items.map((item, index) => {
            const fraction = total > 0 ? (item.value / total) * 100 : 0;
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition-all ${
                  isHovered ? "bg-gray-50 ring-1 ring-gray-200" : "hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3.5 w-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500">
                    {Math.round(fraction)}%
                  </span>
                  <span className="w-8 text-right text-sm font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
