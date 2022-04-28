import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import toast from "react-hot-toast";
import DecoupledcEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import SidebarNav from "../sidebar";
import CustomButton from "../CustomButton";
import { fetchApi } from "../../../_utils/http-utils";
import { UPLOAD_FILE_URL } from "../../../_utils/constants";

const CkEditor = ({}) => {
  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        let configDetails = await fetchApi({
          url: "v1/configs",
          method: "GET",
        });
        if (configDetails.status === 200) {
          const editorVal = configDetails.data.find(
            (data) => data.name === "about_us"
          );
          setEditorValue(editorVal.value);
          toast.success(configDetails.message);
        } else {
          toast.error(configDetails.message);
        }
      } catch (error) {
        toast.error(error.error);
      }
    }

    fetchConfig();
  }, []);

  const handleUpdateValue = async () => {
    let body = { name: "about_us", value: editorValue };
    if (editorValue !== "") {
      try {
        const result = await fetchApi({
          url: "v1/config/update",
          method: "POST",
          body: body,
        });
        if (result.status === 200) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(error.error);
      }
    }
  };

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("file", file);
            body.append("type", 'about-us');
            // let headers = new Headers();
            // headers.append("Origin", "http://localhost:3000");
            fetch(UPLOAD_FILE_URL,
             {
              method: "post",
              body: body
              // mode: "no-cors"
              })
              .then((res) => res.json())
              .then((res) => {
                resolve({
                  default: res.data.url
                });
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      }
    };
  }
  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">About Us</h3>
              </div>
            </div>
          </div>
          <div>
            <div className="document-editor__toolbar"></div>
            <CKEditor
              editor={DecoupledcEditor}
              data={editorValue}
              config={{
                toolbarLocation: "bottom",
                removePlugins: ['CKFinderUploadAdapter', 'CKFinder', 'MediaEmbed', 'Link'],
                //, 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload'
                extraPlugins: [uploadPlugin]
              }}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                editor.editing.view.focus();
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "65vh",
                    editor.editing.view.document.getRoot()
                  );
                });
                const toolbarContainer = document.querySelector(
                  ".document-editor__toolbar"
                );

                toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                window.editor = editor;
                // editor.ui
                //   .getEditableElement()
                //   .parentElement.append(editor.ui.view.toolbar.element);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorValue(data);
              }}
              onBlur={(event, editor) => {
                editor.editing.view.focus();
              }}
              onFocus={(event, editor) => {
              }}
            />
            <CustomButton
              className={"patient-slot-booking-btn float-right"}
              onClick={() => handleUpdateValue()}
              text={"Update"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CkEditor;
