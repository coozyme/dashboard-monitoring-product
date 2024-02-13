import React, { useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import AudienceOverview from "../../../components/partials/analytics/audience-overview/AudienceOverview";
import ActiveUser from "../../../components/partials/analytics/active-user/ActiveUser";
import StatusMachine from "./component/StatusMachine";
import TrafficStatusProduction from "./component/TrafficStatusProduction";
import TrafficIssueProduction from "./component/TrafficIssueProduction";
import TotalCardComponent from "./component/TotalCardComponent";
import TrafficChannel from "../../../components/partials/analytics/traffic-channel/Traffic";
import TrafficDougnut from "../../../components/partials/analytics/traffic-dougnut/TrafficDoughnut";
import UserMap from "../../../components/partials/analytics/user-map/UserMap";
import BrowserUser from "../../../components/partials/analytics/browser-users/BrowserUser";
import PageViewer from "../../../components/partials/analytics/page-view/PageView";
import SessionDevice from "../../../components/partials/analytics/session-devices/SessionDevice";
import { DropdownToggle, DropdownMenu, Card, UncontrolledDropdown, DropdownItem, Spinner } from "reactstrap";
import {
   Block,
   BlockHead,
   BlockHeadContent,
   BlockTitle,
   Icon,
   Button,
   Row,
   Col,
   PreviewAltCard,
} from "../../../components/Component";
import axios from "axios";
import { BaseURL } from "../../../config/config";

const ProductionAnalytic = () => {
   const [sm, updateSm] = useState(false);
   const [spinner, setSpinner] = useState(false);
   const [dataTrafficStatus, setDataTrafficStatus] = useState({});
   const [dataApprovalStatus, setDataApprovalStatus] = useState({});



   const fetchStatusProductions = async () => {
      await axios.get(`${BaseURL}/dashboard/status-productions`)
         .then(res => {
            console.log('DATA', res.data.data)
            setDataTrafficStatus(res.data.data)
            setSpinner(false)
         }).catch(err => {
            setSpinner(false)
            console.log('LOG-ERR-DATA', err)
         })
   }
   const fetchStatusApprovalProductions = async () => {
      await axios.get(`${BaseURL}/dashboard/total-status-checklist-approval`)
         .then(res => {
            console.log('DATA', res.data.data)
            setDataApprovalStatus(res.data.data)
            setSpinner(false)
         }).catch(err => {
            setSpinner(false)
            console.log('LOG-ERR-DATA', err)
         })
   }

   const handleSpineer = () => {
      return (
         <Spinner color="primary" />
      )
   }


   useState(() => {
      setSpinner(true)
      fetchStatusProductions()
      fetchStatusApprovalProductions()
      // console.log('LOG-data-DD', data)
   })
   return (
      <React.Fragment>
         <Head title="Analytics Dashboard" />
         <Content>
            <BlockHead size="sm">
               <div className="nk-block-between">
                  <BlockHeadContent>
                     <BlockTitle page tag="h3">
                        Production Analytics
                     </BlockTitle>
                  </BlockHeadContent>
                  {/* <BlockHeadContent>
                     <div className="toggle-wrap nk-block-tools-toggle">
                        <Button
                           className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                           onClick={() => updateSm(!sm)}
                        >
                           <Icon name="more-v"></Icon>
                        </Button>
                        <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                           <ul className="nk-block-tools g-3">
                              <li>
                                 <UncontrolledDropdown>
                                    <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                                       <Icon className="d-none d-sm-inline" name="calender-date"></Icon>
                                       <span>
                                          <span className="d-none d-md-inline">Last</span> 30 Days
                                       </span>
                                       <Icon className="dd-indc" name="chevron-right"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                       <ul className="link-list-opt no-bdr">
                                          <li>
                                             <DropdownItem
                                                href="#dropdownitem"
                                                onClick={(ev) => {
                                                   ev.preventDefault();
                                                }}
                                             >
                                                Last 30 days
                                             </DropdownItem>
                                          </li>
                                          <li>
                                             <DropdownItem
                                                href="#dropdownitem"
                                                onClick={(ev) => {
                                                   ev.preventDefault();
                                                }}
                                             >
                                                Last 6 months
                                             </DropdownItem>
                                          </li>
                                          <li>
                                             <DropdownItem
                                                href="#dropdownitem"
                                                onClick={(ev) => {
                                                   ev.preventDefault();
                                                }}
                                             >
                                                Last 3 weeks
                                             </DropdownItem>
                                          </li>
                                       </ul>
                                    </DropdownMenu>
                                 </UncontrolledDropdown>
                              </li>
                              <li className="nk-block-tools-opt">
                                 <Button color="primary">
                                    <Icon name="reports"></Icon>
                                    <span>Reports</span>
                                 </Button>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </BlockHeadContent> */}
               </div>
            </BlockHead>

            <Block>
               <Row className="g-gs">
                  {/* <Col lg="7" xxl="6">
                     <PreviewAltCard className="h-100">
                        <AudienceOverview />
                     </PreviewAltCard>
                  </Col> */}
                  {/* <Col md="6" lg="5" xxl="3">
                     <PreviewAltCard className="h-100">
                        <ActiveUser />
                     </PreviewAltCard>
                  </Col> */}
                  <Col lg="4" xxl="4">
                     <PreviewAltCard className="h-100">
                        <TotalCardComponent key="00123" title="Total Order Produksi" total={dataTrafficStatus?.totalData} textInfo={`${dataTrafficStatus?.startDate} - ${dataTrafficStatus?.endDate}`} />
                     </PreviewAltCard>
                  </Col>
                  <Col lg="4" xxl="4">
                     <PreviewAltCard className="h-100">
                        <TotalCardComponent key="0012" title="Total Laporan Approved" total={dataApprovalStatus.approved} textInfo={dataApprovalStatus.dateRange} />
                     </PreviewAltCard>
                  </Col>
                  <Col lg="4" xxl="4">
                     <PreviewAltCard className="h-100">
                        <TotalCardComponent key="01242" title="Total Laporan Not Approved" total={dataApprovalStatus.notApproved} textInfo={dataApprovalStatus.dateRange} />
                     </PreviewAltCard>
                  </Col>
                  <Col md="6" lg="5" xxl="3">
                     <PreviewAltCard className="h-100">
                        <StatusMachine />
                     </PreviewAltCard>
                  </Col>
                  <Col md="6" lg="5" xxl="3">
                     <PreviewAltCard className="h-100">
                        {spinner ? handleSpineer() : <TrafficStatusProduction dataStatus={dataTrafficStatus} />}
                        {/* // <TrafficStatusProduction dataStatus={dataTrafficStatus} /> */}
                     </PreviewAltCard>
                  </Col>
                  <Col md="6" lg="5" xxl="3">
                     <PreviewAltCard className="h-100">
                        <TrafficIssueProduction />
                     </PreviewAltCard>
                  </Col>

                  {/* <Col md="6" xxl="3">
                     <PreviewAltCard className="h-100">
                        <TrafficDougnut />
                     </PreviewAltCard>
                  </Col> */}
                  {/* <Col md="6" xxl="3">
                     <PreviewAltCard className="h-100">
                        <UserMap />
                     </PreviewAltCard>
                  </Col> */}
                  {/* <Col xxl="6">
                     <Card className="h-100">
                        <BrowserUser />
                     </Card>
                  </Col> */}
                  {/* <Col md="6" xxl="3">
                     <Card className="h-100">
                        <PageViewer />
                     </Card>
                  </Col> */}
                  {/* <Col md="6" xxl="3">
                     <PreviewAltCard className="h-100" bodyClass="h-100 stretch flex-column">
                        <SessionDevice />
                     </PreviewAltCard>
                  </Col> */}
               </Row>
            </Block>
         </Content>
      </React.Fragment>
   );
};

export default ProductionAnalytic;
