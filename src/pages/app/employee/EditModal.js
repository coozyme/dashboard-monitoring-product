import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  Form,
  Alert
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
import { dataRoles } from "./UserData";

const EditModal = ({ modal, closeModal, onSubmit, formData, setFormData, filterStatus }) => {
  const [roles, setRoles] = useState([]);

  const [dataUser, setDataUser] = useState({
    fullname: formData?.fullname,
    username: formData?.username,
    role: formData?.role,
    roleId: formData?.roleId,
    isActive: formData?.isActive,
  });
  const [alert, setAlert] = useState({
    visible: false,
    color: "",
    text: "",
  });

  const fetchDataRole = async () => {
    await axios.get(`${BaseURL}/management-user/roles`).then(res => {
      console.log("LOG-roles", res.data.data)
      const newDataRole = []
      res?.data?.data.forEach(data => {
        newDataRole.push({
          value: data.id,
          label: data.title
        })
      });
      setRoles(newDataRole);


      // roles.forEach((data, idx) => {
      // console.log("LOG-data.title", data.title)
      // const resultFind = roles.find(({ title }) => title === dataRole.label);
      // // if (dataRole.label == data.title) {
      // console.log("LOG-resultFind", resultFind)
      // setDataRole({
      //   value: resultFind.id,
      //   label: resultFind.title,
      // })
      // console.log("LOG-roles2", data, idx)
      // }

      // });
    }).catch((err) => {
      console.log("LOG-err", err)
      AlertMessage()
    });

  }
  useEffect(() => {
    console.log("LOG-formData", formData)
    setDataUser(formData)
    fetchDataRole()

    // const resultFind = roles.find(({ title }) => title === dataRole.label);
    // if (dataRole.label == data.title) {
    // console.log("LOG-resultFind", resultFind)
    // setDataRole({
    //   value: resultFind.id,
    //   label: resultFind.title,
    // })

    reset(formData)
  }, [formData]);


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
      {alert.visible && (
        <Alert className="alert-icon" color={alert?.color}>
          <Icon name="alert-circle" />
          <strong>{alert?.text}</strong>.
        </Alert>
      )}

      <ModalBody>
        {console.log("LOG-dataUser", dataUser)}
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
          <h5 className="title">Update User</h5>
          <div className="mt-4">
            <Form className="row gy-4" onSubmit={handleSubmit(onSubmit)}>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Fullname</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register('fullname', { required: "This field is required" })}
                    value={dataUser.fullname}
                    onChange={(e) => setDataUser({ ...dataUser, fullname: e.target.value })}
                    placeholder="Enter fullname name" />
                  {errors.fullname && <span className="invalid">{errors.fullname.message}</span>}
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register('username', { required: "This field is required" })}
                    value={dataUser.username}
                    onChange={(e) => setDataUser({ ...dataUser, username: e.target.value })}
                    placeholder="Enter username" />
                  {errors.username && <span className="invalid">{errors.username.message}</span>}
                </div>
              </Col>
              {/* <Col md="6">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register('email', {
                      required: "This field is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "invalid email address",
                      },
                    })}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email" />
                  {errors.email && <span className="invalid">{errors.email.message}</span>}
                </div>
              </Col> */}
              {/* <Col md="6">
                <div className="form-group">
                  <label className="form-label">Balance</label>
                  <input
                    className="form-control"
                    type="number"
                    {...register('balance')}
                    disabled
                    value={parseFloat(formData.balance)}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    placeholder="Balance" />
                  {errors.balance && <span className="invalid">{errors.balance.message}</span>}
                </div>
              </Col> */}
              {/* <Col md="6">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    type="number"
                    {...register('phone', { required: "This field is required" })}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                </div>
              </Col> */}
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
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <div className="form-control-wrap">
                    <RSelect
                      options={filterStatus}
                      value={{
                        value: dataUser.isActive,
                        label: dataUser.isActive ? "Active" : "Inactive",
                      }}
                      onChange={(e) => { console.log('LOG-DD', e.value), setDataUser({ ...dataUser, isActive: e.value }) }}
                    />
                  </div>
                </div>
              </Col>
              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      Update User
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
export default EditModal;
