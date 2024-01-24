import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import DatePicker from "react-datepicker";
import { orderData, orderProduction, statusOrderProduction, unitOptions } from "./OrderData";
import { GetIssueCategory } from "./actions";
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

const OrderProductionReport = () => {
   let navigate = useNavigate()
   const [data, setData] = useState([]);
   const [dataMachine, setDataMachine] = useState([]);
   const [dataIssue, setDataIssue] = useState([]);
   const [dataUser, setDataUser] = useState({});
   const [smOption, setSmOption] = useState(false);
   const [formData, setFormData] = useState({
      productionId: false,
      reportedBy: false,
      material: "",
      issueId: false,
      issueName: "",
      quantity: 0,
      unit: "Meter",
      notes: "",
      productionDate: "",
   });
   const [note, setNote] = useState("");
   const [rangeDate, setRangeDate] = useState({
      start: new Date(),
      end: null,
   });
   const [view, setView] = useState({
      add: false,
      details: false,
      edit: false
   });
   const [startIconDate, setStartIconDate] = useState(new Date());
   const [onSearchText, setSearchText] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [itemPerPage] = useState(7);

   // Changing state value when searching name
   useEffect(() => {
      if (onSearchText !== "") {
         const filteredObject = data.filter((item) => {
            return item?.orderId.includes(onSearchText);
         });
         setData([...filteredObject]);
      } else {
         fetchDataOrderProductions()
         // setData([...data]);
      }
   }, [onSearchText]);

   useEffect(() => {
      fetchDataMachine()
      fetchDataOrderProductions()
      fetchDataIssueCategories()
      console.log('LOG-ERR-FETCH-DATA-MACHINE', dataMachine)
      console.log('LOG-ERR-FETCH-DATA-dataIssue', dataIssue)
   }, [])

   useEffect(() => {
      const data = JSON.parse(localStorage.getItem("user"));
      setDataUser(data);
   }, [dataUser])

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

   const fetchDataIssueCategories = async () => {
      const issues = []

      await axios.get(`${BaseURL}/categories/issues`).then((res) => {
         console.log('LOG-issue', res)
         const data = res.data.data
         if (data) {
            data.forEach(d => {
               const m = {
                  value: d.id,
                  label: d.issueName,
               }

               issues.push(m)
            });
         }
      }).catch((err) => {
         console.log("LOG-ERROR-GetIssueCategory: ", err)
      })

      setDataIssue(issues)
      console.log("LOG-GetIssueCategory", dataIssue)
   }

   const fetchDataOrderProductions = async () => {
      const orderProductions = []
      await axios.get(`${BaseURL}/product/order-productions`)
         .then((res) => {
            const data = res.data.data

            data.forEach(d => {
               const m = {
                  productionId: d.id,
                  orderId: d.orderId,
                  customer: d.customer,
                  machineId: d.machineId,
                  machineKode: d.machineKode,
                  machineName: d.machineName,
                  status: d.status,
                  startProductionDate: d.startProductionDate,
                  endProductionDate: d.endProductionDate,
               }

               orderProductions.push(m)
            });
            setData(orderProductions)
         }).catch((err) => {
            console.log('LOG-ERR-FETCH-DATA-MACHINE', err)
         })

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
      const [start, end] = dates;
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
         productionId: null,
         material: "",
         reportedBy: null,
         issueId: null,
         issueName: "",
         quantity: 0,
         unit: "Meter",
         notes: "",
         productionDate: "",
      });
   };

   const onFormSubmit = async () => {
      const payload = {
         productionId: formData.productionId,
         reportedBy: dataUser.employeeId,
         material: formData.material,
         quantity: formData.quantity,
         unit: formData.unit,
         notes: note,
         issueId: formData.issueId,
         productionDate: startIconDate,
      }
      console.log('LOG-submittedData-payload', payload)

      // await axios.post(`${BaseURL}/product/add-order-production`, payload)
      //    .then((res) => {
      //       setData([submittedData, ...data]);
      //       setView({ add: false, details: false, edit: false });
      //       resetForm();
      //    }).catch((err) => {
      //       console.log('LOG-ERR-POST-DATA', err)
      //    })
      event.preventDefault()
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
         startProductionDate: submittedData.startProductionDate,
         endProductionDate: submittedData.endProductionDate,
      }
      console.log('LOG-submittedData-payload', payload)


      await axios.put(`${BaseURL}/product/order-production/${submittedData.orderId}`, payload)
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

   const onEditSubmit = async () => {
      console.log('LOG-onEditSubmit-formData', formData)
      // let submittedData;
      // let newItems = data;
      // let index = newItems.findIndex((item) => item.id === editId);

      // newItems.forEach((item) => {
      //    if (item.id === editId) {
      //       submittedData = {
      //          id: editId,
      //          name: formData.name,
      //          img: files.length > 0 ? files[0].preview : item.img,
      //          sku: formData.sku,
      //          price: formData.price,
      //          salePrice: formData.salePrice,
      //          stock: formData.stock,
      //          category: formData.category,
      //          fav: false,
      //          check: false,
      //       };
      //    }
      // });
      // newItems[index] = submittedData;
      // //setData(newItems);
      // resetForm();
      // setView({ edit: false, add: false });
   };

   const addReport = () => {
   }
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
                     <BlockTitle>Production Report</BlockTitle>
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
                              <li>
                                 <div className="form-control-wrap">
                                    <div className="form-icon form-icon-right">
                                       <Icon name="search"></Icon>
                                    </div>
                                    <input
                                       type="text"
                                       className="form-control"
                                       id="default-04"
                                       placeholder="Search by orderID"
                                       onChange={(e) => onFilterChange(e)}
                                    />
                                 </div>
                              </li>
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
                              {/* <li className="nk-block-tools-opt">
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
                              </li> */}
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
                        <span className="sub-text">Kode Mesin</span>
                     </DataTableRow>
                     <DataTableRow>
                        <span className="sub-text">Nama Mesin</span>
                     </DataTableRow>
                     {/* <DataTableRow>
                        <span className="sub-text">Target Harian</span>
                     </DataTableRow> */}
                     {/* <DataTableRow>
                        <span className="sub-text">Unit</span>
                     </DataTableRow> */}
                     <DataTableRow>
                        <span className="sub-text">Status</span>
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
                        <DataTableItem key={idx}>
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
                              {/* <a href="#id" onClick={(ev) => ev.preventDefault()}>
                                 #{item.orderId}
                              </a> */}
                              <span className="tb-sub">{item.machineKode}</span>
                           </DataTableRow>
                           <DataTableRow>
                              <span className="tb-sub">{item.machineName}</span>
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
                                                      // editOrder(item.orderId);
                                                      // onRangeChange([new Date(item.startProductionDate), new Date(item.endProductionDate)])
                                                      setFormData({ ...data, productionId: item.productionId })
                                                      navigate(`create-report`, {
                                                         state: {
                                                            productionId: item.productionId,
                                                            orderId: item.orderId,
                                                         }
                                                      })
                                                      // toggle("add");
                                                   }}
                                                >
                                                   <Icon name="plus"></Icon>
                                                   <span>Buat Laporan Harian</span>
                                                </DropdownItem>
                                             </li>
                                             <li>
                                                <DropdownItem
                                                   tag="a"
                                                   href="#dropdown"
                                                   onClick={(ev) => {
                                                      ev.preventDefault();
                                                      navigate(`detail-report`, {
                                                         state: {
                                                            productionId: item.productionId,
                                                            orderId: item.orderId,
                                                         }
                                                      })
                                                      // toggle("details");
                                                   }}
                                                >
                                                   <Icon name="eye"></Icon>
                                                   <span>Lihat Detail Laporan</span>
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
                     <h5 className="title">Buat Laporan Harian Produksi</h5>
                     <div className="mt-4">
                        <form noValidate onSubmit={handleSubmit(onFormSubmit)} >
                           <Row className="g-3">
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="dateOfProduction">
                                       Tanggal Produksi
                                    </label>
                                    <div className="form-control-wrap">
                                       <div className="form-control-wrap">
                                          <div className="form-icon form-icon-left">
                                             <Icon name="calendar"></Icon>
                                          </div>
                                          <DatePicker
                                             id="dateOfProduction"
                                             name="dateOfProduction"
                                             selected={startIconDate}
                                             className="form-control date-picker"
                                             onChange={setStartIconDate}
                                          // customInput={<ExampleCustomInput />}
                                          />
                                       </div>
                                       <div className="form-note">
                                          Format Tanggal <code>mm/dd/yyyy</code>
                                       </div>
                                       {errors.dateOfProduction && <span className="invalid">{errors.dateOfProduction.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="material">
                                       Material
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          id="material"
                                          name="material"
                                          type="text"
                                          className="form-control"
                                          {...register('material', {
                                             required: "This field is required",
                                          })}
                                          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                          value={formData.material} />
                                       {errors.material && <span className="invalid">{errors.material.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="quantity">
                                       Quantity
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          id="quantity"
                                          type="number"
                                          step="any"
                                          className="form-control"
                                          {...register('quantity', { required: "This is required" })}
                                          value={formData.quantity}
                                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                                       {errors.quantity && <span className="invalid">{errors.quantity.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <span className="form-label" htmlFor="select-unit">
                                       Unit
                                    </span>
                                    <div className="form-control-wrap">
                                       <RSelect
                                          id="select-unit"
                                          name="unit"
                                          options={unitOptions}
                                          onChange={(e) => setFormData({ ...formData, unit: e.value })}
                                          value={{ value: formData.unit, label: formData.unit }}
                                       />
                                    </div>
                                 </div>
                              </Col>

                              <Col md="4">
                                 <div className="form-group">
                                    <span className="form-label" htmlFor="select-issue">
                                       Issue
                                    </span>
                                    <div className="form-control-wrap">
                                       <RSelect
                                          id="select-issue"
                                          options={dataIssue}
                                          onChange={(e) => setFormData({ ...formData, issueId: e.value, issueName: e.label })}
                                          value={{ value: formData.issueId, label: formData.issueName }}
                                       />
                                    </div>
                                 </div>
                              </Col>

                              <Col className="col-8">
                                 <div className="form-control-wrap">
                                    <label className="form-label" htmlFor="notes">
                                       Notes
                                    </label>
                                    <div className="input-group">
                                       <textarea id="notes" name="notes" className="form-control" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                                    </div>
                                 </div>
                              </Col>


                              <Col size="12">
                                 <Button color="primary" type="submit">
                                    <span>Submit Laporan</span>
                                 </Button>
                              </Col>
                           </Row>
                        </form>
                     </div>
                  </div>
               </ModalBody>
            </Modal>


         </Content>
      </React.Fragment>
   );
};

export default OrderProductionReport;
