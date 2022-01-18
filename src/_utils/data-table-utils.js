import React from "react";
import moment from "moment";
import {
  changeCaseFirstLetter,
  constants,
  getFormattedDate,
  getFullName,
  getNextSlot,
} from "./common-utils";
import { Link } from "react-router-dom";
import { Tag, Button, Input, Space, Select } from "antd";

export const sorterDate = (a, b) => {
  return moment(a).diff(moment(b), "seconds");
};
export const sorterText = (a, b) => {
  if (!a) a = "";
  if (!b) b = "";
  return a.localeCompare(b);
};
export const sorterBoolean = (a, b) => {
  if (a && !b) return 1;
  else if (b && !a) return -1;
  else return 0;
};
export const sorterNumber = (a, b) => {
  if (!a) a = Number.MIN_SAFE_INTEGER;
  if (!b) b = Number.MIN_SAFE_INTEGER;
  return a - b;
};
export const renderDate = (date) => {
  return <div className="sorting_1">{getFormattedDate(date)}</div>;
};

export const renderName = (record, prefix, suffix, includeImage = false) => {
  return (
    <h2 className="table-avatar">
      {includeImage && (
        <Link to={createProfileLink(record)} className="avatar avatar-sm mr-2">
          <img alt="" src={record.user_id.dp} />
        </Link>
      )}
      <Link to={createProfileLink(record)}>
        <a>{`${prefix ? prefix + " " : ""}${getFullName(record)}${
          suffix ? " " + suffix : ""
        }`}</a>
      </Link>
    </h2>
  );
};
const createProfileLink = (record) => {
  return record
    ? "/profile/" +
        record?.user_id?._id +
        "/" +
        (record.hasOwnProperty("med_cond")
          ? constants.USER_TYPE_PATIENT
          : constants.USER_TYPE_DOCTOR)
    : "/profile";
};

export const renderNameForAppointment = (record, prefix, suffix, includeImage = false, type) => {
  return (
    <h2 className="table-avatar">
      {includeImage && (
        <Link to={createProfileLinkForAppointment(record,type)} className="avatar avatar-sm mr-2">
          <img alt="" src={record.user_id.dp} />
        </Link>
      )}
      <Link to={createProfileLinkForAppointment(record,type)}>
        <a>{`${prefix ? prefix + " " : ""}${getFullName(record)}${
          suffix ? " " + suffix : ""
        }`}</a>
      </Link>
    </h2>
  );
};

const createProfileLinkForAppointment = (record,type) => {
  let url = ''
  if(type === "patient"){
    url =record
    ? "/profile/" +
        record?.user_id?._id +
        "/1"
    : "/profile"
  }
  else if(type === 'doctor'){
   url =  record
    ? "/profile/" +
        record?.user_id +
        "/2"
    : "/profile";
  }
  return url
};

export const renderChips = (items) => {
  return items.map((item) => {
    return <div>{item.title}</div>;
  });
};
export const renderText = (text) => {
  return <div className="sorting_1">{changeCaseFirstLetter(text)}</div>;
};
export const renderBoolean = (value) => {
  return <div className="sorting_1">{value ? "Enabled" : "Disabled"}</div>;
};

export const renderStatus = (value) => {
  return (
    <div style={{ textTransform: "capitalize" }} className="sorting_1">
      {value}
    </div>
  );
};

export const renderTextWithImage = (text, url) => {
  return (
    <h2 className="table-avatar">
      <a className="avatar avatar-sm mr-2">
        <img src={url} className="avatar-img" alt="" />
      </a>
      <a>{text}</a>
    </h2>
  );
};
export const renderDropDown = (
  name,
  items,
  onItemClick,
  onButtonClick,
  showMenu
) => {
  return (
    <div className="btn-group">
      <button
        type="button"
        onClick={() => onButtonClick()}
        className="btn btn-primary dropdown-toggle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {name}
      </button>
      <div className={showMenu ? "dropdown-menu show" : "dropdown-menu"}>
        {items.map((elem, index) => {
          return (
            <a
              className="dropdown-item"
              onClick={() => {
                if (onItemClick) onItemClick(elem, index);
              }}
            >
              {changeCaseFirstLetter(elem)}
            </a>
          );
        })}
      </div>
    </div>
  );
};
export const renderEditDisableActions = (
  handleShow,
  record,
  type = 0,
  isCoupon = false
) => {
  if (isCoupon) {
    return (
      <div className="actions">
        {type == 0 ? (
          <>
            <a
              href="#0"
              className="btn btn-sm bg-success-light"
              onClick={() => {
                handleShow("edit");
              }}
            >
              <i className="fe fe-pencil"></i> Edit
            </a>

            <a
              href="#0"
              className={`btn btn-sm ${
                record.enabled ? "bg-danger-light" : "bg-success-light"
              }`}
              onClick={() => handleShow("disable")}
            >
              {record.enabled ? "Disable" : " Enable"}
            </a>
          </>
        ) : (
          <>
            {record.status == "inactive" || record.status == "active" ? (
              <a
                href="#0"
                className={`btn btn-sm ${
                  record.status == "active"
                    ? "bg-danger-light"
                    : "bg-success-light"
                }`}
                onClick={() => handleShow("disable")}
              >
                {record.status == "active" ? "Deactivate" : "Activate"}
              </a>
            ) : record.status !== "expired" ? (
              <a
                href="#0"
                className={`btn btn-sm ${"bg-primary-light"}`}
                style={{ textTransform: "capitalize" }}
              >
                {record.status}
              </a>
            ) : null}
          </>
        )}
        <a
          href="#0"
          className="btn btn-sm bg-danger-light"
          onClick={() => handleShow("delete")}
        >
          <i className="fe fe-trash"></i>
        </a>
      </div>
    );
  } else {
    return (
      <div className="actions">
        {type == 0 ? (
          <>
            <a
              href="#0"
              className="btn btn-sm bg-success-light"
              onClick={() => {
                handleShow("edit");
              }}
            >
              <i className="fe fe-pencil"></i> Edit
            </a>

            <a
              href="#0"
              className={`btn btn-sm ${
                record.enabled ? "bg-danger-light" : "bg-success-light"
              }`}
              onClick={() => handleShow("disable")}
            >
              {record.enabled ? "Disable" : " Enable"}
            </a>
          </>
        ) : (
          <>
            {record.status == "inactive" || record.status == "active" ? (
              <a
                href="#0"
                className={`btn btn-sm ${
                  record.status == "active"
                    ? "bg-danger-light"
                    : "bg-success-light"
                }`}
                onClick={() => handleShow("disable")}
              >
                {record.status == "active" ? "Inactive" : " Active"}
              </a>
            ) : (
              <a
                href="#0"
                className={`btn btn-sm ${"bg-primary-light"}`}
                style={{ textTransform: "capitalize" }}
              >
                {record.status}
              </a>
            )}
          </>
        )}
        <a
          href="#0"
          className="btn btn-sm bg-danger-light"
          onClick={() => handleShow("delete")}
        >
          <i className="fe fe-trash"></i>
        </a>
      </div>
    );
  }
};
export const renderAppointment = (date, text) => {
  return (
    <>
      <span>{getFormattedDate(date)}</span>
      <span className="text-primary d-block">{`${text} - ${getNextSlot(
        text
      )}`}</span>
    </>
  );
};

export const getTextClassForStatus = (status) => {
  switch (status) {
    case "active":
      return "text-success";
    default:
      return "text-danger";
  }
};
export const getColumnSearchProps = (
  context,
  dataIndex,
  handleSearch,
  handleReset,
  recordValueToCompare
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={(node) => {
          context.searchInput = node;
        }}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  onFilter: (value, record) => {
    let childern = recordValueToCompare.split(".");
    let finalVal = record;
    childern.forEach((child) => {
      finalVal = finalVal[child];
    });
    return finalVal
      ? finalVal.toString().toLowerCase().includes(value.toLowerCase())
      : "";
  },
  onFilterDropdownVisibleChange: (visible) => {
    if (visible) {
      setTimeout(() => context.searchInput.select(), 100);
    }
  },
});
export const getColumnDropDownSearchProps = (
  context,
  items,
  dataIndex,
  handleSearch,
  handleReset,
  recordValueToCompare
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Select
        style={{ width: 120 }}
        onChange={(value) => {
          setSelectedKeys(value ? (value === "All" ? [] : [value]) : []);
          handleSearch(selectedKeys, confirm, dataIndex);
        }}
      >
        <Select.Option value="All">All</Select.Option>
        {items.map((item) => {
          return <Select.Option value={item}> {item} </Select.Option>;
        })}
      </Select>
    </div>
  ),
  onFilter: (value, record) => {
    let childern = recordValueToCompare.split(".");
    let finalVal = record;
    childern.forEach((child) => {
      finalVal = finalVal[child];
    });
    return finalVal
      ? finalVal.toString().toLowerCase().includes(value.toLowerCase())
      : "";
  },
  // onFilterDropdownVisibleChange: visible => {
  //     if (visible) {
  //         setTimeout(() => context.searchInput.select(), 100);
  //     }
  // },
});

export const getColumnFilterProps = (filterArray, recordValueToCompare) => {
  filterArray = filterArray.map((filter) => {
    return {
      text: changeCaseFirstLetter(filter),
      value: filter,
    };
  });
  return {
    filters: filterArray,
    onFilter: (value, record) => {
      let childern = recordValueToCompare.split(".");
      let finalVal = record;
      childern.forEach((child) => {
        finalVal = finalVal[child];
      });
      return finalVal
        ? finalVal.toString().toLowerCase().includes(value.toLowerCase())
        : "";
    },
  };
};

export const renderTagStatus = (status) => {
  return (
    <Tag
      style={{ padding: "10px", textTransform: "uppercase" }}
      color={status === "completed" ? "success" : "processing"}
    >
      {changeCaseFirstLetter(status)}
    </Tag>
  );
};

export const renderButton = (onButtonClick) => {
  return(
    <button
        type="button"
        onClick={() => onButtonClick()}
        className="btn btn-primary book-btn"
      >
        Book Appointment
      </button>
  )
}

export const getUpdatedColumnSearchProps = (
  context,
  dataIndex,
  handleSearch,
  handleReset,
  recordValueToCompare
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={(node) => {
          context.searchInput = node;
        }}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters, dataIndex)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  onFilterDropdownVisibleChange: (visible) => {
    if (visible) {
      setTimeout(() => context.searchInput.select(), 100);
    }
  },
});

export const getUpdatedColumnDropDownSearchProps = (
  context,
  items,
  dataIndex,
  handleSearch,
  handleReset,
  recordValueToCompare
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Select
        style={{ width: 120 }}
        onChange={(value) => {
          setSelectedKeys(value ? (value === "All" ? [] : [value]) : []);
          handleSearch(selectedKeys, confirm, dataIndex);
        }}
      >
        <Select.Option value="All">All</Select.Option>
        {items.map((item) => {
          return <Select.Option value={item}> {item} </Select.Option>;
        })}
      </Select>
    </div>
  ),
});