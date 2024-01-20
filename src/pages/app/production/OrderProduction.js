import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import DatePicker from "react-datepicker";
import { orderData, orderProduction, statusOrderProduction, unitOptions } from "./OrderData";
import {
   Block,
   BlockHeadContent,
   BlockTitle,
   BlockBetween,
   BlockHead,
   DataTableHead,
   DataTableItem,
   DataTableRow,
   Icon,
   TooltipComponent,
   PaginationComponent,
   PreviewAltCard,
   Row,
   Col,
   RSelect,
} from "../../../components/Component";
import { getDateStructured } from "../../../utils/Utils";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalBody, Badge } from "reactstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BaseURL } from "../../../config/config";
import moment from "moment/moment";

const OrderProduction = () => {
   const [data, setData] = useState([]);
   const [dataMachine, setDataMachine] = useState([]);
   const [smOption, setSmOption] = useState(false);
   const [notes, setNotes] = useState("");
   const [formData, setFormData] = useState({
      dataId: "",
      orderId: "",
      customer: "",
      machineKode: "",
      machineId: 0,
      machineName: "",
      notes: "",
      targetDaily: 1000,
      unit: 'Meter',
      status: 'OPEN',
      startProductionDate: '',
      endProductionDate: ''
   });
   const [rangeDate, setRangeDate] = useState({
      start: new Date(),
      end: null,
   });
   const [view, setView] = useState({
      add: false,
      details: false,
      edit: false
   });
   const [onSearchText, setSearchText] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [itemPerPage] = useState(7);

   // Changing state value when searching name
   useEffect(() => {
      if (onSearchText !== "") {
         const filteredObject = data.filter((item) => {
            return item.orderId.includes(onSearchText);
         });
         setData([...filteredObject]);
      } else {
         setData([...data]);
      }
   }, [onSearchText]);

   useEffect(() => {
      fetchDataMachine()
      fetchDataOrderProductions()
      console.log('LOG-ERR-FETCH-DATA-MACHINE', dataMachine)
   }, [])


   const fetchDataMachine = async () => {
      const mesin = []
      await axios.get(`${BaseURL}/machine`)
         .then((res) => {
            const data = res.data.data

            data.forEach(d => {
               const m = {
                  id: d.id,
                  value: d.kode,
                  label: `${d.kode} - ${d.name}`,
                  name: d.name
               }

               mesin.push(m)
            });
         }).catch((err) => {
            console.log('LOG-ERR-FETCH-DATA-MACHINE', err)
         })

      setDataMachine(mesin)
   }

   const fetchDataOrderProductions = async () => {
      const orderProductions = []
      await axios.get(`${BaseURL}/product/order-productions`)
         .then((res) => {
            const data = res.data.data

            data.forEach(d => {
               const m = {
                  dataId: d.orderId,
                  orderId: d.orderId,
                  customer: d.customer,
                  machineId: d.machineId,
                  machineKode: d.machineKode,
                  machineName: d.machineName,
                  machineStatus: d.machineStatus,
                  status: d.status,
                  notes: d.notes,
                  startProductionDate: d.startProductionDate,
                  endProductionDate: d.endProductionDate,
               }

               orderProductions.push(m)
            });
            setData(orderProductions)
         }).catch((err) => {
            console.log('LOG-ERR-FETCH-DATA-MACHINE', err)
         })

      setData(mesin)
   }
   // toggle function to view order details
   const toggle = (type) => {
      switch (type.toUpperCase()) {
         case "ADD":
            setView({
               add: true,
               details: false,
               edit: false
            });
            break;
         case "DETAILS":
            setView({
               add: false,
               details: true,
               edit: false
            });
            break;
         case "EDIT":
            setView({
               add: false,
               details: false,
               edit: true
            });
            break;
         default:
            setView({
               add: false,
               details: false,
               edit: false
            });
            break;
      }
   };

   const onRangeChange = (dates) => {
      let [start, end] = dates;
      setRangeDate({ start: start, end: end });
   };

   // selects all the order
   const selectorCheck = (e) => {
      let newData;
      newData = data.map((item) => {
         item.check = e.currentTarget.checked;
         return item;
      });
      setData([...newData]);
   };

   // selects one order
   const onSelectChange = (e, id) => {
      let newData = data;
      let index = newData.findIndex((item) => item.id === id);
      newData[index].check = e.currentTarget.checked;
      setData([...newData]);
   };

   // resets forms
   const resetForm = () => {
      setFormData({
         orderId: "",
         customer: "",
         machineKode: "",
         machineId: 0,
         machineName: "",
         targetDaily: 1000,
         unit: 'Meter',
         status: 'OPEN',
         startProductionDate: '',
         endProductionDate: ''
      });
   };

   const onFormSubmit = async (form) => {
      const { customer, purchased, total } = form;
      let submittedData = {
         orderId: formData.orderId,
         customer: formData.customer,
         machineKode: formData.machineKode,
         machineId: formData.machineId,
         machineName: formData.machineName,
         targetDaily: formData.targetDaily,
         unit: formData.unit,
         status: formData.status,
         startProductionDate: rangeDate.start.toLocaleDateString(),
         endProductionDate: rangeDate.end.toLocaleDateString()
      };
      console.log('LOG-submittedData', submittedData)

      const payload = {
         orderId: submittedData.orderId,
         customer: submittedData.customer,
         machineId: submittedData.machineId,
         status: submittedData.status,
         notes: notes,
         startProductionDate: submittedData.startProductionDate,
         endProductionDate: submittedData.endProductionDate,
      }
      console.log('LOG-submittedData-payload', payload)

      await axios.post(`${BaseURL}/product/add-order-production`, payload)
         .then((res) => {
            setData([submittedData, ...data]);
            setView({ add: false, details: false, edit: false });
            resetForm();
         }).catch((err) => {
            console.log('LOG-ERR-POST-DATA', err)
         })
   };

   const onFormEdit = async (form) => {
      const { customer, purchased, total } = form;
      let submittedData = {
         orderId: formData.orderId,
         customer: formData.customer,
         targetDaily: formData.targetDaily,
         machineKode: formData.machineKode,
         machineId: formData.machineId,
         machineName: formData.machineName,
         unit: formData.unit,
         status: formData.status,
         startProductionDate: rangeDate.start.toLocaleDateString(),
         endProductionDate: rangeDate.end.toLocaleDateString()
      };
      console.log('LOG-submittedEditData', submittedData)

      const payload = {
         orderId: submittedData.orderId,
         customer: submittedData.customer,
         machineId: submittedData.machineId,
         status: submittedData.status,
         notes: notes,
         startProductionDate: submittedData.startProductionDate,
         endProductionDate: submittedData.endProductionDate,
      }
      console.log('LOG-submittedData-payload', payload)


      await axios.put(`${BaseURL}/product/order-production/${formData.dataId}`, payload)
         .then((res) => {
            fetchDataOrderProductions()
            // setData([submittedData, ...data]);
            setView({ add: false, details: false, edit: false });
            resetForm();
         }).catch((err) => {
            console.log('LOG-ERR-POST-DATA', err)
         })

   };

   useEffect(() => {
      reset(formData)
   }, [formData]);

   // function to load detail data
   const loadDetail = (id) => {
      let index = data.findIndex((item) => item.id === id);
      setFormData(data[index]);
   };

   // OnChange function to get the input data
   const onInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   // onChange function for searching name
   const onFilterChange = (e) => {
      setSearchText(e.target.value);
   };

   // function to close the form modal
   const onFormCancel = () => {
      setView({ add: false, details: false });
      resetForm();
   };

   // function to change to approve property for an item
   const markAsDelivered = (id) => {
      let newData = data;
      let index = newData.findIndex((item) => item.id === id);
      newData[index].status = "Delivered";
      setData([...newData]);
   };

   // function to edit a Order
   const editOrder = (orderId) => {
      let defaultData = data;
      defaultData = defaultData.filter((item) => item.orderId === orderId);
      // setData([...defaultData]);
      console.log('LOG-editOrder-defaultData', defaultData)
      setFormData(defaultData[0])
      console.log('LOG-editOrder-formData', formData)
   };
   // function to delete a Order
   const deleteOrder = async (orderId) => {
      let defaultData = data;

      await axios.post(`${BaseURL}/product/order-production/${orderId}`)
         .then(() => {
            console.log('LOG-deleteOrder', orderId)
            fetchDataOrderProductions()
            // defaultData = defaultData.filter((item) => item.orderId !== orderId);
            // setData([...defaultData]);
         }).catch((err) => {
            console.log('LOG-ERR-deleteOrder', err)
         })

   };

   // function to delete the seletected item
   const selectorDeleteOrder = () => {
      let newData;
      newData = data.filter((item) => item.check !== true);
      setData([...newData]);
   };

   // function to change the complete property of an item
   const selectorMarkAsDelivered = () => {
      let newData;
      newData = data.map((item) => {
         if (item.check === true) item.status = "Delivered";
         return item;
      });
      setData([...newData]);
   };

   const getStatus = (status) => {
      const statusValue = {
         status: 'OPEN',
         color: 'light',
         value: 'OPEN'
      }

      switch (status) {
         case 'OPEN':
            statusValue.status = 'OPEN'
            statusValue.color = 'light'
            statusValue.value = 'OPEN'
            return statusValue
         case 'PROCCESS':
            statusValue.status = 'PROCCESS'
            statusValue.color = 'info'
            statusValue.value = 'PROCCESS'
            return statusValue
         case 'FINISH':
            statusValue.status = 'FINISH'
            statusValue.color = 'success'
            statusValue.value = 'FINISH'
            return statusValue
         case 'CLOSED':
            statusValue.status = 'CLOSED'
            statusValue.color = 'dark'
            statusValue.value = 'CLOSED'
            return statusValue
         case 'CANCEL':
            statusValue.status = 'CANCEL'
            statusValue.color = 'primary'
            statusValue.value = 'CANCEL'
            return statusValue
         case 'ON_HOLD':
            statusValue.status = 'ON HOLD'
            statusValue.color = 'warning'
            statusValue.value = 'ON_HOLD'
            return statusValue
         default:
            return statusValue
      }
   }

   // Get current list, pagination
   const indexOfLastItem = currentPage * itemPerPage;
   const indexOfFirstItem = indexOfLastItem - itemPerPage;
   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

   // Change Page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const { reset, register, handleSubmit, formState: { errors } } = useForm();

   return (
      <React.Fragment>
         <Head title="Order Default"></Head>
         <Content>
            <BlockHead size="sm">
               <BlockBetween>
                  <BlockHeadContent>
                     <BlockTitle>Order Production</BlockTitle>
                  </BlockHeadContent>
                  <BlockHeadContent>
                     <div className="toggle-wrap nk-block-tools-toggle">
                        <a
                           href="#more"
                           className="btn btn-icon btn-trigger toggle-expand me-n1"
                           onClick={(ev) => {
                              ev.preventDefault();
                              setSmOption(!smOption);
                           }}
                        >
                           <Icon name="more-v"></Icon>
                        </a>
                        <div className="toggle-expand-content" style={{ display: smOption ? "block" : "none" }}>
                           <ul className="nk-block-tools g-3">
                              {/* <li>
                                 <div className="form-control-wrap">
                                    <div className="form-icon form-icon-right">
                                       <Icon name="search"></Icon>
                                    </div>
                                    <input
                                       type="text"
                                       className="form-control"
                                       id="default-04"
                                       placeholder="Search by orderId"
                                       onChange={(e) => onFilterChange(e)}
                                    />
                                 </div>
                              </li> */}
                              {/* <li>
                                 <UncontrolledDropdown>
                                    <DropdownToggle
                                       color="transparent"
                                       className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                                    >
                                       Status
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                       <ul className="link-list-opt no-bdr">
                                          <li>
                                             <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                                <span>New Items</span>
                                             </DropdownItem>
                                          </li>
                                          <li>
                                             <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                                <span>Featured</span>
                                             </DropdownItem>
                                          </li>
                                          <li>
                                             <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                                <span>Out of Stock</span>
                                             </DropdownItem>
                                          </li>
                                       </ul>
                                    </DropdownMenu>
                                 </UncontrolledDropdown>
                              </li> */}
                              <li className="nk-block-tools-opt">
                                 <Button
                                    className="toggle btn-icon d-md-none"
                                    color="primary"
                                    onClick={() => {
                                       toggle("add");
                                    }}
                                 >
                                    <Icon name="plus"></Icon>
                                 </Button>
                                 <Button
                                    className="toggle d-none d-md-inline-flex"
                                    color="primary"
                                    onClick={() => {
                                       toggle("add");
                                    }}
                                 >
                                    <Icon name="plus"></Icon>
                                    <span>Add Order Production</span>
                                 </Button>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </BlockHeadContent>
               </BlockBetween>
            </BlockHead>

            <Block>
               <div className="nk-tb-list is-separate is-medium mb-3">
                  <DataTableHead className="nk-tb-item">
                     {/* <DataTableRow className="nk-tb-col-check">
                        <div className="custom-control custom-control-sm custom-checkbox notext">
                           <input
                              type="checkbox"
                              className="custom-control-input"
                              id="pid-all"
                              onChange={(e) => selectorCheck(e)}
                           />
                           <label className="custom-control-label" htmlFor="pid-all"></label>
                        </div>
                     </DataTableRow> */}
                     <DataTableRow>
                        <span className="sub-text">Order ID</span>
                     </DataTableRow>
                     <DataTableRow>
                        <span className="sub-text">Customer Name</span>
                     </DataTableRow>
                     <DataTableRow>
                        <span className="sub-text">Kode Mesin</span>
                     </DataTableRow>
                     {/* <DataTableRow>
                        <span className="sub-text">Target Harian</span>
                     </DataTableRow> */}
                     {/* <DataTableRow>
                        <span className="sub-text">Unit</span>
                     </DataTableRow> */}
                     <DataTableRow>
                        <span className="sub-text">Status Mesin</span>
                     </DataTableRow>
                     <DataTableRow>
                        <span className="sub-text">Status Produksi</span>
                     </DataTableRow>
                     <DataTableRow size="sm">
                        <span className="sub-text">Tanggal Proses Produksi</span>
                     </DataTableRow>
                     {/* <DataTableRow size="md">
                        <span className="sub-text">Purchased</span>
                     </DataTableRow> */}
                     {/* <DataTableRow>
                        <span className="sub-text">Total</span>
                     </DataTableRow> */}

                     <DataTableRow className="nk-tb-col-tools">
                        <ul className="nk-tb-actions gx-1 my-n1">
                           <li>
                              <UncontrolledDropdown>
                                 <DropdownToggle tag="a" className="btn btn-trigger dropdown-toggle btn-icon me-n1">
                                    <Icon name="more-h"></Icon>
                                 </DropdownToggle>
                                 {/* <DropdownMenu end>
                                    <ul className="link-list-opt no-bdr">
                                       <li>
                                          <DropdownItem
                                             tag="a"
                                             href="#markasdone"
                                             onClick={(ev) => {
                                                ev.preventDefault();
                                                selectorMarkAsDelivered();
                                             }}
                                          >
                                             <Icon name="truck"></Icon>
                                             <span>Mark As Delivered</span>
                                          </DropdownItem>
                                       </li>
                                       <li>
                                          <DropdownItem
                                             tag="a"
                                             href="#remove"
                                             onClick={(ev) => {
                                                ev.preventDefault();
                                                selectorDeleteOrder();
                                             }}
                                          >
                                             <Icon name="trash"></Icon>
                                             <span>Remove Orders</span>
                                          </DropdownItem>
                                       </li>
                                    </ul>
                                 </DropdownMenu> */}
                              </UncontrolledDropdown>
                           </li>
                        </ul>
                     </DataTableRow>
                  </DataTableHead>

                  {currentItems.length > 0
                     ? currentItems.map((item, idx) => (
                        <DataTableItem key={item.id}>
                           {/* <DataTableRow className="nk-tb-col-check">
                              <div className="custom-control custom-control-sm custom-checkbox notext">
                                 <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    defaultChecked={item.check}
                                    id={item.id + "oId-all"}
                                    key={Math.random()}
                                    onChange={(e) => onSelectChange(e, item.id)}
                                 />
                                 <label className="custom-control-label" htmlFor={item.id + "oId-all"}></label>
                              </div>
                           </DataTableRow> */}
                           <DataTableRow>
                              <span className="tb-sub">{item.orderId}</span>
                           </DataTableRow>
                           <DataTableRow>
                              <span className="tb-sub">{item.customer}</span>
                           </DataTableRow>
                           <DataTableRow>
                              {/* <a href="#id" onClick={(ev) => ev.preventDefault()}>
                                 #{item.orderId}
                              </a> */}
                              <span className="tb-sub">{item.machineKode}</span>
                           </DataTableRow>
                           {/* <DataTableRow >
                              <span className="tb-sub">{item.machineName}ALSDAS</span>
                           </DataTableRow> */}
                           {/* <DataTableRow >
                              <span className="tb-sub">{item.targetDaily}</span>
                           </DataTableRow> */}
                           {/* <DataTableRow size="sm">
                              <span className="tb-sub">{item.unit}</span>
                           </DataTableRow> */}
                           <DataTableRow>
                              <DataTableRow>
                                 <Badge
                                    className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                    color={
                                       item.machineStatus == true ? "success" : "warning"
                                    }
                                 >
                                    {item.machineStatus == true ? "READY" : "NOT READY"}
                                 </Badge>
                              </DataTableRow>
                           </DataTableRow>
                           <DataTableRow>
                              <DataTableRow>
                                 <span
                                    className={`dot bg-${getStatus(item.status).color} d-sm-none`}
                                 ></span>
                                 <Badge
                                    className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                    color={
                                       getStatus(item.status).color
                                    }
                                 >
                                    {getStatus(item.status).status}
                                 </Badge>
                              </DataTableRow>
                           </DataTableRow>
                           <DataTableRow>
                              <span>{item.startProductionDate} -  {item.endProductionDate}</span>
                              {/* <span className="tb-lead">$ {item.total}</span> */}
                           </DataTableRow>
                           <DataTableRow className="nk-tb-col-tools">
                              <ul className="nk-tb-actions gx-1">
                                 {/* {item.status !== "Delivered" && (
                                    <li className="nk-tb-action-hidden" onClick={() => markAsDelivered(item.id)}>
                                       <TooltipComponent
                                          tag="a"
                                          containerClassName="btn btn-trigger btn-icon"
                                          id={"delivery" + item.id}
                                          icon="truck"
                                          direction="top"
                                          text="Mark as Delivered"
                                       />
                                    </li>
                                 )} */}
                                 {/* <li
                                    className="nk-tb-action-hidden"
                                    onClick={() => {
                                       loadDetail(item.id);
                                       toggle("details");
                                    }}
                                 >
                                    <TooltipComponent
                                       tag="a"
                                       containerClassName="btn btn-trigger btn-icon"
                                       id={"view" + item.id}
                                       icon="eye"
                                       direction="top"
                                       text="View Details"
                                    />
                                 </li> */}
                                 <li>
                                    <UncontrolledDropdown>
                                       <DropdownToggle tag="a" className="btn btn-icon dropdown-toggle btn-trigger">
                                          <Icon name="more-h"></Icon>
                                       </DropdownToggle>
                                       <DropdownMenu end>
                                          <ul className="link-list-opt no-bdr">
                                             <li>
                                                <DropdownItem
                                                   tag="a"
                                                   href="#dropdown"
                                                   onClick={(ev) => {
                                                      ev.preventDefault();
                                                      // setFormData(setFormData({ ...formData, dataId: item.orderId }))
                                                      editOrder(item.orderId);
                                                      onRangeChange([new Date(item.startProductionDate), new Date(item.endProductionDate)])
                                                      setNotes(item.notes)
                                                      toggle("edit");
                                                   }}
                                                >
                                                   <Icon name="pen"></Icon>
                                                   <span>Edit Order Production</span>
                                                </DropdownItem>
                                             </li>
                                             {/* {item.status !== "Delivered" && (
                                                <li>
                                                   <DropdownItem
                                                      tag="a"
                                                      href="#dropdown"
                                                      onClick={(ev) => {
                                                         ev.preventDefault();
                                                         markAsDelivered(item.id);
                                                      }}
                                                   >
                                                      <Icon name="truck"></Icon>
                                                      <span>Mark as Delivered</span>
                                                   </DropdownItem>
                                                </li>
                                             )} */}
                                             <li>
                                                <DropdownItem
                                                   tag="a"
                                                   href="#dropdown"
                                                   onClick={(ev) => {
                                                      ev.preventDefault();
                                                      deleteOrder(item.orderId);
                                                   }}
                                                >
                                                   <Icon name="trash"></Icon>
                                                   <span>Remove Order Production</span>
                                                </DropdownItem>
                                             </li>
                                          </ul>
                                       </DropdownMenu>
                                    </UncontrolledDropdown>
                                 </li>
                              </ul>
                           </DataTableRow>
                        </DataTableItem>
                     ))
                     : null}
               </div>
               <PreviewAltCard>
                  {data.length > 0 ? (
                     <PaginationComponent
                        itemPerPage={itemPerPage}
                        totalItems={data.length}
                        paginate={paginate}
                        currentPage={currentPage}
                     />
                  ) : (
                     <div className="text-center">
                        <span className="text-silent">No orders found</span>
                     </div>
                  )}
               </PreviewAltCard>
            </Block>
            {/* FORM ADD  */}
            <Modal isOpen={view.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
               <ModalBody>
                  <a href="#cancel" className="close">
                     {" "}
                     <Icon
                        name="cross-sm"
                        onClick={(ev) => {
                           ev.preventDefault();
                           onFormCancel();
                        }}
                     ></Icon>
                  </a>
                  <div className="p-2">
                     <h5 className="title">Add Order Production</h5>
                     <div className="mt-4">
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                           <Row className="g-3">
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="orderId">
                                       Order ID
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          type="text"
                                          className="form-control"
                                          {...register('orderId', {
                                             required: "This field is required",
                                          })}
                                          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                          value={formData.orderId} />
                                       {errors.orderId && <span className="invalid">{errors.orderId.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="customer">
                                       Customer Name
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          type="text"
                                          className="form-control"
                                          {...register('customer', {
                                             required: "This field is required",
                                          })}
                                          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                          value={formData.customer} />
                                       {errors.customer && <span className="invalid">{errors.customer.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="machine">
                                       Mesin
                                    </label>
                                    <div className="form-control-wrap">
                                       <RSelect
                                          name="machine"
                                          options={dataMachine}
                                          onChange={(e) => setFormData({ ...formData, machineKode: e.value, machineId: e.id, machineName: e.name })}
                                          value={{ id: formData.machineId, value: formData.machineKode, name: formData.machineName, label: `${formData.machineKode} - ${formData.machineName}` }}
                                       />
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="dateOfOrderProduction">
                                       Date of Order Production
                                    </label>
                                    <div className="form-control-wrap">
                                       {/* <DatePicker
                                          selected={formData.date}
                                          className="form-control"
                                          onChange={(date) => setFormData({ ...formData, date: date })}
                                       /> */}
                                       <div className="form-control-wrap">
                                          <DatePicker
                                             selected={rangeDate.start}
                                             startDate={rangeDate.start}
                                             onChange={onRangeChange}
                                             endDate={rangeDate.end}
                                             selectsRange
                                             className="form-control date-picker"
                                          />{" "}
                                       </div>
                                       {errors.dateOfOrderProduction && <span className="invalid">{errors.dateOfOrderProduction.message}</span>}
                                    </div>
                                 </div>
                              </Col>

                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="status">
                                       Status
                                    </label>
                                    <div className="form-control-wrap">
                                       <RSelect
                                          name="status"
                                          options={statusOrderProduction}
                                          onChange={(e) => setFormData({ ...formData, status: e.value })}
                                          value={{ value: formData.status, label: formData.status }}
                                       />
                                    </div>
                                 </div>
                              </Col>

                              <Col className="col-6">
                                 <div className="form-control-wrap">
                                    <label className="form-label" htmlFor="notes">
                                       Notes
                                    </label>
                                    <div className="input-group">
                                       <textarea id="notes" name="notes" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                    </div>
                                 </div>
                              </Col>


                              <Col size="12">
                                 <Button color="primary" type="submit">
                                    <Icon className="plus"></Icon>
                                    <span>Add Order</span>
                                 </Button>
                              </Col>
                           </Row>
                        </form>
                     </div>
                  </div>
               </ModalBody>
            </Modal>

            {/* FORM EDIT */}
            <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
               <ModalBody>
                  <a href="#cancel" className="close">
                     {" "}
                     <Icon
                        name="cross-sm"
                        onClick={(ev) => {
                           ev.preventDefault();
                           onFormCancel();
                        }}
                     ></Icon>
                  </a>
                  <div className="p-2">
                     <h5 className="title">Edit Order Production</h5>
                     <div className="mt-4">
                        <form onSubmit={handleSubmit(onFormEdit)}>
                           <Row className="g-3">
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="orderId">
                                       Order ID
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          type="text"
                                          className="form-control"
                                          {...register('orderId', {
                                             required: "This field is required",
                                          })}
                                          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                          value={formData.orderId} />
                                       {errors.orderId && <span className="invalid">{errors.orderId.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="customer">
                                       Customer Name
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          type="text"
                                          className="form-control"
                                          {...register('customer', {
                                             required: "This field is required",
                                          })}
                                          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                          value={formData.customer} />
                                       {errors.customer && <span className="invalid">{errors.customer.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="machine">
                                       Mesin
                                    </label>
                                    <div className="form-control-wrap">
                                       <RSelect
                                          name="machine"
                                          options={dataMachine}
                                          onChange={(e) => setFormData({ ...formData, machineKode: e.value, machineId: e.id, machineName: e.name })}
                                          value={{ id: formData.machineId, value: formData.machineKode, name: formData.machineName, label: `${formData.machineKode} - ${formData.machineName}` }}
                                       />
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="dateOfOrderProduction">
                                       Date of Order Production
                                    </label>
                                    <div className="form-control-wrap">
                                       {/* <DatePicker
                                          selected={formData.date}
                                          className="form-control"
                                          onChange={(date) => setFormData({ ...formData, date: date })}
                                       /> */}
                                       <div className="form-control-wrap">
                                          <DatePicker
                                             selected={rangeDate.start}
                                             startDate={rangeDate.start}
                                             onChange={onRangeChange}
                                             endDate={rangeDate.end}
                                             selectsRange
                                             className="form-control date-picker"
                                          />{" "}
                                       </div>
                                       {errors.dateOfOrderProduction && <span className="invalid">{errors.dateOfOrderProduction.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              {/* <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="targetDaily">
                                       Target Harian
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          type="number"
                                          className="form-control"
                                          {...register('targetHarian', { required: "This is required" })}
                                          value={formData.targetDaily}
                                          onChange={(e) => setFormData({ ...formData, targetDaily: e.target.value })} />
                                       {errors.targetDaily && <span className="invalid">{errors.targetDaily.message}</span>}
                                    </div>
                                 </div>
                              </Col> */}

                              {/* <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="unit">
                                       Unit
                                    </label>
                                    <div className="form-control-wrap">
                                       <RSelect
                                          name="unit"
                                          options={unitOptions}
                                          onChange={(e) => setFormData({ ...formData, unit: e.value })}
                                          value={{ value: formData.unit, label: formData.unit }}
                                       />
                                    </div>
                                 </div>
                              </Col> */}

                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="status">
                                       Status
                                    </label>
                                    <div className="form-control-wrap">
                                       <RSelect
                                          name="status"
                                          options={statusOrderProduction}
                                          onChange={(e) => setFormData({ ...formData, status: e.value })}
                                          value={{ value: getStatus(formData.status).value, label: getStatus(formData.status).status }}
                                       />
                                    </div>
                                 </div>
                              </Col>

                              <Col className="col-6">
                                 <div className="form-control-wrap">
                                    <label className="form-label" htmlFor="notes">
                                       Notes
                                    </label>
                                    <div className="input-group">
                                       <textarea id="notes" name="notes" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                                    </div>
                                 </div>
                              </Col>


                              <Col size="12">
                                 <Button color="primary" type="submit">
                                    <Icon className="plus"></Icon>
                                    <span>Update Order Production</span>
                                 </Button>
                              </Col>
                           </Row>
                        </form>
                     </div>
                  </div>
               </ModalBody>
            </Modal>

            <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
               <ModalBody>
                  <a href="#cancel" className="close">
                     {" "}
                     <Icon
                        name="cross-sm"
                        onClick={(ev) => {
                           ev.preventDefault();
                           onFormCancel();
                        }}
                     ></Icon>
                  </a>
                  <div className="nk-tnx-details mt-sm-3">
                     <div className="nk-modal-head mb-3">
                        <h5 className="title">Order Details</h5>
                     </div>
                     <Row className="gy-3">
                        <Col lg={6}>
                           <span className="sub-text">Order Id</span>
                           <span className="caption-text">{formData.orderId}</span>
                        </Col>
                        <Col lg={6}>
                           <span className="sub-text">Status</span>
                           <span
                              className={`dot bg-${formData.status === "Delivered" ? "success" : "warning"} d-sm-none`}
                           ></span>
                           <Badge
                              className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                              color={
                                 formData.status === "Delivered" ? "success" : "warning"
                              }
                           >
                              {formData.status}
                           </Badge>
                        </Col>
                        <Col lg={6}>
                           <span className="sub-text">Customer</span>
                           <span className="caption-text">{formData.customer}</span>
                        </Col>
                        <Col lg={6}>
                           <span className="sub-text">Purchased Product</span>
                           <span className="caption-text">{formData.purchased}</span>
                        </Col>
                        <Col lg={6}>
                           <span className="sub-text">Total Price</span>
                           <span className="caption-text">{formData.total}</span>
                        </Col>
                     </Row>
                  </div>
               </ModalBody>
            </Modal>
         </Content>
      </React.Fragment>
   );
};

export default OrderProduction;
