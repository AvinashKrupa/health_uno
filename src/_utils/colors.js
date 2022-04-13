export default function getColor(info, isSlotSelection = false) {
  if (info.status === "available" && info.is_avail) {
    if (isSlotSelection) {
      return Colors.primaryColor;
    } else {
      return Colors.white;
    }
  } else if (info.status === "available") {
    return Colors.white;
  } else if (info.status === "unavailable") {
    return Colors.gray;
  } else if (info.status === "booked") {
    return Colors.lightPrimaryColor;
  }
}

export function getColorForAppointmentStatus(status) {
  if (status === "scheduled") {
    return Colors.primaryColor;
  } else if (status === "ongoing") {
    return Colors.orange;
  } else if (status === "cancelled") {
    return Colors.red;
  } else if (status === "completed") {
    return Colors.green;
  } else {
    return Colors.gray;
  }
}

export const Colors = {
  primaryColor: "#28A3DA",
  red: "red",
  green: "green",
  lightPrimaryColor: "rgba(40,163,218, 0.2)",
  transparent: "transparent",
  white: "white",
  lightWhite: "rgba(255, 255, 255, 0.5)",
  black: "black",
  lightBlack: "#686868",
  bgColor: "#F5F8FA",
  lightGray: "rgba(27, 27, 27, 0.5)",
  titleColor: "rgba(27, 27, 27, 1)",
  gray: "rgba(225, 225, 225, 1)",
  lightPlacehoderColor: "#63cb72",
  orange: "rgba(246, 146, 30, 1)",
  border: "rgba(27, 27, 27, 0.15)",
};
