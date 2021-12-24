import React from "react";
import Loader from "react-loader-spinner";

const CustomSpinner = ({ showLoader, width, height, sty, type = "ThreeDots" }) => {
  const renderer = () => {
    const style = {sty} || {
      position: "fixed",
      top: "50%",
      left: "60%",
      transform: "translate(-50%, -50%)",
    };
    if (showLoader) {
      return (
        <div style={style}>
          <Loader
            type={type}
            color="#1b5a90"
            height={width || 80}
            width={height || 80}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  return <>{renderer()}</>;
};

export default CustomSpinner;
