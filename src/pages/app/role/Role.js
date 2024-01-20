import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
   Block,
   BlockHead,
   BlockTitle,
   BlockBetween,
   BlockHeadContent,
   BlockDes,
   Icon,
   Row,
   Col,
   Button,
   DataTableHead,
   DataTableBody,
   DataTableRow,
   DataTableItem,
   PaginationComponent,
   PreviewAltCard
} from "../../../components/Component";
import Swal from "sweetalert2";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge, Alert } from "reactstrap";
import SimpleBar from "simplebar-react";
import { set, useForm } from "react-hook-form";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../../../components/Component";
import axios from "axios";
import { BaseURL } from "../../../config/config";

// const socket = io.connect("http://localhost:3000");

const Role = () => {
   const [alert, setAlert] = useState({
      Message: "",
      Description: "",
      Color: "",
      active: false,
   });
   const [data, setData] = useState([]);
   const [dataEmployee, setDataEmployee] = useState([]);
   const [sm, updateSm] = useState(false);
   const [statusMachine, setStatusMachine] = useState(false);
   const [dataRole, setDataRole] = useState([]);
   const [dataMenu, setDataMenu] = useState([]);
   const [checklistMenu, setChecklistMenu] = useState([]);
   const [formData, setFormData] = useState({
      id: null,
      nama: "",
      key: "",
      isPublish: false,
   });
   const [editId, setEditedId] = useState();
   const [view, setView] = useState({
      editRole: false,
      addRole: false,
      viewRole: false,
      addMenu: false,
      editMenu: false,
      viewRole: false,
   });
   const [onSearchText, setSearchText] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
   const [itemPerPage] = useState(7);
   const [files, setFiles] = useState([]);

   // useEffect(() => {
   //    socket.on("connection", () => {
   //       console.log('log-connect')
   //    });
   //    socket.on("get_menus", (data) => {
   //       console.log('log-get-menus', data)
   //    });
   // }, [socket]);
   //scroll off when sidebar shows

   const resetView = () => {
      setView({
         editRole: false,
         addRole: false,
         viewRole: false,
         addMenu: false,
         editMenu: false,
         viewRole: false,
      });
   }

   const handleAlert = (isSuccess) => {
      let message = "Your work has been saved"
      if (isSuccess) {
         Swal.fire({
            position: "top-end",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 1500,
         });
      } else {
         message = "Gagal Menyimpan Data"
         Swal.fire({
            icon: "error",
            title: message,
            text: "Something went wrong",
            focusConfirm: false,
            // footer: "<a href=''> Why do I have this issue? </a>",
         });
         event?.preventDefault()
      }
   }

   const fetchDataRole = async () => {
      try {
         const role = []
         const roles = await axios.get(`${BaseURL}/management-user/roles`)

         roles.data.data.forEach((item) => {
            const data = {
               id: item.id,
               name: item.title,
            }

            role.push(data)
         })
         setDataRole(role)
      } catch (error) {
         console.log("LOG-ERROR-fetchDataRole: ", error)
      }
   }
   const fetchDataMenu = async () => {
      try {
         const menus = []
         const menuChecklist = []
         const menu = await axios.get(`${BaseURL}/management-user/menus`)

         menu.data.data.forEach((item) => {
            const data = {
               id: item.id,
               name: item.menuName,
               key: item.menuKey,
               isPublish: item.isPublish,
            }
            const dataChecklist = {
               id: item.id,
               name: item.menuName,
               key: item.menuKey,
               isPublish: item.isPublish,
               checklist: false
            }

            menus.push(data)
            menuChecklist.push(dataChecklist)
         })
         console.log('LOG-menus', menus)
         setDataMenu(menus)
         setChecklistMenu(menuChecklist)
      } catch (error) {
         console.log("LOG-ERROR-fetchDataRole: ", error)
      }
   }

   useEffect(() => {
      // fetchData();
      fetchDataRole();
      fetchDataMenu();
      // fetchDataEmployee();
   }, []);

   // function to close the form modal
   const onFormCancel = () => {
      // setView({ edit: false, add: false, details: false });
      resetView()
      resetForm();
   };

   const resetForm = () => {
      setFormData({
         id: null,
         nama: "",
         key: "",
         isPublish: false,
      });
      setChecklistMenu([])
      reset({});
   };

   const handleChecklistMenu = (id, checked) => {
      let newData = checklistMenu;
      let index = newData?.findIndex((item) => item.id === id);
      newData[index].checklist = checked;
      setChecklistMenu([...newData]);
   }

   const onFormSaveRole = async () => {
      const { nama } = formData;
      const checklist = checklistMenu?.filter((item) => item.checklist == true)

      console.log('LOG-nama-checklist', nama, checklist)

      let idMenu = checklist.map(({ id }) => id)
      console.log('LOG-idMenu', idMenu)

      const payload = {
         roleName: nama,
         menuId: idMenu
      }
      await axios.post(`${BaseURL}/management-user/add-role`, payload).then((response) => {
         console.log('LOG-axios', response.data.data)
         handleAlert(true)
         fetchDataRole();
         resetView()
      }).catch((error) => {
         resetView()
         handleAlert(false)
         console.log('LOG-axios-err', error)
      })

      resetForm()
   }

   const onFormUpdateRole = async () => {
      const { nama, id } = formData;
      const checklist = checklistMenu?.filter((item) => item.checklist == true)

      let idMenu = checklist.map(({ id }) => id)
      console.log('LOG-idMenu', idMenu)

      console.log('LOG-nama-checklist', nama, checklist, idMenu)

      const payload = {
         roleName: nama,
         menuId: idMenu
      }

      await axios.put(`${BaseURL}/management-user/role/${id}`, payload).then((response) => {
         console.log('LOG-axios', response.data.data)
         handleAlert(true)
         fetchDataRole();
         resetView()
      }).catch((error) => {
         resetView()
         handleAlert(false)
         console.log('LOG-axios-err', error)
      })
   }

   const handleDetailRole = async (id) => {
      const tempMenu = dataMenu
      const menu = []
      const role = []
      await axios.get(`${BaseURL}/management-user/role/${id}`)
         .then((response) => {
            const dataRoles = response.data.data
            dataRoles?.menu.forEach((item) => {
               menu.push(item.id)
            })
            const data = {
               id: dataRoles.id,
               name: dataRoles.title,
               menu: menu
            }
            role.push(data)

            tempMenu.forEach((item) => {
               menu.includes(item.id) ? item.checklist = true : item.checklist = false
            })
            setChecklistMenu(tempMenu)
            console.log('LOG-tempMenu', tempMenu)

            setView({ ...view, viewRole: true })
         }).catch((error) => {
            console.log('LOG-axios-err', error)
         })
   }
   const handleUpdateRole = async (id) => {
      const tempMenu = dataMenu
      const menu = []
      const role = []
      await axios.get(`${BaseURL}/management-user/role/${id}`)
         .then((response) => {
            const dataRoles = response.data.data
            dataRoles?.menu.forEach((item) => {
               menu.push(item.id)
            })
            const data = {
               id: dataRoles.id,
               name: dataRoles.title,
               menu: menu
            }
            role.push(data)

            tempMenu.forEach((item) => {
               menu.includes(item.id) ? item.checklist = true : item.checklist = false
            })
            setChecklistMenu(tempMenu)
            console.log('LOG-tempMenu', tempMenu)

            setView({ ...view, editRole: true })
         }).catch((error) => {
            console.log('LOG-axios-err', error)
         })
   }
   const handleDeleteRole = async (id) => {
      await axios.delete(`${BaseURL}/management-user/role/${id}`)
         .then((response) => {
            console.log('LOG-axios', response.data.data)
            handleAlert(true)
            fetchDataRole();
            resetView()
         }).catch((error) => {
            resetView()
            handleAlert(false)
            console.log('LOG-axios-err', error)
         })
   }

   const onFormAddMenu = () => {
      const { nama, key, isPublish } = formData;
      const payload = {
         nameMenu: nama,
         menuKey: key,
         isPublish: isPublish
      }

      axios.post(`${BaseURL}/management-user/add-menu`, payload).then((response) => {
         console.log('LOG-axios', response.data.data)
         handleAlert(true)
         fetchDataMenu();
         resetView()
      }).catch((error) => {
         resetView()
         handleAlert(false)
         console.log('LOG-axios-err', error)
      })
   }

   const onFormUpdateMenu = async () => {
      const { nama, key, id, isPublish } = formData;
      const payload = {
         nameMenu: nama,
         menuKey: key,
         isPublish: isPublish
      }

      await axios.post(`${BaseURL}/management-user/menu/${id}`, payload).then((response) => {
         console.log('LOG-axios', response.data.data)
         handleAlert(true)
         fetchDataMenu();
         resetView()
      }).catch((error) => {
         resetView()
         handleAlert(false)
         console.log('LOG-axios-err', error)
      })
   }


   const handlePublish = (isPublish) => {
      console.log('LOG-isPublish', isPublish)
      setFormData({ ...formData, isPublish: isPublish })
   }
   useEffect(() => {
      reset(formData)
   }, [formData]);

   // selects all the products
   const selectorCheck = (e) => {
      let newData;
      newData = data.map((item) => {
         item.check = e.currentTarget.checked;
         return item;
      });
      setData([...newData]);
   };

   // selects one product
   const onSelectChange = (e, id) => {
      let newData = data;
      let index = newData.findIndex((item) => item.id === id);
      newData[index].check = e.currentTarget.checked;
      setData([...newData]);
   };

   // onChange function for searching name
   const onFilterChange = (e) => {
      setSearchText(e.target.value);
   };

   // function to delete a product
   const deleteMachine = (id) => {
      let defaultData = data;
      defaultData = defaultData.filter((item) => item.id !== id);
      setData([...defaultData]);
   };

   // function to delete the seletected item
   const selectordeleteMachine = () => {
      let newData;
      newData = data.filter((item) => item.check !== true);
      setData([...newData]);
   };

   // toggle function to view product details
   // const toggle = (type) => {
   //    setView({
   //       edit: type === "edit" ? true : false,
   //       add: type === "add" ? true : false,
   //       details: type === "details" ? true : false,
   //    });
   // };
   const toggle = (type) => {
      resetView()
      setView({
         [type]: true
      })
   }

   // handles ondrop function of dropzone
   const handleDropChange = (acceptedFiles) => {
      setFiles(
         acceptedFiles.map((file) =>
            Object.assign(file, {
               preview: URL.createObjectURL(file),
            })
         )
      );
   };

   // Get current list, pagination
   // const indexOfLastItem = currentPage * itemPerPage;
   // const indexOfFirstItem = indexOfLastItem - itemPerPage;
   // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

   // Change Page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const { register, handleSubmit, reset, formState: { errors } } = useForm();

   return (
      <React.Fragment>
         <Head title="Role & Menu"></Head>
         <Content>
            {/* {console.log('LOG-alert', alert)} */}
            {/* {alert?.active ? (
               <Alert color="primary" className="alert-pro">Your order has been successfully placed for deposit.</Alert>
               <Alert className="alert-icon" color="primary">
                  <Icon name="alert-circle" />
                  <strong>Order has been placed</strong>. Your will be redirect
                  for make your payment.
               </Alert>

            ) : null} */}

            <BlockHead size="sm">
               <BlockBetween>
                  <BlockHeadContent>
                     <BlockTitle>Management Role & Menu</BlockTitle>
                  </BlockHeadContent>
               </BlockBetween>
            </BlockHead>
            <Block>
               <Row className="g-gs">
                  <Col lg="4" >
                     {/* <Row className="g-gs bg-black"> */}
                     <BlockBetween>
                        <BlockHeadContent className="mb-4">
                           <BlockTitle tag="h5">Role</BlockTitle>
                        </BlockHeadContent>
                        <BlockHeadContent className="mb-4">
                           <div className="toggle-wrap nk-block-tools-toggle">
                              <Button
                                 className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                 onClick={() => updateSm(!sm)}
                              >
                                 <Icon name="menu-alt-r"></Icon>
                              </Button>
                              <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                 <ul className="nk-block-tools g-3">
                                    <li className="nk-block-tools-opt">
                                       <Button color="primary" className="btn-icon" onClick={() => toggle("addRole")}>
                                          <Icon name="plus"></Icon>
                                       </Button>
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </BlockHeadContent>
                     </BlockBetween>
                     {/* </Row> */}
                     <div className="nk-tb-list is-separate is-medium mb-3">
                        <DataTableHead className="nk-tb-item">
                           <DataTableRow>
                              <span className="sub-text">No</span>
                           </DataTableRow>
                           <DataTableRow>
                              <span className="sub-text">Name</span>
                           </DataTableRow>

                           <DataTableRow className="nk-tb-col-tools">
                              <ul className="nk-tb-actions gx-1 my-n1">
                                 <li>
                                    <UncontrolledDropdown>
                                       <DropdownToggle tag="a" className="btn btn-trigger dropdown-toggle btn-icon me-n1">
                                          <Icon name="more-h"></Icon>
                                       </DropdownToggle>
                                    </UncontrolledDropdown>
                                 </li>
                              </ul>
                           </DataTableRow>
                        </DataTableHead>

                        {dataRole?.length > 0
                           ? dataRole.map((item, idx) => {
                              return (
                                 <DataTableItem key={idx}>
                                    <DataTableRow>
                                       <span className="tb-sub">{idx + 1}</span>
                                    </DataTableRow>
                                    <DataTableRow>
                                       <span className="tb-sub">{item.name}</span>
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
                                                               handleDetailRole(item.id)
                                                               setFormData({ ...formData, id: item.id, nama: item.name })
                                                               toggle("viewRole");
                                                            }}
                                                         >
                                                            <Icon name="eye"></Icon>
                                                            <span>lihat Detail</span>
                                                         </DropdownItem>
                                                      </li>
                                                      <li>
                                                         <DropdownItem
                                                            tag="a"
                                                            href="#dropdown"
                                                            onClick={(ev) => {
                                                               ev.preventDefault();
                                                               // editOrder(item.orderId);
                                                               // onRangeChange([new Date(item.startProductionDate), new Date(item.endProductionDate)])
                                                               // setFormData({ ...data, id: idx, materialId: item.id, reportId: itemProduksi.id, material: item.material, quantity: parseFloat(item.quantity), unit: item.unit, })
                                                               handleUpdateRole(item.id)
                                                               setFormData({ ...formData, id: item.id, nama: item.name })
                                                               // toggle("editRole");
                                                            }}
                                                         >
                                                            <Icon name="pen"></Icon>
                                                            <span>Ubah</span>
                                                         </DropdownItem>
                                                      </li>
                                                      <li>
                                                         <DropdownItem
                                                            tag="a"
                                                            href="#dropdown"
                                                            onClick={(ev) => {
                                                               ev.preventDefault();
                                                               handleDeleteRole(item.id)
                                                               // deleteOrder(item.orderId);
                                                               // toggle("details");
                                                               // deleteMaterial(idx)
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
                     {dataRole?.length == 0 && (
                        <div className="text-center">
                           <span className="text-silent">No Data</span>
                        </div>
                     )}
                  </Col>
                  <Col lg="8">
                     <BlockBetween>
                        <BlockHeadContent className="mb-4">
                           <BlockTitle tag="h5">Menu</BlockTitle>
                        </BlockHeadContent>
                        <BlockHeadContent className="mb-4">
                           <div className="toggle-wrap nk-block-tools-toggle">
                              <Button
                                 className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                 onClick={() => updateSm(!sm)}
                              >
                                 <Icon name="menu-alt-r"></Icon>
                              </Button>
                              <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                                 <ul className="nk-block-tools g-3">
                                    <li className="nk-block-tools-opt">
                                       <Button color="primary" className="btn-icon" onClick={() => setView({ ...view, addMenu: true })}>
                                          <Icon name="plus"></Icon>
                                       </Button>
                                    </li>
                                 </ul>
                              </div>
                           </div>
                        </BlockHeadContent>
                     </BlockBetween>
                     <div className="nk-tb-list is-separate is-medium mb-3">
                        <DataTableHead className="nk-tb-item">
                           <DataTableRow>
                              <span className="sub-text">No</span>
                           </DataTableRow>
                           <DataTableRow>
                              <span className="sub-text">Nama Menu</span>
                           </DataTableRow>
                           <DataTableRow>
                              <span className="sub-text">Key Menu</span>
                           </DataTableRow>
                           <DataTableRow className="nk-tb-col-tools">
                              <ul className="nk-tb-actions gx-1 my-n1">
                                 <li>
                                    <UncontrolledDropdown>
                                       <DropdownToggle tag="a" className="btn btn-trigger dropdown-toggle btn-icon me-n1">
                                          <Icon name="more-h"></Icon>
                                       </DropdownToggle>
                                    </UncontrolledDropdown>
                                 </li>
                              </ul>
                           </DataTableRow>
                        </DataTableHead>

                        {dataMenu?.length > 0
                           ? dataMenu.map((item, idx) => {
                              return (
                                 <DataTableItem key={idx}>
                                    <DataTableRow>
                                       <span className="tb-sub">{idx + 1}</span>
                                    </DataTableRow>
                                    <DataTableRow>
                                       <span className="tb-sub">{item.name}</span>
                                    </DataTableRow>
                                    <DataTableRow>
                                       <span className="tb-sub">{item.key}</span>
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
                                                      {/* <li>
                                                         <DropdownItem
                                                            tag="a"
                                                            href="#dropdown"
                                                            onClick={(ev) => {
                                                               ev.preventDefault();
                                                               // editOrder(item.orderId);
                                                               // onRangeChange([new Date(item.startProductionDate), new Date(item.endProductionDate)])
                                                               // setFormData({ ...data, id: idx, materialId: item.id, reportId: itemProduksi.id, material: item.material, quantity: parseFloat(item.quantity), unit: item.unit, })
                                                               // handleDetailMenu(item.id)
                                                               setView({ ...view, editMenu: true })
                                                               // toggle("view");
                                                            }}
                                                         >
                                                            <Icon name="eye"></Icon>
                                                            <span>lihat Detail</span>
                                                         </DropdownItem>
                                                      </li> */}
                                                      <li>
                                                         <DropdownItem
                                                            tag="a"
                                                            href="#dropdown"
                                                            onClick={(ev) => {
                                                               ev.preventDefault();
                                                               // editOrder(item.orderId);
                                                               // onRangeChange([new Date(item.startProductionDate), new Date(item.endProductionDate)])
                                                               setFormData({ ...formData, key: item.key, nama: item.name, id: item.id, isPublish: item.isPublish })
                                                               // toggle("editMenu");
                                                               setView({ ...view, editMenu: true })
                                                               // handleUpdatelMenu(item.id)
                                                            }}
                                                         >
                                                            <Icon name="pen"></Icon>
                                                            <span>Ubah</span>
                                                         </DropdownItem>
                                                      </li>
                                                      {/* <li>
                                                         <DropdownItem
                                                            tag="a"
                                                            href="#dropdown"
                                                            onClick={(ev) => {
                                                               ev.preventDefault();
                                                               // deleteOrder(item.orderId);
                                                               // toggle("details");
                                                               // deleteMaterial(idx)
                                                               handleDeleteMenu(item.id)
                                                            }}
                                                         >
                                                            <Icon name="trash"></Icon>
                                                            <span>Hapus</span>
                                                         </DropdownItem>
                                                      </li> */}
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
                     {dataRole?.length == 0 && (
                        <div className="text-center">
                           <span className="text-silent">No Data</span>
                        </div>
                     )}
                  </Col>
               </Row>
            </Block>


            {/* FORM ADD ROLE */}
            <Modal isOpen={view.addRole} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                  <div className="nk-modal-head mb-3">
                     <h5 className="title">Buat Role</h5>
                  </div>
                  <form noValidate onSubmit={handleSubmit(onFormSaveRole)}>
                     <Row className="g-3">

                        <div className="form-group">
                           <label className="form-label" htmlFor="name-role">
                              Nama Role
                           </label>
                           <div className="form-control-wrap">
                              <input
                                 id="name-role"
                                 name="name-role"
                                 type="text"
                                 {...register('nama', { required: "This is required" })}
                                 className="form-control"
                                 value={formData.nama}
                                 onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                              />
                              {errors.nama && <span className="invalid">{errors.nama.message}</span>}
                           </div>
                        </div>
                        <div className="nk-modal-head">
                           <div className="form-group">
                              <label className="form-label" htmlFor="checkbox-access-menu">
                                 Akses Menu
                              </label>
                              {checklistMenu?.length > 0 ? checklistMenu.map((item, idx) => {
                                 return (
                                    <Col sm="6" md="8" className="m-lg-3">
                                       <div className="custom-control custom-checkbox">
                                          <input
                                             type="checkbox"
                                             className="custom-control-input"
                                             defaultChecked
                                             // disabled={isOperator}
                                             checked={item?.checklist}
                                             onChange={(e) => { handleChecklistMenu(item.id, e.target.checked), console.log('LOG-checklist', item.id, e.target.checked) }}
                                             value={item?.checklist}
                                             id={"customCheck" + idx}
                                          />
                                          <label className="custom-control-label" htmlFor={"customCheck" + idx}>
                                             {item.name}
                                          </label>
                                       </div>
                                    </Col>
                                 )
                              }) : null}

                           </div>
                        </div>
                     </Row>
                     <Col size="9">
                        <Button color="info" type="submit">
                           {/* <span>Save Role</span> */}
                           Save Role
                        </Button>
                     </Col>
                  </form>
               </ModalBody>
            </Modal>

            {/* FORM VIEW ROLE */}
            <Modal isOpen={view.viewRole} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                  <form noValidate>
                     <Row className="g-3">
                        {/* <div className="nk-modal-head"> */}
                        {/* <Col md="6"> */}
                        <div className="form-group">
                           <label className="form-label" htmlFor="name-role">
                              Nama Role
                           </label>
                           <div className="form-control-wrap">
                              <input
                                 id="name-role"
                                 name="name-role"
                                 type="text"
                                 {...register('nama', { required: "This is required" })}
                                 className="form-control"
                                 disabled
                                 value={formData.nama}
                                 onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                              />
                              {errors.nama && <span className="invalid">{errors.nama.message}</span>}
                           </div>
                        </div>
                        <div className="nk-modal-head">
                           <div className="form-group">
                              <label className="form-label" htmlFor="checkbox-access-menu">
                                 Akses Menu
                              </label>
                              {checklistMenu?.length > 0 ? checklistMenu.map((item, idx) => {
                                 return (
                                    <Col sm="6" md="8" className="m-lg-3">
                                       <div className="custom-control custom-checkbox">
                                          <input
                                             type="checkbox"
                                             className="custom-control-input"
                                             defaultChecked
                                             disabled
                                             checked={item?.checklist}
                                             // onChange={(e) => { handleChecklistMenu(item.id, e.target.checked), console.log('LOG-checklist', item.id, e.target.checked) }}
                                             value={item?.checklist}
                                             id={"customCheck" + idx}
                                          />
                                          <label className="custom-control-label" htmlFor={"customCheck" + idx}>
                                             {item.name}
                                          </label>
                                       </div>
                                    </Col>
                                 )
                              }) : null}

                           </div>
                        </div>
                     </Row>
                  </form>
               </ModalBody>
            </Modal>

            {/* FORM EDIT ROLE */}
            <Modal isOpen={view.editRole} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                  <form noValidate onSubmit={handleSubmit(onFormUpdateRole)}>
                     <Row className="g-3">
                        {/* <div className="nk-modal-head"> */}
                        {/* <Col md="6"> */}
                        <div className="form-group">
                           <label className="form-label" htmlFor="name-role">
                              Nama Role
                           </label>
                           <div className="form-control-wrap">
                              <input
                                 id="name-role"
                                 name="name-role"
                                 type="text"
                                 {...register('nama', { required: "This is required" })}
                                 className="form-control"
                                 value={formData.nama}
                                 onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                              />
                              {errors.nama && <span className="invalid">{errors.nama.message}</span>}
                           </div>
                        </div>
                        <div className="nk-modal-head">
                           <div className="form-group">
                              <label className="form-label" htmlFor="checkbox-access-menu">
                                 Akses Menu
                              </label>
                              {checklistMenu?.length > 0 ? checklistMenu.map((item, idx) => {
                                 return (
                                    <Col sm="6" md="8" className="m-lg-3">
                                       <div className="custom-control custom-checkbox">
                                          <input
                                             type="checkbox"
                                             className="custom-control-input"
                                             defaultChecked
                                             checked={item?.checklist}
                                             onChange={(e) => { handleChecklistMenu(item.id, e.target.checked) }}
                                             value={item?.checklist}
                                             id={"customCheck" + idx}
                                          />
                                          <label className="custom-control-label" htmlFor={"customCheck" + idx}>
                                             {item.name}
                                          </label>
                                       </div>
                                    </Col>
                                 )
                              }) : null}

                           </div>
                        </div>
                     </Row>
                     <Col size="9">
                        <Button color="info" type="submit">
                           {/* <span>Save Role</span> */}
                           Save Role
                        </Button>
                     </Col>
                  </form>
               </ModalBody>
            </Modal>

            {/* FORM ADD MENU */}
            <Modal isOpen={view.addMenu} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                  <form noValidate onSubmit={handleSubmit(onFormAddMenu)}>
                     <Row className="g-3">
                        <div className="nk-modal-head mb-3">
                           <h5 className="title">Buat Menu</h5>
                        </div>
                        <div className="form-group">
                           <label className="form-label" htmlFor="name-role">
                              Nama Menu
                           </label>
                           <div className="form-control-wrap">
                              <input
                                 id="name-role"
                                 name="name-role"
                                 type="text"
                                 {...register('nama', { required: "This is required" })}
                                 className="form-control"
                                 value={formData.nama}
                                 onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                              />
                              {errors.nama && <span className="invalid">{errors.nama.message}</span>}
                           </div>
                        </div>
                        <div className="form-group">
                           <label className="form-label" htmlFor="key-menu">
                              Key Menu
                           </label>
                           <div className="form-control-wrap">
                              <input
                                 id="key-menu"
                                 name="key-menu"
                                 type="text"
                                 {...register('key', { required: "This is required" })}
                                 className="form-control"
                                 value={formData.key}
                                 onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                              />
                              {errors.key && <span className="invalid">{errors.key.message}</span>}
                           </div>
                        </div>
                        <Col sm="6" md="8" className="m-lg-3">
                           <div className="custom-control custom-checkbox">
                              <label className="custom-control-label" htmlFor={"customCheck001"}>
                                 Publish
                              </label>
                              <input
                                 type="checkbox"
                                 className="custom-control-input"
                                 defaultChecked
                                 checked={true}
                                 onChange={(e) => { setFormData({ ...formData, isPublish: e.target.checked }) }}
                                 value={formData.isPublish}
                                 id={"customCheck001"}
                              />
                           </div>
                        </Col>
                     </Row>
                     <Col size="9" className="mt-5">
                        <Button color="info" type="submit">
                           <span>Save Menu</span>
                           {/* Save Role */}
                        </Button>
                     </Col>
                  </form>
               </ModalBody>
            </Modal>

            {/* FORM EDIT MENU */}
            <Modal isOpen={view.editMenu} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                  <form noValidate onSubmit={handleSubmit(onFormUpdateMenu)}>
                     <Row className="g-3">
                        <div className="nk-modal-head mb-3">
                           <h5 className="title">Ubah Menu</h5>
                        </div>
                        <div className="form-group">
                           <label className="form-label" htmlFor="name-role">
                              Nama Menu
                           </label>
                           <div className="form-control-wrap">
                              <input
                                 id="name-role"
                                 name="name-role"
                                 type="text"
                                 {...register('nama', { required: "This is required" })}
                                 className="form-control"
                                 value={formData.nama}
                                 onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                              />
                              {errors.nama && <span className="invalid">{errors.nama.message}</span>}
                           </div>
                        </div>
                        <div className="form-group">
                           <label className="form-label" htmlFor="key-menu">
                              Key Menu
                           </label>
                           <div className="form-control-wrap">
                              <input
                                 id="key-menu"
                                 name="key-menu"
                                 type="text"
                                 {...register('key', { required: "This is required" })}
                                 className="form-control"
                                 value={formData.key}
                                 onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                              />
                              {errors.key && <span className="invalid">{errors.key.message}</span>}
                           </div>
                        </div>
                        <Col sm="6" md="8" className="m-lg-3">
                           {/* <div className="form-group"> */}
                           <div className="custom-control custom-checkbox">
                              <input
                                 // type="checkbox"
                                 // className="custom-control-input"
                                 // checked={formData.isPublish}
                                 // onChange={(e) => setFormData({ ...formData, isPublish: e.target.value })}
                                 // value={formData.isPublish}
                                 // id={"customCheck00"}

                                 type="checkbox"
                                 className="custom-control-input"
                                 // defaultChecked
                                 checked={formData.isPublish}
                                 onChange={(e) => {
                                    handlePublish(e.target.checked)
                                    // setFormData({ ...formData, isPublish: e.target.checked }), console.log('LOG-CHECKED', formData.isPublish, e.target.checked)
                                 }}
                                 // value={formData.isPublish}
                                 id={"customCheck00"}
                              />
                           </div>
                           <label className="custom-control-label" htmlFor={"customCheck00"}>
                              Publish
                           </label>
                        </Col>
                        {/* </div> */}
                     </Row>
                     <Col size="9" className="mt-5">
                        <Button color="info" type="submit">
                           <span>Save Menu</span>
                        </Button>
                     </Col>
                  </form>
               </ModalBody>
            </Modal>



         </Content>
      </React.Fragment >
   );
};

export default Role;
