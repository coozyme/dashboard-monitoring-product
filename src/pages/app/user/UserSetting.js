import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import { Card, Badge, Col, Row } from "reactstrap";
import SimpleBar from "simplebar-react";
import Head from "../../../layout/head/Head";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
  Button,
} from "../../../components/Component";
import UserProfileAside from "./UserProfileAside";
import { set, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import { BaseURL } from "../../../config/config";

const UserSetting = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [view, setView] = useState({
    changePassword: false,
  })


  const resetForm = () => {
    setFormData({
      username: "",
      password: ""
    })
  }

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  useEffect(() => {
    viewChange();
    const dataUser = JSON.parse(localStorage.getItem("user"));
    setFormData({ ...formData, username: dataUser?.username })
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
      updateSm(false);
    });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };


  }, []);


  const handleChangePassword = () => {
    setView({ ...view, changePassword: true })
  }


  const onFormChangePassword = async () => {
    const { password } = formData;

    // var 
    console.log("LOG-password", password)
    const payload = {
      username: formData.username,
      password: formData.password,
    }

    try {
      await axios.post(`${BaseURL}/auth/change-password`, payload).then(() => {
        setView({ ...view, changePassword: false })
        resetForm()
      })
    } catch (error) {
      console.log('LOG-ERROR-onSubmitResetPassword', error)
    }

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

  const onSubmitResetPassword = async () => {

  }

  // const generatePassword = async () => {
  //   try {
  //     await axios.get(`${BaseURL}/auth/generate-password`).then((res) => {
  //       setDataUser({ ...dataUser, password: res.data.data.newPassword })
  //       console.log('LOG-PASS', dataUser)
  //     }).catch((err) => {
  //       console.log("LOG-err", err)
  //     });
  //   } catch (error) {
  //     AlertMessage()
  //   }
  // }
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card>
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${sm ? "content-active" : ""
                }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Security Settings</BlockTitle>
                    <BlockDes>
                      <p>These settings will help you to keep your account secure.</p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <Block>
                <Card>
                  <div className="card-inner-group">
                    {/* <div className="card-inner">
                      <div className="between-center flex-wrap flex-md-nowrap g-3">
                        <div className="nk-block-text">
                          <h6>Save my Activity Logs</h6>
                          <p>You can save your all activity logs including unusual activity detected.</p>
                        </div>
                        <div className="nk-block-actions">
                          <ul className="align-center gx-3">
                            <li className="order-md-last">
                              <div className="custom-control custom-switch me-n2">
                                <InputSwitch checked id="activity-log" />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div> */}
                    <div className="card-inner">
                      <div className="between-center flex-wrap g-3">
                        <div className="nk-block-text">
                          <h6>Change Password</h6>
                          <p>Set a unique password to protect your account.</p>
                        </div>
                        <div className="nk-block-actions flex-shrink-sm-0">
                          <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                            <li className="order-md-last">
                              <Button color="primary" onClick={() => handleChangePassword()} >Change Password</Button>
                            </li>
                            {/* <li>
                              <em className="text-soft text-date fs-12px">
                                Last changed: <span>Oct 2, 2019</span>
                              </em>
                            </li> */}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* <div className="card-body">
                      <div className="between-center flex-wrap flex-md-nowrap g-3">
                        <div className="nk-block-text">
                          <h6>
                            2 Factor Auth &nbsp; <Badge color="success" className="ml-0">Enabled</Badge>
                          </h6>
                          <p>
                            Secure your account with 2FA security. When it is activated you will need to enter not only your
                            password, but also a special code using app. You will receive this code via mobile application.{" "}
                          </p>
                        </div>
                        <div className="nk-block-actions">
                          <Button color="primary">Disable</Button>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </Card>
              </Block>
            </div>
          </div>
        </Card>

        {/* FORM ADD */}
        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.changePassword ? "content-active" : ""
            }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Change Password</BlockTitle>
              <BlockDes>
                <p>Change your password for security information.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            {/* <form onSubmit={ () => handleSubmit(onFormSubmit)}> */}
            <form onSubmit={handleSubmit(onFormChangePassword)} id="form-add-issues">
              <Row className="g-3">
                <Col md="12">
                  <div className="form-group">
                    <label className="form-label" htmlFor="change-password" for="change-password" id="form-change-password">
                      New Password
                    </label>
                    <div className="form-control-wrap">
                      <input
                        id="change-password"
                        name="change-password"
                        type="text"
                        className="form-control"
                        {...register('password', { required: "This is required" })}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                      {errors.password && <span className="invalid">{errors.name.message}</span>}
                    </div>
                  </div>
                </Col>

                <Col size="12">
                  <Button color="primary" type="submit">
                    <Icon className="plus"></Icon>
                    <span>Save Password</span>
                  </Button>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>

      </Content>
    </React.Fragment>
  );
};

export default UserSetting;
