import React, { useEffect, useState } from "react";
import { TimeOnSiteData, NewUsersData, PageviewsData, BounceRateData } from "../../../../components/partials/charts/analytics/AnalyticsData";
import { WPCharts } from "../../../../components/partials/charts/analytics/AnalyticsCharts";
import { Icon, TooltipComponent } from "../../../../components/Component";
import axios from "axios";
import { BaseURL } from "../../../../config/config";
import { Badge } from "reactstrap";
const StatusMachine = () => {
   const [dataMachine, setDataMachine] = useState([])

   useEffect(() => {
      fetchDataMachine();
   }, [])

   const fetchDataMachine = async () => {
      const mesin = []
      await axios.get(`${BaseURL}/dashboard/status-machine`)
         .then((res) => {
            const data = res.data.data

            // data.forEach(d => {
            //    const m = {
            //       id: d.id,
            //       value: d.kode,
            //       label: `${d.kode} - ${d.name}`,
            //       name: d.name
            //    }

            // mesin.push(m)
            console.log('LOG-data', data)
            setDataMachine(data)
            // });
         }).catch((err) => {
            console.log('LOG-ERR-FETCH-DATA-MACHINE', err)
         })

   }
   // console.log('LOG-dataMachine', dataMachine)
   const itemMachine = dataMachine
   return (
      <React.Fragment>
         <div className="card-title-group align-start pb-3 g-2">
            <div className="card-title card-title-sm">
               <h6 className="title">Status Mesin</h6>
               {/* <p>How has performend this month.</p> */}
            </div>
            <div className="card-tools">
               <TooltipComponent
                  iconClass="card-hint"
                  icon="help"
                  direction="left"
                  id="tooltip-perfomance"
                  text="Status of all machine"
               ></TooltipComponent>
            </div>
         </div>
         {
            itemMachine.length > 0 ?
               itemMachine?.map((item) => {
                  return (
                     <div className="analytic-wp">
                        <div className="analytic-wp-group g-3">
                           <div className="analytic-data analytic-wp-data mt-2">
                              <div className="title">
                                 {item.machineKode} - {item.machineName}
                              </div>
                              {/* <div className="analytic-wp-graph">
                           <div className="title">
                              Bounce Rate <span>(avg)</span>
                           </div>
                           <div className="analytic-wp-ck">
                              <WPCharts className="analytics-line-small" data={BounceRateData}></WPCharts>
                           </div>
                        </div> */}
                              {/* <div className="amount amount-sm">23.59%</div> */}
                              {/* <div className="analytic-wp-text">
                           <div className="change up">
                              <Icon name="arrow-long-up"></Icon>4.5%
                           </div>
                           <div className="subtitle">vs. last month</div>
                        </div> */}
                              <Badge
                                 className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                 color={
                                    item.status == true ? "success" : "warning"
                                 }
                              >
                                 {item.status == true ? "READY" : "NOT READY"}
                              </Badge>
                           </div>
                           {/* <div className="analytic-data analytic-wp-data">
                           <div className="analytic-wp-graph">
                              <div className="title">
                                 Pageviews <span>(avg)</span>
                              </div>
                              <div className="analytic-wp-ck">
                                 <WPCharts className="analytics-line-small" data={PageviewsData}></WPCharts>
                              </div>
                           </div>
                           <div className="analytic-wp-text">
                              <div className="amount amount-sm">5.48</div>
                              <div className="change down">
                                 <Icon name="arrow-long-down"></Icon>1.48%
                              </div>
                              <div className="subtitle">vs. last month</div>
                           </div>
                        </div> */}
                           {/* <div className="analytic-data analytic-wp-data">
                           <div className="analytic-wp-graph">
                              <div className="title">
                                 New Users <span>(avg)</span>
                              </div>
                              <div className="analytic-wp-ck">
                                 <WPCharts className="analytics-line-small" data={NewUsersData}></WPCharts>
                              </div>
                           </div>
                           <div className="analytic-wp-text">
                              <div className="amount amount-sm">549</div>
                              <div className="change up">
                                 <Icon name="arrow-long-up"></Icon>6.8%
                              </div>
                              <div className="subtitle">vs. last month</div>
                           </div>
                        </div> */}
                           {/* <div className="analytic-data analytic-wp-data">
                           <div className="analytic-wp-graph">
                              <div className="title">
                                 Time on Site <span>(avg)</span>
                              </div>
                              <div className="analytic-wp-ck">
                                 <WPCharts className="analytics-line-small" data={TimeOnSiteData}></WPCharts>
                              </div>
                           </div>
                           <div className="analytic-wp-text">
                              <div className="amount amount-sm">3m 35s</div>
                              <div className="change up">
                                 <Icon name="arrow-long-up"></Icon>1.4%
                              </div>
                              <div className="subtitle">vs. last month</div>
                           </div>
                        </div> */}
                        </div>
                     </div>

                  )
               }) : null
         }

      </React.Fragment>
   );
};
export default StatusMachine;
