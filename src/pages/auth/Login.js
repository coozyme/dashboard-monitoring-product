import React, { useState } from "react";
import Logo from "../../images/logo-monev.png";
// import LogoDark from "../../images/logo-dark.png";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "../../config/config";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");

  const onFormSubmit = async (formData) => {
    setLoading(true);

    var data = {
      username: formData.username,
      password: formData.password
    }

    // try {
    //   const res = await axios.post(`${BaseURL}/auth/login`, data)
    //   const token = res?.data?.data?.token
    //   fetchDataUser(token);
    // } catch (error) {
    //   setError(res?.response?.data?.message);
    //   setLoading(false);
    // }
    await axios.post(`${BaseURL}/auth/login`, data).then(res => {
      console.log("LOG-res-auth", res)
      const token = res?.data?.data?.token
      fetchDataUser(token);
    }).catch(err => {
      console.log("LOG-err", err)

      setError(err?.response?.data?.message);
      setLoading(false);
    })
  };

  const fetchDataUser = async (accessToken) => {
    await axios.get(`${BaseURL}/user`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then(res => {
      const data = res?.data?.data;

      if (data?.menu?.length === 0) {
        setError("You don't have access to this system");
        return;
      }

      console.log("LOG-res", res)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(data));

      setTimeout(() => {
        window.history.pushState(
          `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
          "auth-login",
          `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
        );
        window.location.reload();
      }, 100);
      setLoading(false);
    }).catch(err => {
      console.log("LOG-err", err)
      setLoading(false);
    })
  }

  const { register, handleSubmit, formState: { errors } } = useForm();

  return <>
    <Head title="Login" />
    <Block className="nk-block-middle nk-auth-body  wide-xs">
      <div className="brand-logo pb-4 text-center">
        <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
          <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
          <img className="logo-dark logo-img logo-img-lg" src={Logo} alt="logo-dark" />
        </Link>
      </div>

      <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
        <BlockHead>
          <BlockContent>
            <BlockTitle tag="h4">Sign-In</BlockTitle>
            <BlockDes>
              <p>Access Monitoring & Evaluation Sistem using your username and password.</p>
            </BlockDes>
          </BlockContent>
        </BlockHead>
        {errorVal && (
          <div className="mb-3">
            <Alert color="danger" className="alert-icon">
              <Icon name="alert-circle" /> {errorVal ? `${errorVal}!` : "Unable to login with credentials"}
            </Alert>
          </div>
        )}
        <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="form-group">
            <div className="form-label-group">
              <label className="form-label" htmlFor="default-01">
                Username
              </label>
            </div>
            <div className="form-control-wrap">
              <input
                type="text"
                id="default-01"
                {...register('username', { required: "This field is required" })}
                // defaultValue="info@softnio.com"
                placeholder="Enter your username"
                className="form-control-lg form-control" />
              {errors.username && <span className="invalid">{errors.username.message}</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="form-label-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              {/* <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                  Forgot Code?
                </Link> */}
            </div>
            <div className="form-control-wrap">
              <a
                href="#password"
                onClick={(ev) => {
                  ev.preventDefault();
                  setPassState(!passState);
                }}
                className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
              >
                <Icon name="eye" className="passcode-icon icon-show"></Icon>

                <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
              </a>
              <input
                type={passState ? "text" : "password"}
                id="password"
                {...register('password', { required: "This field is required" })}
                // defaultValue="123456"
                placeholder="Enter your passsword"
                className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`} />
              {errors.password && <span className="invalid">{errors.password.message}</span>}
            </div>
          </div>
          <div className="form-group">
            <Button size="lg" className="btn-block" type="submit" color="primary">
              {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
            </Button>
          </div>
        </Form>
        {/* <div className="form-note-s2 text-center pt-4"> */}
        {/* New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
        </div> */}
        {/* <div className="text-center pt-4 pb-3">
          <h6 className="overline-title overline-title-sap">
            <span>OR</span>
          </h6>
        </div> */}
        {/* <ul className="nav justify-center gx-4">
          <li className="nav-item">
            <a
              className="nav-link"
              href="#socials"
              onClick={(ev) => {
                ev.preventDefault();
              }}
            >
              Facebook
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#socials"
              onClick={(ev) => {
                ev.preventDefault();
              }}
            >
              Google
            </a>
          </li>
        </ul> */}
      </PreviewCard>
    </Block>
    <AuthFooter />
  </>;
};
export default Login;
