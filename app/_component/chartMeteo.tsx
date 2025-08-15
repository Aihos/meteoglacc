"use client"

import { Line, LineChart, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { time: "12h", temp: 18 },
  { time: "15h", temp: 22 },
  { time: "18h", temp: 20 },
  { time: "21h", temp: 16 },
]

const chartConfig = {
  temp: {
    label: "Température",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface WeatherProp {
  data: {
    hourly: {
      time: Date[];
      temperature_2m: Float32Array | null;
     
    };
  };
}

export default function ChartMeteo({data} : WeatherProp) {

  const chartData = data.hourly.time.map((time, index) => ({
    time: time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    temp: data.hourly.temperature_2m?.[index] || 0
  }));

  return (
    <div className="h-32 w-1/2  p-2 border-1">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={chartData}>
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            fontSize={12}
          />
          <Line
            dataKey="temp"
            type="monotone"
            stroke="var(--color-temp)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
