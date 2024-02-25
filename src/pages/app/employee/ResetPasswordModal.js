import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  Form,
  Alert,
  Row
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
import { copyToClipboard } from "../../../utils/Helper";
import CopyToClipboard from "react-copy-to-clipboard";

const ResetPasswordModal = ({ modal, closeModal, onSubmit, formData, setFormData, filterStatus }) => {
  const [roles, setRoles] = useState([]);
  const [copy, setCopy] = useState(false);

  const [dataUser, setDataUser] = useState({
    id: formData?.id,
    username: formData?.username,
    password: "",
  });
  const [alert, setAlert] = useState({
    visible: false,
    color: "",
    text: "",
  });

  // const fetchDataRole = async () => {
  //   await axios.get(`${BaseURL}/auth/change-password`).then(res => {
  //     const newDataRole = []
  //     res?.data?.data.forEach(data => {
  //       newDataRole.push({
  //         value: data.id,
  //         label: data.title
  //       })
  //     });
  //     setRoles(newDataRole);


  //   }).catch((err) => {
  //     console.log("LOG-err", err)
  //     AlertMessage()
  //   });
  // }
  const handleCopy = () => {
    setCopy(true);
    // setTimeout(() => setCopy(false), 2000);
  };

  const generatePassword = async () => {
    try {
      await axios.get(`${BaseURL}/auth/generate-password`).then((res) => {
        setDataUser({ ...dataUser, password: res.data.data.newPassword })
        console.log('LOG-PASS', dataUser)
      }).catch((err) => {
        console.log("LOG-err", err)
      });
    } catch (error) {
      AlertMessage()
    }
  }


  const onSubmitResetPassword = async () => {
    const payload = {
      username: formData.username,
      password: dataUser.password,
    }

    try {
      await axios.post(`${BaseURL}/auth/change-password`, payload).then((res) => {
        closeModal()
        onSubmit()
      })

    } catch (error) {
      AlertMessage()
    }
  }

  useEffect(() => {
    console.log("LOG-formData", formData)
    setDataUser({
      ...dataUser,
      username: formData.username
    })

    // reset(formData)
  }, []);


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
          <h5 className="title">Reset Password</h5>
          <div className="mt-4">
            <Form className="row gy-4"
              noValidate
              onSubmit={handleSubmit(onSubmitResetPassword)}
            >
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-control"
                    type="text"
                    disabled
                    // {...register('username', { required: "This field is required" })}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Enter username" />
                  {errors.username && <span className="invalid">{errors.username.message}</span>}
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    disabled
                    className="form-control"
                    type="text"
                    // {...register('password', { required: "This field is required" })}
                    value={dataUser.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value }),
                        setDataUser({ ...dataUser, password: e.target.value })
                    }}
                    placeholder="Enter Password" />
                  {errors.password && <span className="invalid">{errors.password.message}</span>}
                </div>

              </Col>
              <Col md="2" className="pl-4">
                <div className={`${copy ? "clipboard-success" : "text-info"} bg-red`}>
                  <CopyToClipboard text={dataUser.password} >
                    <Button type="button" className="btn-icon btn-clipboard clipboard-init clipboard-text" onClick={() => handleCopy()}>
                      <Icon name="copy" ></Icon>
                    </Button>
                  </CopyToClipboard>
                </div>
              </Col>
              <Col md="2">
                <a color="light"
                  onClick={(ev) => {
                    ev.preventDefault();
                    generatePassword();
                  }}
                  className="link link-light"
                >
                  <Icon name="reload" onClick={() => generatePassword()}></Icon>
                  <span className="d-none d-sm-inline-block">Generate Password</span>
                </a>
              </Col>
              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      Submit
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
export default ResetPasswordModal;
