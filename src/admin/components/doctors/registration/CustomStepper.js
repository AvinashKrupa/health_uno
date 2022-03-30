import React from "react";
import StepConnector from "@material-ui/core/StepConnector";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";

function getSteps() {
  return ["Basic Details", "Qualifications", "Confirm Slots"];
}

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "white",
    zIndex: 1,
    color: "rgba(40, 163, 218, 1)",
    width: 74.47,
    height: 74.47,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    border: "4.96461px solid #28A3DA",
  },
  active: {
    background: "rgba(40, 163, 218, 1)",
    color: "white",
  },
  completed: {
    background: "rgba(40, 163, 218, 1)",
    color: "white",
  },
});

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 33,
  },
  active: {
    "& $line": {
      backgroundColor: "rgba(40, 163, 218, 1)",
    },
  },
  completed: {
    "& $line": {
      backgroundColor: "rgba(40, 163, 218, 1)",
    },
  },
  line: {
    height: 4.96,
    border: 0,
    backgroundColor: "#C4C4C4",
    borderRadius: 1,
  },
})(StepConnector);

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1:  <i className="fas fa-bars"></i>,
    2: <i className="fas fa-award"></i>  ,
    3:  <i className="fas fa-calendar-alt"></i>,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const CustomStepper = (props) => {
  const steps = getSteps();

  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={props.activeStep - 1}
        connector={<ColorlibConnector />}
        style={{margin: 'auto', maxWidth: '800px'}}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CustomStepper;