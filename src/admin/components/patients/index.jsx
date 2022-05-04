import React, { Component } from "react";
import { Table } from "ant-table-extensions";
import { CSVLink } from "react-csv";
import moment from "moment";
import { Link } from "react-router-dom";
import SidebarNav from "../sidebar";
import {
  itemRender,
  onShowSizeChange,
} from "../../components/paginationfunction";
import { fetchApi } from "../../../_utils/http-utils";
import { Button, Modal } from "react-bootstrap";
import {
  getColumnFilterProps,
  getColumnSearchProps,
  renderDate,
  renderDropDown,
  renderName,
  renderText,
  sorterDate,
  sorterNumber,
  sorterText,
  renderButton,
  renderDeleteButton,
} from "../../../_utils/data-table-utils";
import toast from "react-hot-toast";

const patientStatus = ["active", "inactive", "suspended", "banned"];

class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      data: [],
      dataFromList: [],
      showMenu: {},
      searchText: "",
      searchedColumn: "",
      isConfirmation: false,
      selectedRecord: null,
      loadingCsv: false,
      pagination: {
        page: parseInt(props.match.params.page) ?? 1,
        limit: 10,
      },
      loading: false,
      page: parseInt(props.match.params.page) ?? 1
    }
    this.csvLinkEl = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        pagination: {
          page: parseInt(this.props.match.params.page),
          limit: 10
        }
      })
      const { pagination } = this.state;
      this.fetchPatientsList(pagination);
    }
  }

  async componentDidMount() {
    const { pagination } = this.state;
    this.fetchPatientsList(pagination,true);
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  fetchPatientsList = async (params = {}, changeRoute = false) => {
    this.setState({ loading: true });
    const body = {
      ...params,
    };
    let patients = await fetchApi({ 
      url: "v2/patients", 
      method: "POST",
      body: body,
    });
    let patientsData = patients?.data?.docs;
    this.setState({
      data: patientsData,
      loading: false,
      total: patients.data.total,
      pagination: {
        page: parseInt(patients.data.page),
        limit: patients.data.limit,
        total: patients.data.total,
      },
    });
    if(changeRoute){
      this.props.history.push("/patient-list/"+this.state.pagination.page)
    }
  };

  async deletePatient(record) {
    if (record.user_id && record.user_id.mobile_number)
      try {
        let result = await fetchApi({
          url: "v1/admin/deletePatient",
          method: "POST",
          body: { mobile_number: record.user_id.mobile_number },
        });
        if (result) {
          toast.success(result.message);
          this.fetchPatientsList();
        }
        this.setState({ isConfirmation: false });
      } catch (e) {
        this.setState({ isConfirmation: false });
      }
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  async handleItemClick(record, dropdownItem) {
    let index = this.state.data.indexOf(record);
    let data = this.state.data;
    data[index].status = dropdownItem;
    this.setState({ showMenu: { [record._id]: false } });
    try {
      let result = await fetchApi({
        url: "v1/patient/changeStatus",
        method: "POST",
        body: { patient_id: record._id, status: dropdownItem },
      });
      if (result) {
        toast.success(result.message);
        this.setState({ data: data });
        this.fetchPatientsList();
      }
    } catch (e) {}
  }

  handleDropdownClick(record) {
    let isShown = this.state.showMenu[record._id];
    this.setState({ showMenu: { [record._id]: !isShown } });
  }
  handleBookAppointment(record) {
    localStorage.setItem("SELECTED_PATIENT_ID", record._id);
    this.props.history.push("/patient/topConsultants");
  }

  showDropDownMenu(record) {
    return this.state.showMenu[record._id];
  }

  handleDataChange = (pagination, filters, sorter, extra) => {
    this.setState({
      searchStatus: filters.status,
    });
    const obj = {
      sort_key: sorter.field,
      sort_order: sorter.order,
      page: pagination.current,
      limit: pagination.pageSize,
      filter: {
        name: this.state.searchText,
        mobile_number: this.state.searchMobile,
        status: filters.status
      },
    };
    this.fetchPatientsList(obj,true);
  };

  
  handleExportData = async (event, done) => {
    const { searchStatus,filters } = this.state;
    this.setState({
      loadingCsv: true,
    });
    const obj = {
      pagination: {
        page: null,
        limit: null,
      },
      filter: {
        ...filters,
        status: searchStatus,
      },
    };
    const body = {
      ...obj,
    };
    let patients = await fetchApi({
      url: "v2/patients",
      method: "POST",
      body: body,
    });
    if (patients.status == 200) {
      if (patients?.data?.docs?.length > 0) {
        let finalData = [];
        patients?.data?.docs.forEach((element) => {
          let covid_vaccinated = '';
          let allergy_to_meds = '';
          let past_surgeries = '';
          let diagnosed_with_covid = '';
          let hypertensive = '';
          let diabetic = '';
          element?.med_cond.map( (item) => {            
            if(item?.name=='covid_vaccinated'){
              covid_vaccinated = item?.selected? 'Yes'+(item?.desc? ', '+item?.desc: ''): 'No';
              covid_vaccinated += ', '+ item?.meta?.map( (meta) => {
                return meta?.desc
              })
            }
            if(item?.name=='allergy_to_meds'){
              allergy_to_meds = item?.selected? 'Yes'+(item?.desc? ', '+item?.desc: ''): 'No'
            }
            if(item?.name=='past_surgeries'){
              past_surgeries = item?.selected? 'Yes'+(item?.desc? ', '+item?.desc: ''): 'No'
            }
            if(item?.name=='diagnosed_with_covid'){
              diagnosed_with_covid = item?.selected? 'Yes'+(item?.desc? ', '+item?.desc: ''): 'No'
            }
            if(item?.name=='hypertensive'){
              hypertensive = item?.selected? 'Yes'+(item?.desc? ', '+item?.desc: ''): 'No'
            }
            if(item?.name=='diabetic'){
              diabetic = item?.selected? 'Yes'+(item?.desc? ', '+item?.desc: ''): 'No'
            }          
          })

          const dataObj = {
            id: element?.huno_id,
            name: `${element?.user_id?.first_name + " " + element?.user_id?.last_name}`,
            relation: element?.relation || "",
            relative_name: element?.relative_name || "",
            height: element?.height || "",
            weight: element?.weight || "",
            mobile_number: `${element?.user_id?.country_code} ${element?.user_id?.mobile_number}`,
            email: element?.user_id?.email || "",
            address: element?.address?.line1+' '+element?.address?.line2+', '+element?.address.city+', '+element?.address?.state+', '+element?.address?.country,
            diabetic: diabetic,
            hypertensive: hypertensive,
            covid: diagnosed_with_covid,
            surgery: past_surgeries,
            medications: allergy_to_meds,
            vaccinated: covid_vaccinated,
            other: element?.other_med_cond,
            created_at: moment(element?.created_at).format("DD/MM/YYYY") || "",
            updated_at: moment(element?.updated_at).format("DD/MM/YYYY") || "",            
            account_status: element.status || "",
          };
          finalData.push(dataObj);
        });
        this.setState(
          {
            dataFromList: finalData,
            loadingCsv: false,
          },
          () => {
            setTimeout(() => {
              this.csvLinkEl.current.link.click();
            });
          }
        );
      } else {
        this.setState(
          {
            loadingCsv: false,
          },
          () => toast.success("No data found")
        );
      }
    }
  };

  render() {

    const { data, dataFromList, loadingCsv, exportingData } = this.state;

    const columns = [
      {
        title: "Patient Name",
        render: (text, record) => renderName(record, "", "", true),
        sorter: (a, b) =>
          sorterText(a.user_id.first_name, b.user_id.first_name),
        ...getColumnSearchProps(
          this,
          "Patient",
          this.handleSearch,
          this.handleReset,
          "user_id.first_name"
        ),
      },
      {
        title: "Height (Feet)",
        dataIndex: "height",
        sorter: (a, b) => sorterText(a.height, b.height),
      },
      {
        title: "Weight (Kg)",
        dataIndex: "weight",
        sorter: (a, b) => sorterNumber(a.weight, b.weight),
      },
      {
        title: "Mobile Number",
        render: (text, record) => renderText(record.user_id.mobile_number),
        sorter: (a, b) =>
          sorterText(a.user_id.mobile_number, b.user_id.mobile_number),
        ...getColumnSearchProps(
          this,
          "Mobile Number",
          this.handleSearch,
          this.handleReset,
          "user_id.mobile_number"
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (text, record) => <span>{record.user_id.email}</span>,
      },
      {
        title: "Created At",
        dataIndex: "created_at",
        render: (text) => renderDate(text),
        sorter: (a, b) => sorterDate(a.created_at, b.created_at),
      },
      {
        title: "Updated At",
        dataIndex: "updated_at",
        render: (text) => renderDate(text),
        sorter: (a, b) => sorterDate(a.updated_at, b.updated_at),
      },
      {
        title: "Created by",
        dataIndex: "created_by",
        render: (text, record) => renderName(record.created_by),
      },
      {
        title: "Updated by",
        dataIndex: "updated_by",
        render: (text, record) => renderName(record.updated_by),
      },
      {
        title: "Account Status",
        dataIndex: "status",
        key: "status",
        render: (text) => renderText(text),
        sorter: (a, b) => sorterText(a.status, b.status),
        ...getColumnFilterProps(patientStatus, "status"),
      },
      {
        title: "Actions",
        render: (text, record) => {
          return (
            <>
              <div>
                {renderDropDown(
                  "Change Status",
                  patientStatus.filter((item) => item !== record.status),
                  (elem, index) => this.handleItemClick(record, elem),
                  () => this.handleDropdownClick(record),
                  this.showDropDownMenu(record)
                )}
                {renderButton(() => this.handleBookAppointment(record))}

                {record.appointment_stats &&
                  record.appointment_stats.completed < 1 &&
                  renderDeleteButton(() => {
                    this.setState({
                      isConfirmation: true,
                      selectedRecord: record,
                    });
                  })}
              </div>
            </>
          );
        },
      },
    ];
        
    const headers = [
      { label: "HealthUno ID", key: "id" }, 	
      { label: "Patient Name", key: "name" },	
      { label: "Relation", key: "relation" },	
      { label: "Relative Name", key: "relative_name" },	
      { label: "Height (Feet)", key: "height" },	
      { label: "Weight (Kg)", key: "weight" },	
      { label: "Email", key: "email" },	
      { label: "Mobile Number", key: "mobile_number" },	
      { label: "Address", key: "address" },	
      { label: "Are you Diabetic?", key: "diabetic" },	
      { label: "Are you Hypertensive?", key: "hypertensive" },	
      { label: "Have you been diagnosed with Covid?", key: "covid" },	
      { label: "Any past surgery?", key: "surgery" },	
      { label: "Any allergies to medications?", key: "medications" },	
      { label: "Have you been vaccinated against Covid?", key: "vaccinated" },	
      { label: "Other medical conditions", key: "other" },	
      { label: "Created At", key: "created_at" },	
      { label: "Updated At", key: "updated_at" },	
      { label: "Account Status", key: "account_status" },
    ]; 

    return (
      <>
        <SidebarNav />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <h3 className="page-title">List of Patient</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/admin">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="#0">Users</Link>
                    </li>
                    <li className="breadcrumb-item active">Patient</li>
                  </ul>
                </div>
              </div>
            </div>

            <Modal
              show={this.state.isConfirmation}
              onHide={this.handleClose}
              centered
            >
              <Modal.Body>
                <div className="form-content p-2">
                  <h4 className="modal-title">Delete</h4>
                  <p className="mb-4">{`Are you sure want to delete this user permanently?`}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      this.deletePatient(this.state.selectedRecord);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({ isConfirmation: false });
                    }}
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    No
                  </button>
                </div>
              </Modal.Body>
            </Modal>

            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">   
                      <Button onClick={() => this.handleExportData()}>
                        {loadingCsv ? "Loading csv..." : "Export to CSV"}
                      </Button>
                      <CSVLink
                        data={dataFromList}
                        filename={"patients-data.csv"}
                        headers={headers}
                        ref={this.csvLinkEl}
                      ></CSVLink> 
                    
                      <button
                        type="primary"
                        className="btn btn-primary float-right"
                        onClick={() =>
                          this.props.history.push("/patient-registration")
                        }
                      >
                        Add Patient
                      </button>

                      <Table
                        className="table-striped"
                        style={{ overflowX: "auto" }}
                        columns={columns}
                        onChange={this.handleDataChange}
                        loading={this.state.loading}
                        // bordered
                        dataSource={data}
                        rowKey={(record) => record._id}
                        showSizeChanger={true}
                        pagination={{
                          current: parseInt(this.props.match.params.page) ?? 1,
                          total:
                            this.state.total >= 0
                              ? this.state.total
                              : data.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                          position: ["topRight", "bottomRight"],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Patients;
