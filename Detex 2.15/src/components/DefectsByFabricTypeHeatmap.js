import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

export function DefectsByFabricTypeHeatmap() {
  const [chartDat, setChartDat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawResult, setRawResult] = useState(null);
  const [defectTypesFlat, setDefectTypesFlat] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5001/defects-by-fabric-type-heatmap"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const { fabricTypes, defectTypes, heatmapData } = result;

        const defectTypesFlat = defectTypes.map((defectType) =>
          defectType.replace(" ", "-").toLowerCase()
        );
        setDefectTypesFlat(defectTypesFlat);
        // setFeedbackData(result);
        setRawResult(result);
        const chartData = fabricTypes.map((fabricType) => ({
          browser: fabricType,
          ...Object.fromEntries(
            defectTypes.map((defectType) => [
              defectType.replace(" ", "-").toLowerCase(),
              heatmapData[defectType]?.[fabricType] || 0,
            ])
          ),
          // fill: `var(--color-${fabricType})`,
        }));

        const chartConfig = {
          ...Object.fromEntries(
            fabricTypes.map((fabricType) => [
              fabricType,
              {
                label: fabricType.charAt(0).toUpperCase() + fabricType.slice(1),
                // color: `hsl(var(--chart-${
                //   fabricTypes.indexOf(fabricType) + 1
                // }))`,
              },
            ])
          ),
          ...Object.fromEntries(
            defectTypes.map((defectType) => [
              defectType.replace(" ", "-").toLowerCase(),
              {
                label: defectType
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
                color: `hsl(var(--chart-${
                  defectTypes.indexOf(defectType) + 3
                }))`,
              },
            ])
          ),
        };
        setChartDat({
          chartData,
          chartConfig,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };
    fetchData();
  }, []);

  if (loading || !chartDat) {
    return <div>Loading...</div>;
  }
  // Calculate total defects for each fabric type
  const totalDefects = chartDat?.chartData?.map((data) => ({
    browser: data.browser,
    total: defectTypesFlat?.reduce(
      (sum, defectType) => sum + data[defectType],
      0
    ),
  }));

  // Find the fabric type with the highest and lowest total defects
  const highestDefects = totalDefects.reduce((prev, current) =>
    prev.total > current.total ? prev : current
  );
  const lowestDefects = totalDefects.reduce((prev, current) =>
    prev.total < current.total ? prev : current
  );

  // Calculate the percentage
  const percentage =
    ((highestDefects.total - lowestDefects.total) / lowestDefects.total) * 100;
  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <CardTitle>Defects by Fabric Type Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartDat?.chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDat?.chartData}
            layout="horizontal"
            margin={{
              left: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            {/* {defectTypesFlat?.map((defectType) => (
              <YAxis dataKey={defectType} type="number" hide />
            ))} */}

            <XAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartDat?.chartConfig[value]?.label}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {defectTypesFlat?.map((defectType) => (
              <Bar
                dataKey={defectType}
                layout="horizontal"
                fill={`var(--color-${defectType})`}
                radius={5}
              />
            ))}
            {/* <Bar dataKey="visitors" layout="horizontal" radius={5} />*/}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <span className="capitalize">{highestDefects.browser}</span>has{" "}
          {percentage.toFixed(2)}% more defects than{" "}
          <span className="capitalize">{lowestDefects.browser}</span>
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Defects by Fabric Type Heatmap
        </div>
      </CardFooter>
    </Card>
  );
}
