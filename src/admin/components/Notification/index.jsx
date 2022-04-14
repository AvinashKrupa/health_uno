import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import SidebarNav from "../sidebar";
import { fetchApi } from "../../../_utils/http-utils";
import toast from "react-hot-toast";

const Notification = () => {
 
  const [messageTitle, setMessageTitle] = useState("")   
  const [userType, setUserType] = useState(0)
  const [message, setMessage] = useState("")
  const [enableSendNotification, setEnableSendNotification] = useState(false)

  function isValidForm() {
    if (!messageTitle) {
      toast.error("Please enter message title");
      return false;
    } else if (!userType) {
      toast.error("Please select user type");
      return false;
    } else if (!message) {
      toast.error("Please enter message content");
      return false;
    }
    return true;
  }

  async function sendPushNotification(){
    
    let result;
      result = await fetchApi({
        url: "v1/admin/send/notification/users",
        method: "POST",
        body: {
            msg_title: messageTitle,
            user_type: parseInt(userType),
            user_ids: ["6241a64686fe9c004e0e4dfd"],
            msg: message
        },
      });

      if (result) {
        toast.success(result.message);
        setMessageTitle("")
        setUserType("")
        setMessage("") 
        handleClose()       
      }else{
        toast.error(result.message);
      }
  }
  function handleSendNotification(){
    if (isValidForm()) {
        setEnableSendNotification(true)
    }
  }
  function handleClose() {
    setEnableSendNotification(false)
  }

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-7 col-auto">
                <h3 className="page-title">Notification</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item active">Notification</li>
                </ul>
              </div>
              <div className="col-sm-5 col"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="row form-row">
                      <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                              <label>Message Title</label>
                              <input
                                  value={messageTitle}
                                  type="text"
                                  onChange={(e) => setMessageTitle(e.target.value)}
                                  className="form-control"
                              />
                          </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                              <label>User Type</label>
                              <select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                className="form-control"
                              >                                  
                                <option value="0">--Select--</option>
                                <option value="1">All</option>
                                <option value="2">All Patitents</option>
                                <option value="3">All Doctors</option>
                              </select>
                          </div>
                      </div>  
                    </div>
                    <div className="row form-row">                     
                      <div className="col-md-6 col-sm-6">
                          <div className="form-group">
                              <label>Message Content</label>
                              <textarea                            
                                value={message}                                
                                onChange={(e) => setMessage(e.target.value)}
                                className="form-control textarea-auto-height"
                              ></textarea>
                          </div>
                      </div>
                    </div>
                    <div className="row">
                        <div className="form-btn text-center col">
                            <button
                                type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSendNotification();
                                }}
                                className="btn btn-primary"
                            >
                                Send Notification
                            </button>
                        </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <Modal
            show={enableSendNotification}
            onHide={handleClose}
            centered
          >
            {enableSendNotification && (
              <Modal.Body className="text-center">
                <div className="form-content p-2">
                  <h4 className="modal-title">Notification</h4>
                  <p className="mb-4">{`Are you sure to send notification?`}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={sendPushNotification}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    No
                  </button>
                </div>
              </Modal.Body>
            )}
          </Modal>
          {/* Delete Modal */}
        </div>
      </div>
    </>
  )
}

export default Notification;
