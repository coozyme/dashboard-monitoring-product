import React, { useEffect, useState, useRef } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import DatePicker from "react-datepicker";
import { orderData, orderProduction, statusOrderProduction, unitOptions, dataMaterial } from "./OrderData";
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
   BlockDes,
   RSelect,
} from "../../../components/Component";
import { getDateStructured } from "../../../utils/Utils";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalHeader, ModalBody, Badge, Dropdown, Card, Spinner } from "reactstrap";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import { BaseURL } from "../../../config/config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SpecialTable } from "./SpecialTable";
import { CalculateMaterialProduction, ConvertToMeter } from "../../../utils/Helper";

const CreateDailyReportProduction = () => {
   let navigate = useNavigate()
   const { state } = useLocation()
   // const { orderId, productionId } = useParams;
   // const calculationRef = useRef([]);
   const [data, setData] = useState([]);
   const [dataMachine, setDataMachine] = useState([]);
   const [dataIssue, setDataIssue] = useState([]);
   const [dataUser, setDataUser] = useState({});
   const [dataInformationProduksi, setDataInformationProduksi] = useState({
      productionId: state?.productionId,
      reportedBy: null,
      issueId: null,
      issueName: "",
      notes: "",
      productionDate: "",
   });
   const [totalInKg, setTotalInKg] = useState(0)
   const [totalInMeter, setTotalInMeter] = useState(0)
   const [smOption, setSmOption] = useState(false);
   const [formData, setFormData] = useState({
      id: false,
      productionId: state?.productionId,
      reportedBy: null,
      material: "",
      issueId: null,
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
      edit: false,
      keterangan: false,
      material: false,
   });
   const [startIconDate, setStartIconDate] = useState(new Date());
   const [onSearchText, setSearchText] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [itemPerPage] = useState(7);

   const [isOpen, setIsOpen] = useState(false);
   const [modalSuccess, setModalSuccess] = useState(false);
   const [modalFail, setModalFail] = useState(false);
   const [loadingButtonSubmit, setLoadingButtonSubmit] = useState(false);

   const toggleDropdown = () => { setIsOpen(!isOpen) };
   const toggleModalFail = () => setModalFail(!modalFail);

   // Changing state value when searching name
   // useEffect(() => {
   //    if (onSearchText !== "") {
   //       const filteredObject = data.filter((item) => {
   //          return item.orderId.includes(onSearchText);
   //       });
   //       setData([...filteredObject]);
   //    } else {
   //       setData([...data]);
   //    }
   // }, [onSearchText]);
   const toggleSuccess = () => {
      setModalSuccess(!modalSuccess)
      navigate('/production-report')
   };

   useEffect(() => {
      fetchDataMachine()
      // fetchDataOrderProductions()
      fetchDataIssueCategories()

      console.log('LOG-ERR-FETCH-DATA-dataIssue', dataIssue)
   }, [])

   useEffect(() => {
      const dataUser = JSON.parse(localStorage.getItem("user"));
      setDataUser(dataUser);
   }, [dataUser])


   const sycnTotalProduksi = (datas) => {
      // let totalinMeter = 0;
      // let totalinKg = 0;
      // if (datas?.length === 0) {
      //    setTotalInMeter(totalMeter)
      //    setTotalInKg(totalKg)
      // }
      // setTimeout(() => {
      const { totalMeter, totalKg } = CalculateMaterialProduction(datas)
      // const totalKg = CalculateMaterialProduction(datas).totalKg
      // datas.map((item) => {
      // // const meter = 0
      //    if (item.unit?.toUpperCase() === "KG") {
      //       totalinKg += quantity;
      //    } else {
      //       totalinMeter += ConvertToMeter(unit, quantity);
      //    }
      // // });

      // console.log('LOG-totalan', totalMeter, totalKg)
      setTotalInMeter(totalMeter)
      setTotalInKg(totalKg)

      // }, 100);
      // console.log('LOG-OOP', datas?.length)
   }

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
               edit: false,
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
         case "KETERANGAN":
            setView({
               keterangan: true,
               material: false,
               add: false,
               details: false,
               edit: false
            });
            break;
         case "MATERIAL":
            setView({
               keterangan: false,
               material: true,
               add: false,
               details: false,
               edit: false
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
         material: "",
         reportedBy: null,
         issueId: null,
         issueName: "",
         quantity: 0,
         unit: "Meter",
         notes: "",
         productionDate: "",
      });
      reset(formData)
   };

   const submitData = async () => {
      setLoadingButtonSubmit(true)
      const payload = {
         productionId: state.productionId,
         reportedBy: dataUser.employeeId,
         materialData: data,
         notes: dataInformationProduksi.notes,
         issueId: dataInformationProduksi.issueId,
         productionDate: dataInformationProduksi.productionDate,
      }
      console.log('LOG-submitData-payload', payload)

      await axios.post(`${BaseURL}/product/create-reporting-production`, payload)
         .then((res) => {
            // setData([submittedData, ...data]);
            setLoadingButtonSubmit(false)
            setModalSuccess(true)

            setView({ add: false, details: false, edit: false });
            resetForm();
         }).catch((err) => {
            setLoadingButtonSubmit(false)
            setModalSuccess(false)
            setModalFail(true)
            console.log('LOG-ERR-POST-DATA', err)
         })
      event.preventDefault()
   };

   const onFormSaveMaterial = async () => {
      const materialForm = {
         material: formData.material,
         quantity: parseFloat(formData.quantity),
         unit: formData.unit,
      }
      console.log('LOG-onFormSaveMaterial', materialForm)
      console.log('LOG-onFormSaveMaterial-data-before', data.length)
      setData([...data, materialForm])
      console.log('LOG-onFormSaveMaterial-data-after', data.length)
      setView({ ...view, material: false });
      // sycnTotalProduksi(data)
      resetForm()
   };

   const onFormEditMaterial = async () => {
      const materialForm = {
         material: formData.material,
         quantity: parseFloat(formData.quantity),
         unit: formData.unit,
      }
      console.log('LOG-onFormSaveMaterial', materialForm)
      console.log('LOG-onFormSaveMaterial-data', data)
      console.log('LOG-onFormSaveMaterial-formData', formData)

      setData(oldValues => { return oldValues.filter((item, index) => index !== formData.id).concat(materialForm) })
      // sycnTotalProduksi(data)
      setView({ ...view, edit: false });
   };

   const onFormSaveKeterangan = async () => {
      console.log('LOG-onFormSubmitKeterangan', formData, startIconDate.toLocaleDateString(), note)
      setDataInformationProduksi({ ...dataInformationProduksi, productionDate: startIconDate.toLocaleDateString(), issueId: formData.issueId, issueName: formData.issueName, notes: note })
      // setFormData({ ...formData, notes: note, productionDate: startIconDate.toLocaleDateString(), issueId: formData.issueId, issueName: formData.issueName })
      setView({ ...view, keterangan: false });
      event.preventDefault()
   }

   const deleteMaterial = async (id) => {
      setData(oldValues => { return oldValues.filter((item, index) => index !== id) })
      // sycnTotalProduksi(data)
   }
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
      setView({ add: false, details: false, edit: false, keterangan: false, material: false });
      // resetForm();
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
            statusValue.color = 'primary'
            statusValue.value = 'CLOSED'
            return statusValue
         case 'CANCEL':
            statusValue.status = 'CANCEL'
            statusValue.color = 'indigo'
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

                     <BlockTitle>
                        Buat Laporan Produksi
                        <strong className="text-primary small"> #{state.orderId}</strong >
                     </BlockTitle>
                  </BlockHeadContent>
                  <BlockHeadContent>
                     <div className="toggle-wrap nk-block-tools-toggle">
                        <div className="toggle-expand-content" style={{ display: smOption ? "block" : "none" }}>
                           <ul className="nk-block-tools g-3">
                              <li className="nk-block-tools-opt">
                                 {/* <Button
                                    className="toggle btn-icon d-md-none"
                                    color="primary"
                                    onClick={() => {
                                       toggle("add");
                                    }}
                                 >
                                    <Icon name="down"></Icon>
                                 </Button> */}

                                 <Dropdown isOpen={isOpen} toggle={toggleDropdown}>
                                    <DropdownToggle className="btn-action" color="primary">
                                       <span>Create Report</span>
                                       <Icon name="chevron-down"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                       <ul className="link-list-opt">
                                          <li>
                                             <DropdownItem
                                                tag="a"
                                                href="#links"
                                                onClick={(ev) => {
                                                   ev.preventDefault(),
                                                      toggle("keterangan")
                                                }}
                                             >
                                                <span>Keterangan</span>
                                             </DropdownItem>
                                          </li>
                                          <li>
                                             <DropdownItem
                                                tag="a"
                                                href="#links"
                                                onClick={(ev) => { ev.preventDefault(), toggle("material") }}
                                             >
                                                <span>Material</span>
                                             </DropdownItem>
                                          </li>
                                       </ul>
                                    </DropdownMenu>
                                 </Dropdown>
                              </li>
                              <li>
                                 <Button
                                    disabled={data?.length === 0 || dataInformationProduksi.productionDate == "" || loadingButtonSubmit}
                                    className="toggle d-none d-md-inline-flex"
                                    color="info"
                                    onClick={() => {
                                       // toggle("add");
                                       submitData()
                                    }}
                                 >
                                    {loadingButtonSubmit && <Spinner size="sm" type="grow" />}
                                    {!loadingButtonSubmit ? <span>Submit Report</span> : <span> Loading... </span>}
                                    {/* <Icon name="chevron-down"></Icon> */}
                                 </Button>
                              </li>
                              <li className="nk-block-tools-opt">
                                 {/* <Link to={`${process.env.PUBLIC_URL}/`}> */}
                                 <Button color="light" outline className="bg-white d-none d-sm-inline-flex" onClick={() => navigate('/production-report')}>
                                    <Icon name="arrow-left"></Icon>
                                    <span>Back</span>
                                 </Button>
                                 {/* </Link> */}
                              </li>
                           </ul>
                        </div>
                     </div>
                  </BlockHeadContent>
               </BlockBetween>
            </BlockHead>

            <Block>
               <Row className="g-gs">
                  <Col lg="4">
                     <BlockHead>
                        <BlockHeadContent>
                           <BlockTitle tag="h5">Produksi Info</BlockTitle>
                        </BlockHeadContent>
                     </BlockHead>
                     <Card>
                        <ul className="data-list is-compact">
                           <li className="data-item">
                              <div className="data-col">
                                 <div className="data-label">Reported By</div>
                                 <div className="data-value">{dataUser.fullname}</div>
                              </div>
                           </li>
                           <li className="data-item">
                              <div className="data-col">
                                 <div className="data-label">Tanggal Produksi</div>
                                 <div className="data-value">{dataInformationProduksi.productionDate}</div>
                              </div>
                           </li>
                           {/* <li className="data-item">
                              <div className="data-col">
                                 <div className="data-label">Total Produksi Satuan Meter</div>
                                 <div className="data-value">{totalInMeter} Meter</div>
                              </div>
                           </li> */}
                           {
                              totalInKg > 0 && (
                                 <li className="data-item">
                                    <div className="data-col">
                                       <div className="data-label">Total Produksi Satuan Kg</div>
                                       <div className="data-value">{totalInKg} Kg</div>
                                    </div>
                                 </li>
                              )
                           }
                           <li className="data-item ">
                              <div className="data-col">
                                 <div className="data-label">Issue Produksi</div>
                                 <div className="data-value">{dataInformationProduksi.issueName}</div>
                              </div>
                           </li>
                           {/* <li className="data-item">
                        <div className="data-col">
                           <div className="data-label">Status</div>
                           <div className="data-value">
                              <Badge
                                 size="sm"
                                 color={
                                    user.status === "Approved"
                                       ? "outline-success"
                                       : user.status === "Pending"
                                          ? "outline-info"
                                          : "outline-danger"
                                 }
                                 className="badge-dim"
                              >
                                 {user.status}
                              </Badge>
                           </div>
                        </div>
                     </li> */}
                           {/* <li className="data-item">
                        <div className="data-col">
                           <div className="data-label">Last Checked</div>
                           <div className="data-value">
                              <div className="user-card">
                                 <UserAvatar theme="orange-dim" text={findUpper(user.checked)}></UserAvatar>
                                 <div className="user-info">
                                    <span className="tb-lead">{user.checked}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li> */}
                           <li className="data-item ">
                              <div className="data-col">
                                 <div className="data-label">Notes :</div>
                                 {/* <div className="data-value  h-auto">{dataInformationProduksi.notes}</div> */}
                              </div>
                           </li>
                           <li className="data-item ">
                              <div className="data-col">
                                 {/* <div className="data-label">Notes</div> */}
                                 <div className="data-value  h-auto">{dataInformationProduksi.notes ? dataInformationProduksi.notes : " - Tidak ada notes -"}</div>
                              </div>
                           </li>
                        </ul>
                     </Card >
                  </Col>
                  <Col lg="8">
                     <BlockHeadContent className="mb-4">
                        <BlockTitle tag="h5">Material Produksi</BlockTitle>
                     </BlockHeadContent>
                     <div className="nk-tb-list is-separate is-medium mb-3">
                        <DataTableHead className="nk-tb-item">
                           <DataTableRow>
                              <span className="sub-text">Material</span>
                           </DataTableRow>
                           <DataTableRow>
                              <span className="sub-text">Quantity</span>
                           </DataTableRow>
                           <DataTableRow>
                              <span className="sub-text">Unit</span>
                           </DataTableRow>

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
                           ? currentItems.map((item, idx) => {
                              return (
                                 <DataTableItem key={idx}>
                                    <DataTableRow>
                                       <span className="tb-sub">{item.material}</span>
                                    </DataTableRow>
                                    <DataTableRow>
                                       <span className="tb-sub">{item.quantity}</span>
                                    </DataTableRow>
                                    <DataTableRow>
                                       <span className="tb-sub">{item.unit}</span>
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
                                                               // editOrder(item.orderId);
                                                               // onRangeChange([new Date(item.startProductionDate), new Date(item.endProductionDate)])
                                                               setFormData({ ...data, id: idx, material: item.material, quantity: parseFloat(item.quantity), unit: item.unit })
                                                               toggle("edit");
                                                            }}
                                                         >
                                                            <Icon name="pen"></Icon>
                                                            <span>Ubah</span>
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
                                                               // deleteOrder(item.orderId);
                                                               // toggle("details");
                                                               deleteMaterial(idx)
                                                            }}
                                                         >
                                                            <Icon name="trash"></Icon>
                                                            <span>Hapus</span>
                                                         </DropdownItem>
                                                      </li>
                                                   </ul>
                                                </DropdownMenu>
                                             </UncontrolledDropdown>
                                          </li>
                                       </ul>
                                    </DataTableRow>
                                 </DataTableItem>
                              )
                           })
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
                              <span className="text-silent">No Data</span>
                           </div>
                        )}
                     </PreviewAltCard>
                  </Col>
               </Row>
            </Block>

            {/* FORM ADD MATERIAL */}
            <Modal isOpen={view.material} className="modal-dialog-centered" size="lg">
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
                     <h5 className="title">Keterangan Material Produksi</h5>
                     <div className="mt-4">
                        <form noValidate onSubmit={handleSubmit(onFormSaveMaterial)} >
                           <Row className="g-3">
                              {/* <Col md="6">
                                 <div className="form-group">
                                    <spam className="form-label" htmlFor="dateOfProduction">
                                       Tanggal Produksi
                                    </spam>

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
                                    </div>
                                 </div>
                              </Col> */}
                              {/* <Col md="6">
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
                              </Col> */}
                              <Col md="12">
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
                                          onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} />
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



                              {/* <Col className="col-6">
                                 <div className="form-control-wrap">
                                    <label className="form-label" htmlFor="notes">
                                       Notes
                                    </label>
                                    <div className="input-group">
                                       <textarea id="notes" name="notes" className="form-control" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                                    </div>
                                 </div>
                              </Col> */}


                              <Col size="9">
                                 <Button color="info" type="submit">
                                    <span>Add Material</span>
                                 </Button>
                              </Col>
                              {/* <Col size="2">
                                 <Button color="primary" type="submit">
                                    <span>Submit Laporan</span>
                                 </Button>
                              </Col> */}
                           </Row>
                        </form>
                     </div>
                  </div>
               </ModalBody>
            </Modal>

            {/* FORM ADD KETERANGAN */}
            <Modal isOpen={view.keterangan} className="modal-dialog-centered" size="lg">
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
                     <h5 className="title">Keterangan Informasi Produksi</h5>
                     <div className="mt-4">
                        <form noValidate onSubmit={onFormSaveKeterangan} >
                           <Row className="g-3">
                              <Col md="12">
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
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="select-issue">
                                       Issue
                                    </label>
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

                              <Col className="col-6">
                                 <div className="form-control-wrap">
                                    <label className="form-label" htmlFor="notes">
                                       Notes
                                    </label>
                                    <div className="input-group">
                                       <textarea id="notes" name="notes" className="form-control" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                                    </div>
                                 </div>
                              </Col>


                              <Col size="9">
                                 <Button color="info" type="submit">
                                    <span>Simpan Keterangan</span>
                                 </Button>
                              </Col>
                              {/* <Col size="2">
                                 <Button color="primary" type="submit">
                                    <span>Submit Laporan</span>
                                 </Button>
                              </Col> */}
                           </Row>
                        </form>
                     </div>
                  </div>
               </ModalBody>
            </Modal>

            {/* FORM EDIT MATERIAL */}
            <Modal isOpen={view.edit} className="modal-dialog-centered" size="lg">
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
                     <h5 className="title">Keterangan Material Produksi</h5>
                     <div className="mt-4">
                        <form noValidate onSubmit={handleSubmit(onFormEditMaterial)} >
                           <Row className="g-3">
                              <Col md="12">
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
                                          onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })} />
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

                              <Col size="9">
                                 <Button color="info" type="submit">
                                    <span>Save Material</span>
                                 </Button>
                              </Col>
                           </Row>
                        </form>
                     </div>
                  </div>
               </ModalBody>
            </Modal>

            <Modal isOpen={modalSuccess}>
               <ModalBody className="modal-body-lg text-center">
                  <div className="nk-modal">
                     <Icon className="nk-modal-icon icon-circle icon-circle-xxl ni ni-check bg-success"></Icon>
                     <h4 className="nk-modal-title">Sukses!</h4>
                     <div className="nk-modal-text">
                        <div className="caption-text">
                           Terimakasih sudah membuat laporan produksi hari ini.
                        </div>
                        <span className="sub-text-sm">
                           Semangat bekerja dan tetap jaga kesehatan.
                        </span>
                     </div>
                     <div className="nk-modal-action">
                        <Button color="primary" size="lg" className="btn-mw" onClick={toggleSuccess}>
                           OK
                        </Button>
                     </div>
                  </div>
               </ModalBody>
            </Modal>

            <Modal isOpen={modalFail} toggle={toggleModalFail}>
               <ModalBody className="modal-body-lg text-center">
                  <div className="nk-modal">
                     <Icon className="nk-modal-icon icon-circle icon-circle-xxl ni ni-cross bg-danger"></Icon>
                     <h4 className="nk-modal-title">Terjadi Kesalahan Pada Sistem!</h4>
                     <div className="nk-modal-text">
                        <p className="lead">
                           Silahkan hubungi Staff untuk melakukan pengecekan.
                        </p>
                        <p className="text-soft">Terimakasih.</p>
                     </div>
                     <div className="nk-modal-action mt-5">
                        <Button color="light" size="lg" className="btn-mw" onClick={toggleModalFail}>
                           Close
                        </Button>
                     </div>
                  </div>
               </ModalBody>
            </Modal>
         </Content>
      </React.Fragment>
   );
};


export default CreateDailyReportProduction;