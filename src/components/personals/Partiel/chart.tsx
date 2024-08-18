'use client'

import { Bar, BarChart, CartesianGrid, XAxis} from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart'
import { getPersonalByExcelAction } from '@/lib/actions/personals'
import { useEffect, useState } from 'react'

const chartConfig = {
  max: {
    label: 'Max',
    color: '#2563eb'
  },
  average: {
    label: 'Average',
    color: '#60a5fa'
  }
} satisfies ChartConfig

export function Chart() {
  const [chartData, setChartData] = useState([]);
  const getData = async() => {
    const result: any = await getPersonalByExcelAction()
    setChartData(result)
  }
  useEffect(() => {
    if (chartData.length == 0) {
      getData()
    }
  }, [chartData])

  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
        >
          <CartesianGrid vertical={false}/>
          <XAxis
            dataKey="Name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="Max"
            fill="#2563eb"
            radius={4}
          />
          <Bar
            dataKey="Average"
            fill="#60a5fa"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
