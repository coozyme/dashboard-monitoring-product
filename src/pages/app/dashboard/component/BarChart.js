import { Bar, Line } from "react-chartjs-2";
export const BarChart = ({ data }) => {
   return (
      <Bar
         className="sales-bar-chart chartjs-render-monitor"
         data={data}
         options={{
            plugins: {
               legend: {
                  display: false,
               },
               tooltip: {
                  enabled: true,
                  displayColors: false,
                  backgroundColor: "#eff6ff",
                  titleFont: {
                     size: '11px',
                  },
                  titleColor: "#6783b8",
                  titleMarginBottom: 4,
                  bodyColor: "#9eaecf",
                  bodyFont: {
                     size: '10px',
                  },
                  bodySpacing: 3,
                  padding: 8,
                  footerMarginTop: 0,
               },
            },
            scales: {
               y: {
                  display: false,
               },
               x: {
                  display: false,
               },
            },
            maintainAspectRatio: false,
         }}
      />
   );
};