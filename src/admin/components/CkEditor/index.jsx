import React, { Component, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledcEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import SidebarNav from "../sidebar";
import CustomButton from "../CustomButton";




const CkEditor = ({}) => {
  const [editorValue, setEditorValue] = useState("");
  console.log("editorValue :>> ", editorValue);
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
              }}
              onReady={(editor) => {
                // You can store the "editor" and use when it is needed.
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "65vh",
                    editor.editing.view.document.getRoot()
                  );
                });
                const toolbarContainer = document.querySelector( '.document-editor__toolbar' );

                toolbarContainer.appendChild( editor.ui.view.toolbar.element );
        
                window.editor = editor;
                // editor.ui
                //   .getEditableElement()
                //   .parentElement.append(editor.ui.view.toolbar.element);
                console.log("Editor is ready to use!", editor);
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorValue(data);
                console.log({ event, editor, data });
              }}
              onBlur={(event, editor) => {
                console.log("Blur.", editor);
              }}
              onFocus={(event, editor) => {
                console.log("Focus.", editor);
              }}
            />
            <CustomButton
              className={"patient-slot-booking-btn float-right"}
              // onClick={handleNextClick}
              text={"Update"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CkEditor;
