import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    maxWidth: 450,
    width: "100%",
    marginTop: "0px",
  },
  label: {
    margin: " 5px 0px",
  },
  select: {
    border: "1px solid #ced4da",
    padding: "3px 10px",
    marginTop: "0px !important",
  },
  root: {
    "&$checked": {
      color: "#28a3da",
    },
  },
  selectAllText: {
    fontWeight: 500,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};

export { useStyles, MenuProps };
