import React from "react";
import LogoLight2x from "../../images/logo2x.png";
import LogoDark2x from "../../images/logo-dark2x.png";
import LogoSmall from "../../images/logo-small.png";
// import LogoSmall from "../../images/logo-small.png";
import LogoMonev from "../../images/logo-monev.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      <img className="logo-light logo-img" src={LogoMonev} alt="logo" />
      <img className="logo-dark logo-img" src={LogoMonev} alt="logo" />
      <img className="logo-small logo-img logo-img-small" src={LogoMonev} alt="logo" />
    </Link>
  );
};

export default Logo;
