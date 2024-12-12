import React, { useEffect, useState } from "react";
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(ArcElement, Tooltip, Legend);

// function FeedbackDoughnutChart() {
//   const [feedbackData, setFeedbackData] = useState({
//     correct: 0,
//     rejected: 0,
//     toBeReviewed: 0,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:5001/feedback-summary');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         setFeedbackData(result);
//       } catch (error) {
//         console.error('Error fetching feedback data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   // Prepare the data
//   const data = {
//     labels: ['Correct', 'Rejected', 'To Be Reviewed'],
//     datasets: [
//       {
//         label: 'Correct',
//         data: [feedbackData.correct, 100 - feedbackData.correct],
//         backgroundColor: ['rgba(75, 192, 192, 0.9)', 'rgba(0, 0, 0, 0)'], // Brightened color
//         borderWidth: 1,
//         cutout: '80%', // Adjust the width of the outer ring
//         rotation: -90, // Adjust the rotation so it starts at the top
//         circumference: 360, // Full circle for each ring
//       },
//       {
//         label: 'Rejected',
//         data: [feedbackData.rejected, 100 - feedbackData.rejected],
//         backgroundColor: ['rgba(255, 99, 132, 0.9)', 'rgba(0, 0, 0, 0)'], // Brightened color
//         borderWidth: 1,
//         cutout: '60%', // Middle ring
//         rotation: -90,
//         circumference: 360,
//       },
//       {
//         label: 'To Be Reviewed',
//         data: [feedbackData.toBeReviewed, 100 - feedbackData.toBeReviewed],
//         backgroundColor: ['rgba(255, 205, 86, 0.9)', 'rgba(0, 0, 0, 0)'], // Brightened color
//         borderWidth: 1,
//         cutout: '40%', // Inner ring
//         rotation: -90,
//         circumference: 360,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'right',
//         labels: {
//           color: 'white', // Legend text color
//           font: {
//             size: 14,
//           },
//           generateLabels: (chart) => {
//             const labels = chart.data.labels;
//             return labels.map((label, index) => ({
//               text: label,
//               fillStyle: chart.data.datasets[index].backgroundColor[0], // Ensure each label has a corresponding color
//             }));
//           },
//         },
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     maintainAspectRatio: false, // Allow chart resizing
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
//       <div style={{ width: '500px', height: '500px',paddingTop: '50px', padding: '0 100px' }}> {/* Added left and right padding */}
//         {feedbackData.correct || feedbackData.rejected || feedbackData.toBeReviewed ? (
//           <Doughnut data={data} options={options} />
//         ) : (
//           <p>Failed to fetch feedback data.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default FeedbackDoughnutChart;

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

export function FeedbackDoughnutChart() {
  const [chartDat, setChartDat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rawResult, setRawResult] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5001/feedback-summary");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        // setFeedbackData(result);
        setRawResult(result);
        setChartDat({
          chartData: [
            {
              browser: "correct",
              visitors: result["correct"],
              fill: "var(--color-correct)",
            },
            {
              browser: "rejected",
              visitors: result["rejected"],
              fill: "var(--color-rejected)",
            },
            {
              browser: "toBeReviewed",
              visitors: result["toBeReviewed"],
              fill: "var(--color-toBeReviewed)",
            },
          ],
          chartConfig: {
            visitors: {
              label: "Items",
            },
            correct: {
              label: "Correct",
              color: "hsl(var(--chart-1))",
            },
            rejected: {
              label: "Rejected",
              color: "hsl(var(--chart-2))",
            },
            toBeReviewed: {
              label: "Pending",
              color: "hsl(var(--chart-3))",
            },
          },
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
  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <CardTitle>Quality Assurance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartDat?.chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDat?.chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartDat?.chartConfig[value]?.label}
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {/* Show percentage of rejected compared to correct */}
          {(
            (rawResult["rejected"] /
              (rawResult["rejected"] + rawResult["correct"])) *
            100
          ).toFixed(2)}
          % of items are Rejected.
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current status of Quality Assurance
        </div>
      </CardFooter>
    </Card>
  );
}
