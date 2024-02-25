import React, { useEffect, useState } from "react";
import { CardTitle, Spinner } from "reactstrap";
import { Icon, TooltipComponent } from "../../../../components/Component";
import { BarChart } from "./BarChart";
import axios from "axios";
import { BaseURL } from "../../../../config/config";
const ProductionOverview = () => {
   // console.log('data-SSS', data)
   const [data, setData] = useState(false)
   const [spinner, setSpinner] = useState(true);

   const fetchDataOrderProductionOverview = async () => {
      try {
         await axios.get(`${BaseURL}/dashboard/order-produksi-overview`)
            .then(res => {
               console.log('DATA', res.data.data)
               setData(res.data.data)
               console.log('LOGGG-', res.data.data)
               setSpinner(false)
            }).catch(err => {
               setSpinner(true)
               console.log('LOG-ERR-DATA', err)
            })
      } catch (error) {
         setSpinner(true)
         console.log('LOG-ERR-DATA', err)
      }
   }

   useEffect(() => {
      fetchDataOrderProductionOverview()
   }, [])

   return (
      <React.Fragment>
         {" "}
         <div className="card-title-group align-start mb-2">
            <CardTitle>
               <h6 className="title">Order Produksi Overview</h6>
            </CardTitle>
            <div className="card-tools">
               <TooltipComponent
                  icon="help-fill"
                  iconClass="card-hint"
                  direction="left"
                  id="Tooltip-3"
                  text="Since last month"
               />
            </div>
         </div>
         <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
            <div className="nk-sale-data">
               <span className="amount">{data.total}</span>
               <span className="sub-title">
                  <span className={data.isUp ? "change up text-success" : "change down text-danger"} >
                     <Icon name={data.isUp ? "arrow-long-up" : "arrow-long-down"} />
                     {data.percentage}%
                  </span>
                  since last month
               </span>
            </div>
            <div className="nk-sales-ck">
               {
                  spinner
                     ?
                     <Spinner color="primary" />
                     :
                     <BarChart data={data} />
               }
               {/* <BarChart data={dataChart} /> */}

            </div>
         </div>
      </React.Fragment>
   );
}

export default ProductionOverview;