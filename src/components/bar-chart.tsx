"use client"

import type { BarChartData } from "@/types"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

type BarChartProps = {
  data: BarChartData[]
}

const BarChartComponent = ({ data }: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) => `$${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChartComponent
