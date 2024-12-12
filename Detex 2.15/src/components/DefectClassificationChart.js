import { Pie, PieChart } from "recharts";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "./ui/chart";

// Dynamic chart data and config generator without 'other' category
const generateChartData = (inputData, options = {}) => {
  // Validate input data
  if (!Array.isArray(inputData) || inputData.length === 0) {
    throw new Error("Input must be a non-empty array");
  }

  // Determine the keys dynamically
  const valueKey =
    Object.keys(inputData[0]).find(
      (key) => typeof inputData[0][key] === "number"
    ) || "count";
  const labelKey =
    Object.keys(inputData[0]).find(
      (key) => typeof inputData[0][key] === "string"
    ) || "_id";

  // Default configuration with dynamic color mapping
  const defaultConfig = {
    colorPalette: (sortedData) => {
      const colorMap = {
        chrome: sortedData[0]?.[labelKey] || "default",
        safari: sortedData[1]?.[labelKey] || "default",
        firefox: sortedData[2]?.[labelKey] || "default",
        edge: sortedData[3]?.[labelKey] || "default",
        other: sortedData[4]?.[labelKey] || "default",
      };
      console.log("ss", colorMap);
      return [
        `var(--color-${Object.keys(colorMap)[0]})`,
        `var(--color-${Object.keys(colorMap)[1]})`,
        `var(--color-${Object.keys(colorMap)[2]})`,
        `var(--color-${Object.keys(colorMap)[3]})`,
        `var(--color-${Object.keys(colorMap)[4]})`,
      ];
    },
    chartColors: [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ],
  };

  // Merge default config with user options
  const config = { ...defaultConfig, ...options };
  // Sort data by the numeric value in descending order
  const sortedData = [...inputData].sort((a, b) => b[valueKey] - a[valueKey]);

  // Generate chart data
  const chartData = sortedData.map((item, index) => ({
    browser: item[labelKey],
    visitors: item[valueKey],
    fill:
      config.colorPalette[index] ||
      config.colorPalette[config.colorPalette.length - 1],
  }));

  // Generate chart config
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    ...Object.fromEntries(
      sortedData.map((item, index) => [
        item[labelKey],
        {
          label: item[labelKey],
          color:
            config.chartColors[index] ||
            config.chartColors[config.chartColors.length - 1],
        },
      ])
    ),
  };

  return {
    chartData,
    chartConfig,
    metadata: {
      totalItems: inputData.length,
      valueKey,
      labelKey,
    },
  };
};

export function DefectClassificationChart() {
  const [chartDat, setChartDat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassFrequencies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5001/class-frequencies"
        ); // Replace with your backend route
        const frequencies = response?.data;
        const { chartData, chartConfig, metadata } = generateChartData(
          frequencies,
          {
            colorPalette: ["red", "blue", "green", "yellow", "purple"],
            chartColors: ["red", "blue", "green", "yellow", "purple"],
          }
        );

        // setChartData({
        //   labels: labels,
        //   datasets: [
        //     {
        //       data: data,
        //       backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        //       hoverBackgroundColor: [
        //         "#FF6384",
        //         "#36A2EB",
        //         "#FFCE56",
        //         "#4BC0C0",
        //       ],
        //     },
        //   ],
        // });
        setChartDat({
          chartData,
          chartConfig,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching class frequencies:", error);
      }
    };

    fetchClassFrequencies();
  }, []);

  if (loading || !chartDat) {
    return <div>Loading...</div>;
  }
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Defect Classification</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 pb-0 ">
        <ChartContainer
          config={chartDat?.chartConfig}
          className="mx-auto aspect-square max-h-[400px] "
        >
          <PieChart>
            <Pie data={chartDat?.chartData} dataKey="visitors" scale={40} />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
