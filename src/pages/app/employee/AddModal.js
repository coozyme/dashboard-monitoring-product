import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  Form,
} from "reactstrap";
import {
  Icon,
  Col,
  Button,
  RSelect,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BaseURL } from "../../../config/config";


const AddModal = ({ modal, closeModal, onSubmit, formData, setFormData, filterStatus }) => {
  const [roles, setRoles] = useState([]);

  const [dataUser, setDataUser] = useState({
    fullname: formData?.fullname,
    username: formData?.username,
    role: formData?.role,
    roleId: formData?.roleId,
  });

  const [alert, setAlert] = useState({
    visible: false,
    color: "",
    text: "",
  });

  useEffect(() => {
    fetchDataRole()
    reset(formData)
  }, [formData]);


  const fetchDataRole = async () => {
    await axios.get(`${BaseURL}/management-user/roles`).then((res) => {
      console.log("LOG-roles2", res)
      const newDataRole = []
      res?.data?.data.forEach(data => {
        newDataRole.push({
          value: data.id,
          label: data.title
        })
      });
      setRoles(newDataRole);
      console.log("LOG-newDataRole", roles)

    }).catch((err) => {
      console.log("LOG-err", err)
      AlertMessage()
    });
  }

  const generatePassword = async () => {
    await axios.get(`${BaseURL}/auth/generate-password`).then((res) => {
      setFormData({ ...formData, password: res.data.data.newPassword })
    }).catch((err) => {
      console.log("LOG-err", err)
      AlertMessage()
    });
  }

  const onSubmitEmployee = async (data) => {
    const payload = {
      fullname: data.fullname,
      username: data.username,
      password: data.password,
      roleId: dataUser?.roleId,
    }
    console.log("LOG-data", data)
    await axios.post(`${BaseURL}/employee/add-employee`, payload).then((res) => {
      console.log("LOG-res", res)
      onSubmit()
      closeModal()
      // window.location.reload()
    }).catch((err) => {
      console.log("LOG-err", err)
      AlertMessage()
    });
  }

  const AlertMessage = () => {
    return (
      setAlert({
        visible: true,
        color: "danger",
        text: "Something went wrong",
      }),
      setTimeout(() => {
        setAlert({ visible: false, color: "", text: "" });
      }, 4000)
    )
  }

  const { reset, register, handleSubmit, formState: { errors } } = useForm();
  return (

    <Modal isOpen={modal} toggle={() => closeModal()} className="modal-dialog-centered" size="lg">
      <ModalBody>
        <a
          href="#cancel"
          onClick={(ev) => {
            ev.preventDefault();
            closeModal()
          }}
          className="close"
        >
          <Icon name="cross-sm"></Icon>
        </a>
        <div className="p-2">
          <h5 className="title">Add Employee</h5>
          <div className="mt-4">
            <Form className="row gy-4" noValidate onSubmit={handleSubmit(onSubmitEmployee)}>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Fullname</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register('fullname', { required: "This field is required" })}
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    placeholder="Enter Fullname" />
                  {errors.fullname && <span className="invalid">{errors.fullname.message}</span>}
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register('username', {
                      required: "This field is required",
                      // pattern: {
                      //   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      //   message: "invalid username address",
                      // },
                    })}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter Username" />
                  {errors.username && <span className="invalid">{errors.username.message}</span>}
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register('password', { required: "This field is required" })}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter Password" />
                  {errors.password && <span className="invalid">{errors.password.message}</span>}
                </div>


              </Col>


              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div className="form-control-wrap">
                    <RSelect
                      options={roles}
                      value={{
                        value: dataUser?.roleId,
                        label: dataUser?.role,
                      }}
                      onChange={(e) => { setDataUser({ ...dataUser, roleId: e.value, role: e.label }) }}
                    />
                  </div>
                </div>
              </Col>

              <Col md="2">
                <Button color="light" className="btn-icon p-md-2" onClick={() => generatePassword()}>
                  <Icon name="reload"></Icon>
                  <span className="d-none d-sm-inline-block">Generate Password</span>
                </Button>
              </Col>
              {/* <Col md="12">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <div className="form-control-wrap">
                    <RSelect
                      options={filterStatus}
                      value={{
                        value: formData.status,
                        label: formData.status,
                      }}
                      onChange={(e) => setFormData({ ...formData, status: e.value })}
                    />
                  </div>
                </div>
              </Col> */}
              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      Add User
                    </Button>
                  </li>
                  <li>
                    <a
                      href="#cancel"
                      onClick={(ev) => {
                        ev.preventDefault();
                        closeModal();
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </a>
                  </li>
                </ul>
              </Col>
            </Form>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default AddModal;
