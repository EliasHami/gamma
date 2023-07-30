"use client"

import type { LineChartData } from "@/types"
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type LineChartProps = {
  data: LineChartData[]
  keys: string[]
}

function getRandomColor() {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const LineChartComponent = ({ data, keys }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" allowDuplicatedCategory={false} />
        <YAxis />
        <Tooltip />
        <Legend />
        {keys && keys.length > 0 ? (
          keys.map((key) => (
            <Line
              key={key}
              stroke={getRandomColor()}
              dataKey={key}
              type="monotone"
            />
          ))
        ) : (
          <Line stroke="#888888" dataKey="value" type="monotone" />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineChartComponent
