import React, { useState, useEffect } from "react";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
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
} from "../../../../components/Component";
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge } from "reactstrap";
import SimpleBar from "simplebar-react";
import { set, useForm } from "react-hook-form";
import ProductH from "../../../../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../../../../components/Component";
// import io from "socket.io-client";
import axios from "axios";
import { BaseURL } from "../../../../config/config";
import Swal from "sweetalert2";

// const socket = io.connect("http://localhost:3000");

const Issue = () => {
   const [data, setData] = useState([]);
   const [dataEmployee, setDataEmployee] = useState([]);
   const [sm, updateSm] = useState(false);
   const [statusMachine, setStatusMachine] = useState(false);
   const [formData, setFormData] = useState({
      id: null,
      kode: "",
      name: "",
      picId: null,
      picName: "",
      averageProduce: 0,
      status: statusMachine
   });
   const [editId, setEditedId] = useState();
   const [view, setView] = useState({
      edit: false,
      add: false,
      details: false,
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
   useEffect(() => {
      view.add ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
   }, [view.add])

   // Changing state value when searching name
   useEffect(() => {
      if (onSearchText !== "") {
         const filteredObject = data.filter((item) => {
            return item.kode.toLowerCase().includes(onSearchText.toLowerCase());
         });
         setData([...filteredObject]);
      } else {
         setData([...data]);
      }
   }, [onSearchText]);

   const fetchData = async () => {
      // You can await here
      console.log('LOG-BaseURL', BaseURL)
      try {
         await axios.get(`${BaseURL}/categories/issues`).then((response) => {
            console.log('LOG-axios', response.data.data)
            setData(response.data.data)
         }).catch((error) => {
            console.log('LOG-axios-err', error)
         })

      } catch (error) {
         console.log('LOG-Err-fetchData', error)
      }
   }

   // const fetchDataEmployee = async () => {
   //    try {
   //       const emp = []
   //       const employee = await axios.get(`${BaseURL}/employee`)

   //       employee.data.data.forEach((item) => {
   //          const data = {
   //             id: item.id,
   //             fullname: item.fullname,
   //             username: item.username,
   //             role: item.role,
   //             roleId: item.roleId,
   //             isActive: item.isActive,
   //             value: item.id,
   //             label: item.fullname
   //          }

   //          emp.push(data)
   //       })
   //       setDataEmployee(emp)
   //    } catch (error) {
   //       console.log("LOG-ERROR-fetchDataEmployee: ", error)
   //    }

   // }

   useEffect(() => {
      fetchData();
      // fetchDataEmployee();
   }, []);

   // function to close the form modal
   const onFormCancel = () => {
      setView({ edit: false, add: false, details: false });
      resetForm();
   };

   const resetForm = () => {
      setFormData({
         name: "",
         img: null,
         kode: "",
         price: 0,
         salePrice: 0,
         stock: 0,
         category: [],
         fav: false,
         check: false,
      });
      reset({});
   };

   const handleAlert = (isSuccess, message) => {
      if (message == "") {
         message = "Your work has been saved"
      }

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

   const onFormSubmit = async () => {
      const { name } = formData;

      let submittedData = {
         issueName: name,
      };

      await axios.post(`${BaseURL}/categories/issues`, submittedData).then((response) => {
         handleAlert(true)
         fetchData();
         setView({ add: false });
         resetForm();

      }).catch((error) => {
         handleAlert(false)
         console.log('LOG-axios-err', error)
      })
   };

   const onEditSubmit = async () => {
      const { name } = formData;

      let submittedData = {
         issueName: name,
      };

      try {
         await axios.put(`${BaseURL}/machine/${id}`, submittedData).then((response) => {
            handleAlert(true)
            fetchData();
            setView({ ...view, edit: false });
            resetForm();
         }).catch((error) => {
            handleAlert(false)
            console.log('LOG-axios-err', error)
         })
      } catch (error) {
         handleAlert(false)
         console.log('LOG-axios-err', error)
      }
      // setView({ edit: false, add: false });
      // resetForm();
      // event.preventDefault()
   };

   const handleDelete = async (id) => {
      await axios.delete(`${BaseURL}/categories/issues/${id}`).then((response) => {
         handleAlert(true)
         fetchData();
         setView({ ...view, edit: false });
         resetForm();
      }).catch((error) => {
         handleAlert(false)
         console.log('LOG-axios-err', error)
      })
   }

   // function that loads the want to editted data
   const onEditClick = (id) => {
      data.forEach((item) => {
         if (item.id === id) {
            setFormData({
               id: item.id,
               name: item.name,
               kode: item.kode,
               picId: item.picId,
               picName: item.picName,
               averageProduce: item.averageProduce,
               status: item.status
            });
         }
      });
      setEditedId(id);
      // setFiles([]);
      setView({ add: false, edit: true });
   };

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
   const toggle = (type) => {
      setView({
         edit: type === "edit" ? true : false,
         add: type === "add" ? true : false,
         details: type === "details" ? true : false,
      });
   };

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
   const indexOfLastItem = currentPage * itemPerPage;
   const indexOfFirstItem = indexOfLastItem - itemPerPage;
   const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

   // Change Page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const { register, handleSubmit, reset, formState: { errors } } = useForm();

   return (
      <React.Fragment>
         <Head title="Machine List"></Head>
         <Content>
            <BlockHead size="sm">
               <BlockBetween>
                  <BlockHeadContent>
                     <BlockTitle>Categori Issue</BlockTitle>
                  </BlockHeadContent>
                  <BlockHeadContent>
                     <div className="toggle-wrap nk-block-tools-toggle">
                        <a
                           href="#more"
                           className="btn btn-icon btn-trigger toggle-expand me-n1"
                           onClick={(ev) => {
                              ev.preventDefault();
                              updateSm(!sm);
                           }}
                        >
                           <Icon name="more-v"></Icon>
                        </a>
                        <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
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
                                       placeholder="Quick search by SKU"
                                       onChange={(e) => onFilterChange(e)}
                                    />
                                 </div>
                              </li> */}
                              <li>
                                 <UncontrolledDropdown>
                                    {/* <DropdownToggle
                                       color="transparent"
                                       className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                                    >
                                       Status
                                    </DropdownToggle> */}
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
                              </li>
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
                                    <span>Tambah Kategori Issue</span>
                                 </Button>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </BlockHeadContent>
               </BlockBetween>
            </BlockHead>
            <Block>
               <Col sm="12" md="6" lg="4">
                  <Card>
                     <div className="card-inner-group">
                        <div className="card-inner p-0">
                           <DataTableBody>
                              <DataTableHead>
                                 <DataTableRow size="sm">
                                    <span>No</span>
                                 </DataTableRow>
                                 <DataTableRow>
                                    <span>Nama Issue</span>
                                 </DataTableRow>
                                 <DataTableRow className="nk-tb-col-tools">
                                    Action
                                 </DataTableRow>
                              </DataTableHead>
                              {currentItems?.length > 0
                                 ? currentItems?.map((item, idx) => {
                                    return (
                                       <DataTableItem key={idx}>
                                          <DataTableRow>
                                             <span className="tb-sub">{idx + 1}</span>
                                          </DataTableRow>
                                          <DataTableRow size="sm">
                                             <span className="tb-sub">{item.issueName}</span>
                                          </DataTableRow>
                                          <DataTableRow className="nk-tb-col-tools">
                                             <Button
                                                color="primary"
                                                size="sm"
                                                className="btn btn-dim"
                                                onClick={(ev) => {
                                                   ev.preventDefault();
                                                   // onEditClick(item.id);
                                                   // setStatusMachine(item.status)
                                                   setFormData({
                                                      // id: item.id,
                                                      // kode: item.kode,
                                                      name: item.issueName,
                                                      // picId: item.picId,
                                                      // picName: item.picName,
                                                      // averageProduce: item.averageProduce,
                                                      // status: item.status
                                                   })
                                                   toggle("edit");
                                                }}
                                             >
                                                <Icon name="pen-alt-fill"></Icon>
                                             </Button>
                                             <Button
                                                color="danger"
                                                size="sm"
                                                className="btn btn-dim"
                                                onClick={(ev) => {
                                                   ev.preventDefault();
                                                   // deleteMachine(item.id);
                                                   handleDelete(item.id)
                                                }}>
                                                <Icon name="trash-alt"></Icon>
                                             </Button>

                                          </DataTableRow>
                                       </DataTableItem>
                                    );
                                 })
                                 : null}
                           </DataTableBody>
                           {/* <div className="card-inner"> */}
                           {data?.length == 0 && (
                              // <PaginationComponent
                              //    itemPerPage={itemPerPage}
                              //    totalItems={data.length}
                              //    paginate={paginate}
                              //    currentPage={currentPage}
                              // />
                              <div className="text-center">
                                 <span className="text-silent">No Data</span>
                              </div>
                           )}
                           {/* </div> */}
                        </div>
                     </div>
                  </Card>
               </Col>
            </Block>
            {/*  FORM UPDATE*/}
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
                     <h5 className="title">Update Kategori Issue</h5>
                     <div className="mt-4">
                        <form noValidate onSubmit={handleSubmit(onEditSubmit)} id="form-update-issues">
                           <Row className="g-3">
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="name-issue-categories" id="form-update-issues">
                                       Nama Kategori Issue
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          id="name-issue-categories"
                                          name="name-issue-categories"
                                          type="text"
                                          {...register('name', { required: "This is required" })}
                                          className="form-control"
                                          value={formData.name}
                                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                       {errors.name && <span className="invalid">{errors.name.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col size="12">
                                 <Button color="primary" type="submit">
                                    <Icon className="plus"></Icon>
                                    <span>Update Machine</span>
                                 </Button>
                              </Col>
                           </Row>
                        </form>
                     </div>
                  </div>
               </ModalBody>
            </Modal>

            {/* FORM ADD */}
            <SimpleBar
               className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
                  }`}
            >
               <BlockHead>
                  <BlockHeadContent>
                     <BlockTitle tag="h5">Tambah Kategori Issue</BlockTitle>
                     <BlockDes>
                        <p>Add information or update issue categories.</p>
                     </BlockDes>
                  </BlockHeadContent>
               </BlockHead>
               <Block>
                  {/* <form onSubmit={ () => handleSubmit(onFormSubmit)}> */}
                  <form onSubmit={handleSubmit(onFormSubmit)} id="form-add-issues">
                     <Row className="g-3">
                        <Col md="6">
                           <div className="form-group">
                              <label className="form-label" htmlFor="name-issue-categories" for="name-issue-categories" id="form-add-issues">
                                 Nama Kategori Issue
                              </label>
                              <div className="form-control-wrap">
                                 <input
                                    id="name-issue-categories"
                                    name="name-issue-categories"
                                    type="text"
                                    className="form-control"
                                    {...register('kode', { required: "This is required" })}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                 {errors.name && <span className="invalid">{errors.name.message}</span>}
                              </div>
                           </div>
                        </Col>

                        <Col size="12">
                           <Button color="primary" type="submit">
                              <Icon className="plus"></Icon>
                              <span>Tambah Kategori Issue</span>
                           </Button>
                        </Col>
                     </Row>
                  </form>
               </Block>
            </SimpleBar>

            {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
         </Content>
      </React.Fragment >
   );
};

export default Issue;
