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
import { productData, categoryOptions, MachineData, MachineStatusData } from "./ProductData";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import ProductH from "../../../../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../../../../components/Component";
import io from "socket.io-client";
import axios from "axios";
import { BaseURL } from "../../../../config/config";

// const socket = io.connect("http://localhost:3000");

const Machine = () => {
   const MachineDatas = MachineData
   const [data, setData] = useState([]);
   const [sm, updateSm] = useState(false);
   const [statusMachine, setStatusMachine] = useState(false);
   const [formData, setFormData] = useState({
      kode: "",
      name: "",
      pic: "",
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
         await axios.get(`${BaseURL}/machine`).then((response) => {
            console.log('LOG-axios', response.data.data)
            setData(response.data.data)
         }).catch((error) => {
            console.log('LOG-axios-err', error)
         })

      } catch (error) {
         console.log('LOG-Err-fetchData', error)
      }
   }
   useEffect(() => {
      fetchData();
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

   const onFormSubmit = async (event) => {
      const { kode, name, pic, status } = formData;

      let submittedData = {
         kode: kode,
         name: name,
         pic: pic,
         status: statusMachine
      };

      console.log('LOG-submittedData', submittedData, statusMachine)
      await axios.post(`${BaseURL}/machine`, submittedData).then((response) => {
         console.log('LOG-axios', response.data.data)

      })
      setData([submittedData, ...data]);
      event.preventDefault()
      // setView({ open: false });
      // setFiles([]);
      // resetForm();
   };

   const onEditSubmit = (event) => {
      let newItems = data;
      const { kode, name, pic, status } = formData;

      let index = newItems.findIndex((item) => item.id === editId);

      let editedData = {
         kode: kode,
         name: name,
         pic: pic,
         status: statusMachine
      };
      console.log('LOG-editedData', editedData, status, statusMachine)
      newItems[index] = editedData;

      resetForm();
      setView({ edit: false, add: false });
      event.preventDefault()
   };

   // function that loads the want to editted data
   const onEditClick = (id) => {
      data.forEach((item) => {
         if (item.id === id) {
            setFormData({
               name: item.name,
               kode: item.kode,
               pic: item.pic,
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
   const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

   // Change Page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const { register, handleSubmit, reset, formState: { errors } } = useForm();

   return (
      <React.Fragment>
         {console.log('LOG-DATA', data)}
         <Head title="Machine List"></Head>
         <Content>
            <BlockHead size="sm">
               <BlockBetween>
                  <BlockHeadContent>
                     <BlockTitle>Machine</BlockTitle>
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
                                    <span>Add Machine</span>
                                 </Button>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </BlockHeadContent>
               </BlockBetween>
            </BlockHead>
            <Block>
               <Card>
                  <div className="card-inner-group">
                     <div className="card-inner p-0">
                        <DataTableBody>
                           <DataTableHead>
                              {/* <DataTableRow className="nk-tb-col-check">
                                 <div className="custom-control custom-control-sm custom-checkbox notext">
                                    <input
                                       type="checkbox"
                                       className="custom-control-input"
                                       id="uid_1"
                                       onChange={(e) => selectorCheck(e)}
                                    />
                                    <label className="custom-control-label" htmlFor="uid_1"></label>
                                 </div>
                              </DataTableRow> */}
                              <DataTableRow size="sm">
                                 <span>Kode Mesin</span>
                              </DataTableRow>
                              <DataTableRow>
                                 <span>Nama Mesin</span>
                              </DataTableRow>
                              <DataTableRow>
                                 <span>PIC</span>
                              </DataTableRow>
                              <DataTableRow>
                                 <span>Rata Rata Produksi</span>
                              </DataTableRow>
                              <DataTableRow>
                                 <span>Status</span>
                              </DataTableRow>
                              {/* <DataTableRow size="md">
                                 <span>Category</span>
                              </DataTableRow> */}
                              {/* <DataTableRow size="md">
                                 <Icon name="star-round" className="tb-asterisk"></Icon>
                              </DataTableRow> */}
                              <DataTableRow className="nk-tb-col-tools">
                                 Action
                                 {/* <ul className="nk-tb-actions gx-1 my-n1">
                                    <li className="me-n1">
                                       <UncontrolledDropdown>
                                          <DropdownToggle
                                             tag="a"
                                             href="#toggle"
                                             onClick={(ev) => ev.preventDefault()}
                                             className="dropdown-toggle btn btn-icon btn-trigger"
                                          >
                                             <Icon name="more-h"></Icon>
                                          </DropdownToggle>
                                          <DropdownMenu end>
                                             <ul className="link-list-opt no-bdr">
                                                <li>
                                                   <DropdownItem tag="a" href="#edit" onClick={(ev) => ev.preventDefault()}>
                                                      <Icon name="edit"></Icon>
                                                      <span>Edit Selected</span>
                                                   </DropdownItem>
                                                </li>
                                                <li>
                                                   <DropdownItem
                                                      tag="a"
                                                      href="#remove"
                                                      onClick={(ev) => {
                                                         ev.preventDefault();
                                                         selectordeleteMachine();
                                                      }}
                                                   >
                                                      <Icon name="trash"></Icon>
                                                      <span>Remove Selected</span>
                                                   </DropdownItem>
                                                </li>
                                                <li>
                                                   <DropdownItem tag="a" href="#stock" onClick={(ev) => ev.preventDefault()}>
                                                      <Icon name="bar-c"></Icon>
                                                      <span>Update Stock</span>
                                                   </DropdownItem>
                                                </li>
                                                <li>
                                                   <DropdownItem tag="a" href="#price" onClick={(ev) => ev.preventDefault()}>
                                                      <Icon name="invest"></Icon>
                                                      <span>Update Price</span>
                                                   </DropdownItem>
                                                </li>
                                             </ul>
                                          </DropdownMenu>
                                       </UncontrolledDropdown>
                                    </li>
                                 </ul> */}
                              </DataTableRow>
                           </DataTableHead>
                           {currentItems.length > 0
                              ? currentItems.map((item) => {
                                 // const categoryList = []
                                 // item.category.forEach((currentElement) => {
                                 //    categoryList.push(currentElement.label)
                                 // })
                                 return (
                                    <DataTableItem key={item.id}>
                                       {/* <DataTableRow className="nk-tb-col-check">
                                          <div className="custom-control custom-control-sm custom-checkbox notext">
                                             <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                defaultChecked={item.check}
                                                id={item.id + "uid1"}
                                                key={Math.random()}
                                                onChange={(e) => onSelectChange(e, item.id)}
                                             />
                                             <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                                          </div>
                                       </DataTableRow> */}
                                       <DataTableRow>
                                          <span className="tb-sub">{item.kode}</span>
                                       </DataTableRow>
                                       <DataTableRow size="sm">
                                          {/* <span className="tb-sub">   */}
                                          {/* <img src={item.img ? item.img : ProductH} alt="product" className="thumb" /> */}
                                          <span className="tb-sub">{item.name}</span>
                                          {/* </span> */}
                                       </DataTableRow>
                                       <DataTableRow>
                                          <span className="tb-sub">{item.pic}</span>
                                       </DataTableRow>
                                       <DataTableRow>
                                          <span className="tb-sub">{item.averageProduce}</span>
                                       </DataTableRow>
                                       {/* <DataTableRow>
                                          <span className="tb-sub">{item.status}</span>
                                       </DataTableRow> */}
                                       <DataTableRow>
                                          <Badge
                                             className="badge-sm badge-dot has-bg d-none d-sm-inline-flex"
                                             color={
                                                item.status == true ? "success" : "warning"
                                             }
                                          >
                                             {item.status == true ? "READY" : "NOT READY"}
                                          </Badge>
                                       </DataTableRow>
                                       {/* <DataTableRow size="md">
                                          <span className="tb-sub">
                                             {categoryList.join(", ")}
                                          </span>
                                       </DataTableRow> */}
                                       {/* <DataTableRow size="md">
                                          <div className="asterisk tb-asterisk">
                                             <a
                                                href="#asterisk"
                                                className={item.fav ? "active" : ""}
                                                onClick={(ev) => ev.preventDefault()}
                                             >
                                                <Icon name="star" className="asterisk-off"></Icon>
                                                <Icon name="star-fill" className="asterisk-on"></Icon>
                                             </a>
                                          </div>
                                       </DataTableRow> */}
                                       <DataTableRow className="nk-tb-col-tools">
                                          <Button
                                             color="primary"
                                             size="sm"
                                             className="btn btn-dim"
                                             onClick={(ev) => {
                                                ev.preventDefault();
                                                onEditClick(item.id);
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
                                                deleteMachine(item.id);
                                             }}>
                                             <Icon name="trash-alt"></Icon>
                                          </Button>

                                          {/* <ul className="nk-tb-actions gx-1 my-n1">
                                             <li className="me-n1">
                                                <UncontrolledDropdown>
                                                   <DropdownToggle
                                                      tag="a"
                                                      href="#more"
                                                      onClick={(ev) => ev.preventDefault()}
                                                      className="dropdown-toggle btn btn-icon btn-trigger"
                                                   >
                                                      <Icon name="more-h"></Icon>
                                                   </DropdownToggle>
                                                   <DropdownMenu end>
                                                      <ul className="link-list-opt no-bdr">
                                                         <li>
                                                            <DropdownItem
                                                               tag="a"
                                                               href="#edit"
                                                               onClick={(ev) => {
                                                                  ev.preventDefault();
                                                                  onEditClick(item.id);
                                                                  toggle("edit");
                                                               }}
                                                            >
                                                               <Icon name="edit"></Icon>
                                                               <span>Edit Product</span>
                                                            </DropdownItem>
                                                         </li>
                                                         <li>
                                                            <DropdownItem
                                                               tag="a"
                                                               href="#view"
                                                               onClick={(ev) => {
                                                                  ev.preventDefault();
                                                                  onEditClick(item.id);
                                                                  toggle("details");
                                                               }}
                                                            >
                                                               <Icon name="eye"></Icon>
                                                               <span>View Product</span>
                                                            </DropdownItem>
                                                         </li>
                                                         <li>
                                                            <DropdownItem
                                                               tag="a"
                                                               href="#remove"
                                                               onClick={(ev) => {
                                                                  ev.preventDefault();
                                                                  deleteMachine(item.id);
                                                               }}
                                                            >
                                                               <Icon name="trash"></Icon>
                                                               <span>Remove Product</span>
                                                            </DropdownItem>
                                                         </li>
                                                      </ul>
                                                   </DropdownMenu>
                                                </UncontrolledDropdown>
                                             </li>
                                          </ul> */}
                                       </DataTableRow>
                                    </DataTableItem>
                                 );
                              })
                              : null}
                        </DataTableBody>
                        <div className="card-inner">
                           {data.length > 0 ? (
                              <PaginationComponent
                                 itemPerPage={itemPerPage}
                                 totalItems={data.length}
                                 paginate={paginate}
                                 currentPage={currentPage}
                              />
                           ) : (
                              <div className="text-center">
                                 <span className="text-silent">No Machine found</span>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </Card>
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
                     <h5 className="title">Update Machine</h5>
                     <div className="mt-4">
                        <form noValidate onSubmit={onEditSubmit} id="form-update-machine">
                           <Row className="g-3">
                              {/* <Col size="12">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="machine-name">
                                       Nama Mesin
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          type="text"
                                          className="form-control"
                                          {...register('name', {
                                             required: "This field is required",
                                          })}
                                          value={formData.name}
                                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                       {errors.name && <span className="invalid">{errors.name.message}</span>}
                                    </div>
                                 </div>
                              </Col> */}
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="machine-kode" id="form-update-machine">
                                       Kode Mesin
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          id="machine-kode"
                                          name="machine-kode"
                                          type="text"
                                          {...register('kode', { required: "This is required" })}
                                          className="form-control"
                                          value={formData.kode}
                                          onChange={(e) => setFormData({ ...formData, kode: e.target.value })} />
                                       {errors.kode && <span className="invalid">{errors.kode.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="machine-name" id="form-update-machine">
                                       Nama Mesin
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          id="machine-name"
                                          name="machine-name"
                                          type="text"
                                          className="form-control"
                                          {...register('name', { required: "This is required" })}
                                          value={formData.name}
                                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                       {errors.name && <span className="invalid">{errors.name.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="machine-pic" id="form-update-machine">
                                       PIC
                                    </label>
                                    <div className="form-control-wrap">
                                       <input
                                          id="machine-pic"
                                          name="machine-pic"
                                          type="text"
                                          className="form-control"
                                          {...register('pic', { required: "This is required" })}
                                          value={formData.pic}
                                          onChange={(e) => setFormData({ ...formData, pic: e.target.value })} />
                                       {errors.pic && <span className="invalid">{errors.pic.message}</span>}
                                    </div>
                                 </div>
                              </Col>
                              <Col md="6">
                                 <div className="form-group">
                                    <label className="form-label" >
                                       Status Mesin
                                    </label>
                                    <div className="form-control-wrap">
                                       <UncontrolledDropdown>
                                          <DropdownToggle className="dropdown-toggle dropdown-indicator btn btn-sm btn-outline-light btn-white">
                                             {statusMachine == true ? "READY" : "NOT READY"}
                                          </DropdownToggle>
                                          <DropdownMenu end className="dropdown-menu-xs">
                                             <ul className="link-list-opt no-bdr">
                                                <li className={statusMachine == true ? "active" : ""}>
                                                   <DropdownItem
                                                      href="#dropdownitem"
                                                      onClick={(e) => {
                                                         setStatusMachine(true);
                                                         e.preventDefault();
                                                      }}

                                                   >
                                                      <span>READY</span>
                                                   </DropdownItem>
                                                </li>
                                                <li className={statusMachine == false ? "active" : ""}>
                                                   <DropdownItem
                                                      href="#dropdownitem"
                                                      onClick={(e) => {
                                                         setStatusMachine(false);
                                                         e.preventDefault();
                                                      }}
                                                   >
                                                      <span>NOT READY</span>
                                                   </DropdownItem>
                                                </li>
                                             </ul>
                                          </DropdownMenu>
                                       </UncontrolledDropdown>
                                    </div>
                                 </div>
                              </Col>
                              {/* <Col size="12">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="category">
                                       Category
                                    </label>
                                    <div className="form-control-wrap">
                                       <RSelect
                                          isMulti
                                          options={categoryOptions}
                                          value={formData.category}
                                          onChange={(value) => setFormData({ ...formData, category: value })}
                                       //ref={register({ required: "This is required" })}
                                       />
                                       {errors.category && <span className="invalid">{errors.category.message}</span>}
                                    </div>
                                 </div>
                              </Col> */}
                              {/* <Col size="6">
                                 <div className="form-group">
                                    <label className="form-label" htmlFor="category">
                                       Product Image
                                    </label>
                                    <div className="form-control-wrap">
                                       <img src={formData.img} alt=""></img>
                                    </div>
                                 </div>
                              </Col> */}
                              {/* <Col size="6">
                                 <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                       <section>
                                          <div
                                             {...getRootProps()}
                                             className="dropzone upload-zone small bg-lighter my-2 dz-clickable"
                                          >
                                             <input {...getInputProps()} />
                                             {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                                             {files.map((file) => (
                                                <div
                                                   key={file.name}
                                                   className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                                                >
                                                   <div className="dz-image">
                                                      <img src={file.preview} alt="preview" />
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       </section>
                                    )}
                                 </Dropzone>
                              </Col> */}

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
            {/* FORM NOT USED */}
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
                  <div className="nk-modal-head">
                     <h4 className="nk-modal-title title">
                        Product <small className="text-primary">#{formData.kode}</small>
                     </h4>
                     {/* <img src={formData.img} alt="" /> */}
                  </div>
                  <div className="nk-tnx-details mt-sm-3">
                     <Row className="gy-3">
                        <Col lg={6}>
                           <span className="sub-text">Nama Mesin</span>
                           <span className="caption-text">{formData.name}</span>
                        </Col>
                        <Col lg={6}>
                           <span className="sub-text">Kode Mesin</span>
                           <span className="caption-text">$ {formData.kode}</span>
                        </Col>
                        {/* <Col lg={6}>
                           <span className="sub-text">Product Category</span>
                           <span className="caption-text">
                              {formData.category.map((item, index) => (
                                 <Badge key={index} className="me-1" color="secondary">
                                    {item.value}
                                 </Badge>
                              ))}
                           </span>
                        </Col> */}
                        <Col lg={6}>
                           <span className="sub-text">PIC</span>
                           <span className="caption-text"> {formData.pic}</span>
                        </Col>
                     </Row>
                  </div>
               </ModalBody>
            </Modal>

            {/* FORM ADD */}
            {/* {console.log("LOG-DATA", formData.name, formData.kode, formData.pic, formData.status)} */}
            <SimpleBar
               className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
                  }`}
            >
               <BlockHead>
                  <BlockHeadContent>
                     <BlockTitle tag="h5">Add Machine</BlockTitle>
                     <BlockDes>
                        <p>Add information or update Machine.</p>
                     </BlockDes>
                  </BlockHeadContent>
               </BlockHead>
               <Block>
                  {/* <form onSubmit={ () => handleSubmit(onFormSubmit)}> */}
                  <form onSubmit={onFormSubmit} id="form-add-machine">
                     <Row className="g-3">
                        {/* <Col size="12">
                           <div className="form-group">
                              <label className="form-label" htmlFor="machine-name">
                                 Nama Mesin
                              </label>
                              <div className="form-control-wrap">
                                 <input
                                    type="text"
                                    className="form-control"
                                    {...register('name', {
                                       required: "This field is required",
                                    })}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                 {errors.name && <span className="invalid">{errors.name.message}</span>}
                              </div>
                           </div>
                        </Col> */}
                        <Col md="6">
                           <div className="form-group">
                              <label className="form-label" htmlFor="machine-kode" for="machine-kode" id="form-add-machine">
                                 Kode Mesin
                              </label>
                              <div className="form-control-wrap">
                                 <input
                                    id="machine-kode"
                                    name="machine-kode"
                                    type="text"
                                    className="form-control"
                                    {...register('kode', { required: "This is required" })}
                                    value={formData.kode}
                                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })} />
                                 {errors.kode && <span className="invalid">{errors.kode.message}</span>}
                              </div>
                           </div>
                        </Col>
                        <Col md="6">
                           <div className="form-group">
                              <label className="form-label" htmlFor="machine-name" id="form-add-machine">
                                 Nama Mesin
                              </label>
                              <div className="form-control-wrap">
                                 <input
                                    id="machine-name"
                                    name="machine-name"
                                    type="text"
                                    {...register('name', { required: "This is required" })}
                                    className="form-control"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                 {errors.name && <span className="invalid">{errors.name.message}</span>}
                              </div>
                           </div>
                        </Col>
                        <Col md="6">
                           <div className="form-group">
                              <label className="form-label" htmlFor="machine-pic" id="form-add-machine">
                                 PIC
                              </label>
                              <div className="form-control-wrap">
                                 <input
                                    id="machine-pic"
                                    name="machine-pic"
                                    type="text"
                                    className="form-control"
                                    {...register('pic', { required: "This is required" })}
                                    value={formData.pic}
                                    onChange={(e) => setFormData({ ...formData, pic: e.target.value })} />
                                 {errors.pic && <span className="invalid">{errors.pic.message}</span>}
                              </div>
                           </div>
                        </Col>
                        <Col md="6">
                           <div className="form-group">
                              <label className="form-label" id="form-add-machine">
                                 Status Mesin
                              </label>
                              <div className="form-control-wrap">
                                 {/* <input
                                    type="text"
                                    className="form-control"
                                    {...register('sku', { required: "This is required" })}
                                    value={formData.kode}
                                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })} />
                                 {errors.sku && <span className="invalid">{errors.kode.message}</span>} */}
                                 <div className="card-tools">
                                    <UncontrolledDropdown>
                                       <DropdownToggle className="dropdown-toggle dropdown-indicator btn btn-sm btn-outline-light btn-white">
                                          {statusMachine == true ? "READY" : "NOT READY"}
                                       </DropdownToggle>
                                       <DropdownMenu end className="dropdown-menu-xs">
                                          <ul className="link-list-opt no-bdr">
                                             <li className={statusMachine == true ? "active" : ""}>
                                                <DropdownItem
                                                   href="#dropdownitem"
                                                   onClick={(e) => {
                                                      e.preventDefault();
                                                      setStatusMachine(true);
                                                   }}

                                                >
                                                   <span>READY</span>
                                                </DropdownItem>
                                             </li>
                                             <li className={statusMachine == false ? "active" : ""}>
                                                <DropdownItem
                                                   href="#dropdownitem"
                                                   onClick={(e) => {
                                                      e.preventDefault();
                                                      setStatusMachine(false);
                                                   }}
                                                >
                                                   <span>NOT READY</span>
                                                </DropdownItem>
                                             </li>
                                          </ul>
                                       </DropdownMenu>
                                    </UncontrolledDropdown>
                                 </div>
                              </div>
                           </div>
                        </Col>
                        {/* <Col size="12">
                           <div className="form-group">
                              <label className="form-label" htmlFor="category">
                                 Category
                              </label>
                              <div className="form-control-wrap">
                                 <RSelect
                                    name="category"
                                    isMulti
                                    options={categoryOptions}
                                    onChange={(value) => setFormData({ ...formData, category: value })}
                                    value={formData.category}
                                 //ref={register({ required: "This is required" })}
                                 />
                                 {errors.category && <span className="invalid">{errors.category.message}</span>}
                              </div>
                           </div>
                        </Col> */}
                        {/* <Col size="12">
                           <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                              {({ getRootProps, getInputProps }) => (
                                 <section>
                                    <div {...getRootProps()} className="dropzone upload-zone small bg-lighter my-2 dz-clickable">
                                       <input {...getInputProps()} />
                                       {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                                       {files.map((file) => (
                                          <div
                                             key={file.name}
                                             className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                                          >
                                             <div className="dz-image">
                                                <img src={file.preview} alt="preview" />
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </section>
                              )}
                           </Dropzone>
                        </Col> */}

                        <Col size="12">
                           <Button color="primary" type="submit">
                              <Icon className="plus"></Icon>
                              <span>Add Machine</span>
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

export default Machine;
