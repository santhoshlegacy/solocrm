"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const MONTHLY_INSIGHTS = [
  { month: "Nov", revenue: 11200, expenses: 1800 },
  { month: "Dec", revenue: 12500, expenses: 2100 },
  { month: "Jan", revenue: 10800, expenses: 1600 },
  { month: "Feb", revenue: 13200, expenses: 1950 },
  { month: "Mar", revenue: 14800, expenses: 2200 },
  { month: "Apr", revenue: 13900, expenses: 1900 },
  { month: "May", revenue: 16200, expenses: 2400 },
  { month: "Jun", revenue: 17500, expenses: 2500 },
  { month: "Jul", revenue: 19800, expenses: 2800 },
  { month: "Aug", revenue: 21400, expenses: 3100 },
  { month: "Sep", revenue: 23100, expenses: 3200 },
  { month: "Oct", revenue: 25400, expenses: 3400 },
];

export const InsightsBarChart: React.FC = () => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={MONTHLY_INSIGHTS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#52525b"
            fontSize={11}
            fontFamily="'JetBrains Mono', monospace"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#52525b"
            fontSize={11}
            fontFamily="'JetBrains Mono', monospace"
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#121215",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.8)",
              color: "#ffffff",
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
          <Bar
            dataKey="revenue"
            fill="#d41514"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            fill="#27272a"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
