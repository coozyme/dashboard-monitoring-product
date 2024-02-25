// export const TrafficStatusProductionData = [
//    {
//       "status": "OPEN",
//       "count": 4,
//       "percent": "40%",
//       "color": "#798bff"
//    },
//    {
//       "status": "PROCCESS",
//       "count": 3,
//       "percent": "30%",
//       "color": "#b8acff"
//    },
//    {
//       "status": "FINISH",
//       "count": 3,
//       "percent": "30%",
//       "color": "#ffa9ce"
//    },
//    {
//       "status": "CLOSED",
//       "count": 0,
//       "percent": "0%",
//       "color": "#f9db7b"
//    },
//    {
//       "status": "CANCEL",
//       "count": 0,
//       "percent": "0%",
//       "color": "#f9db7b"
//    },
//    {
//       "status": "ON HOLD",
//       "count": 0,
//       "percent": "0%",
//       "color": "#f9db7b"
//    },
// ]

export var TrafficChannelDoughnutData = {
   labels: ["OPEN", "PROCCESS", "FINISH", "CLOSED", "CANCEL", "ON HOLD"],
   dataUnit: "StatusProduction",
   legend: false,
   datasets: [
      {
         borderColor: "#fff",
         backgroundColor: ["#d1d3d4", "#6495ED", "#02e00c", "#6e819a", "#b8acff", "#f9db7b"],
         data: [4705, 1509, 482, 1000, 50, 20, 100],
      },
   ],
   dataView: [
      {
         "status": "OPEN",
         "count": 4,
         "percent": "40%",
         "color": "#d1d3d4"
      },
      {
         "status": "PROCCESS",
         "count": 3,
         "percent": "30%",
         "color": "#b8acff"
      },
      {
         "status": "FINISH",
         "count": 3,
         "percent": "30%",
         "color": "#ffa9ce"
      },
      {
         "status": "CLOSED",
         "count": 0,
         "percent": "0%",
         "color": "#f9db7b"
      },
      {
         "status": "CANCEL",
         "count": 0,
         "percent": "0%",
         "color": "#f9db7b"
      },
      {
         "status": "ON HOLD",
         "count": 0,
         "percent": "0%",
         "color": "#f9db7b"
      },
   ]
};


export const activeSubscription = {
   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
   dataUnit: "USD",
   stacked: true,
   datasets: [
      {
         label: "Active User",
         barPercentage: 0.7,
         categoryPercentage: 0.7,
         backgroundColor: [
            "rgba(133, 79, 255, 0.2)",
            "rgba(133, 79, 255, 0.2)",
            "rgba(133, 79, 255, 0.2)",
            "rgba(133, 79, 255, 0.2)",
            "rgba(133, 79, 255, 0.2)",
            "rgba(133, 79, 255, 1)",
         ],
         data: [8200, 7800, 9500, 5500, 9200, 9690],
      },
   ],
};

export const orderProducksiOverviewData = {
   labels: ["Jan", "Feb"],
   dataUnit: "USDss",
   stacked: true,
   datasets: [
      {
         label: "Active User",
         barPercentage: 0.7,
         categoryPercentage: 0.7,
         backgroundColor: [
            // "rgba(133, 79, 255, 0.2)",
            // "rgba(133, 79, 255, 0.2)",
            // "rgba(133, 79, 255, 0.2)",
            // "rgba(133, 79, 255, 0.2)",
            "rgba(133, 79, 255, 0.2)",
            "rgba(133, 79, 255, 1)",
         ],
         data: [
            "7",
            "10"
         ],
      },
   ],
};
// export const orderProducksiOverviewData = {
//    "total": 17,
//    "percentage": "30.00",
//    "isUp": true,
//    "labels": [
//       "Jan",
//       "Feb"
//    ],
//    "dataUnit": "Quantity",
//    "stacked": true,
//    "datasets": [
//       {
//          "label": "Order Produksi",
//          "barPercentage": 0.7,
//          "categoryPercentage": 0.7,
//          "backgroundColor": [
//             "rgba(133, 79, 255, 0.2)",
//             "rgba(133, 79, 255, 1)"
//          ],
//          "data": [
//             7,
//             10
//          ]
//       }
//    ]
// };