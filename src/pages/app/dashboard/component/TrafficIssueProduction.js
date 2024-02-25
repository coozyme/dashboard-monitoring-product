import React, { useEffect, useState } from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem, Spinner } from "reactstrap";
// import { TCDoughnut } from "../../../../components/partials/charts/analytics/AnalyticsCharts";
// import { TrafficChannelDoughnutData } from "./data";
import { BaseURL } from "../../../../config/config";
import { TCDoughnut } from './Chart';
import axios from "axios";
const TrafficIssueProduction = () => {
   const [traffic, setTraffic] = useState("30");
   const [data, setData] = useState(false);
   const [spinner, setSpinner] = useState(true);


   const fetchIssueProductions = async () => {
      try {
         await axios.get(`${BaseURL}/dashboard/issue-productions`)
            .then(res => {
               console.log('DATA', res.data.data)
               setData(res.data.data)
               setSpinner(false)
            }).catch(err => {
               setSpinner(false)
               console.log('LOG-ERR-DATA', err)
            })

      } catch (error) {
         setSpinner(false)
         console.log('LOG-ERR-fetchIssueProductions', err)
      }
   }

   useEffect(() => {
      fetchIssueProductions()
   }, [])


   return (
      <React.Fragment>
         {" "}
         <div className="card-title-group">
            <div className="card-title card-title-sm">
               <h6 className="title">Issue Produksi</h6>
            </div>
            <UncontrolledDropdown>
               <DropdownToggle className="dropdown-toggle dropdown-indicator btn btn-sm btn-outline-light btn-white">
                  {traffic} Days
               </DropdownToggle>
               <DropdownMenu end className="dropdown-menu-xs">
                  <ul className="link-list-opt no-bdr">
                     {/* <li className={traffic === "7" ? "active" : ""}>
                        <DropdownItem
                           href="#dropdownitem"
                           onClick={(e) => {
                              e.preventDefault();
                              setTraffic("7");
                           }}
                        >
                           <span>7 Days</span>
                        </DropdownItem>
                     </li>
                     <li className={traffic === "15" ? "active" : ""}>
                        <DropdownItem
                           href="#dropdownitem"
                           onClick={(e) => {
                              e.preventDefault();
                              setTraffic("15");
                           }}
                        >
                           <span>15 Days</span>
                        </DropdownItem>
                     </li> */}
                     <li className={traffic === "30" ? "active" : ""}>
                        <DropdownItem
                           href="#dropdownitem"
                           onClick={(e) => {
                              e.preventDefault();
                              setTraffic("30");
                           }}
                        >
                           <span>30 Days</span>
                        </DropdownItem>
                     </li>
                  </ul>
               </DropdownMenu>
            </UncontrolledDropdown>
         </div>
         <div className="traffic-channel">
            <div className="traffic-channel-doughnut-ck">
               {
                  spinner
                     ?
                     <Spinner color="primary" />
                     :
                     <TCDoughnut state={traffic} dataSet={data} className="analytics-doughnut"></TCDoughnut>

               }
            </div>
            <div className="traffic-channel-group g-2">

               {data?.dataView?.length > 0 ? data?.dataView?.map((item, index) => {
                  return (
                     <div className="traffic-channel-data">
                        <div className="title">
                           <span className="dot dot-lg sq" style={{ background: item?.color }}></span>
                           <span>{item?.issue}</span>
                        </div>
                        <div className="amount">
                           {item?.count} <small>{item?.percent}</small>
                        </div>
                     </div>
                  )
               }) : <Spinner color="primary" />
               }
               {/* <div className="traffic-channel-data">
                  <div className="title">
                     <span className="dot dot-lg sq" style={{ background: "#798bff" }}></span>
                     <span>Organic Search</span>
                  </div>
                  <div className="amount">
                     {traffic === "7" ? "3,055" : traffic === "15" ? "4,505" : "4,705"} <small>58.63%</small>
                  </div>
               </div>
               <div className="traffic-channel-data">
                  <div className="title">
                     <span className="dot dot-lg sq" style={{ background: "#b8acff" }}></span>
                     <span>Social Media</span>
                  </div>
                  <div className="amount">
                     {traffic === "7" ? "259" : traffic === "15" ? "1,059" : "1509"} <small>23.94%</small>
                  </div>
               </div>
               <div className="traffic-channel-data">
                  <div className="title">
                     <span className="dot dot-lg sq" style={{ background: "#ffa9ce" }}></span>
                     <span>Referrals</span>
                  </div>
                  <div className="amount">
                     {traffic === "7" ? "438" : traffic === "15" ? "282" : "482"} <small>12.94%</small>
                  </div>
               </div>
               <div className="traffic-channel-data">
                  <div className="title">
                     <span className="dot dot-lg sq" style={{ background: "#f9db7b" }}></span>
                     <span>Others</span>
                  </div>
                  <div className="amount">
                     {traffic === "7" ? "438" : traffic === "15" ? "800" : "1000"} <small>4.49%</small>
                  </div>
               </div> */}
            </div>
         </div>
      </React.Fragment >
   );
};
export default TrafficIssueProduction;
