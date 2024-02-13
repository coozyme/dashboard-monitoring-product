import React from "react";
import { CardTitle } from "reactstrap";
import { Icon, TooltipComponent } from "../../../../components/Component";
// import { BarChart } from "../../charts/sales/Charts";

const TotalCardComponent = ({ title, total, textInfo }) => {
   return (
      <React.Fragment>
         <div className="card-title-group align-start mb-2">
            <CardTitle>
               <h6 className="title">{title}</h6>
            </CardTitle>
            {/* <div className="card-tools">
               <TooltipComponent
                  icon="help-fill"
                  iconClass="card-hint"
                  direction="left"
                  id="Tooltip-2"
                  text={textInfo}
               />
            </div> */}
         </div>
         <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
            <div className="nk-sale-data">
               <span className="amount">{total}</span>
               <span className="sub-title">
                  <span className="change down text-info">
                     <Icon name="calendar-alt" />
                  </span>
                  {textInfo}
               </span>
            </div>
            {/* <div className="nk-sales-ck">
               <BarChart />
            </div> */}
         </div>
      </React.Fragment>
   );
};
export default TotalCardComponent;
