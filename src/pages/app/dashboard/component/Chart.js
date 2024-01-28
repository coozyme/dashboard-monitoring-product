import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";

export const TCDoughnut = ({ state, dataSet, className }) => {
   // const [data, setData] = useState(dataSet);
   // useEffect(() => {
   // if (state === "7") {
   //    setData(TrafficChannelDoughnutData2);
   // } else if (state === "15") {
   //    setData(TrafficChannelDoughnutData3);
   // } else {
   //    setData(TrafficChannelDoughnutData4);
   // }
   // setData(dataSet);
   // }, [state]);
   return (
      <Doughnut
         className={className}
         data={dataSet}
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
                     size: '13px',
                  },
                  titleColor: "#6783b8",
                  titleMarginBottom: 6,
                  bodyColor: "#9eaecf",
                  bodyFont: {
                     size: '12px',
                  },
                  bodySpacing: 4,
                  padding: 10,
                  footerMarginTop: 0,
               },
            },
            rotation: -1.5,
            cutoutPercentage: 70,
            maintainAspectRatio: false,
         }}
      ></Doughnut>
   );
};