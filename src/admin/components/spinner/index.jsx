import React from "react";
import Loader from "react-loader-spinner";
import './spinner.css'

const Spinner = ({ showLoader, width, height }) => {
  const renderer = () => {
    if (showLoader) {
      return (
        <div className="spinner">
          <Loader
            type="ThreeDots"
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

export default Spinner;
