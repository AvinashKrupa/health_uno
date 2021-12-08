import 'rc-cropping/assets/index.css';
import CropViewer from 'rc-cropping';
import React, { Component } from 'react';
// import { API } from '../api/config/APIController';
import axios from 'axios';
// import Constants from '../constants';
import { Image } from 'react-bootstrap';
import uploadCamera from '../assets/images/uploadCamera.png';
import { Modal } from 'antd';
import 'antd/dist/antd.css';

class UploadImage extends Component {
  beforeUpload(file) {
    const cropper = this.cropper;
    return cropper.selectImage(file).then(image => {
      return image;
    });
  }

  onChange = (Blob) => {
    this.uploadProfileImage(Blob)
  }

  uploadProfileImage(file) {
    let photo = file;
    let bodyFormData = new FormData();
    if (photo !== undefined) {
      bodyFormData.append('file', file);
    }
    bodyFormData.append('type', 'profile');
    this.uploadImageWithData("https://dev.healthuno.com:6002/v1/fileUpload", bodyFormData)
      .then(response => {
        console.log('response: ', response);
      })
      .catch(error => {
        console.log('error: ', error);
      })
  }
  uploadImageWithData(endPoint, formData) {
    console.log('endPoint :>> ', endPoint);
    return new Promise(async (resolve, reject) => {
      axios({
        method: 'post',
        url: endPoint,
        data: formData,
        headers: { 'Content-Type': undefined, }
      })
        .then(response => {
          console.log('response :>> ', response);
          this.props.getImage(response.data.data.url)
          resolve(response.data);
        }).catch(err => {
          console.log('err :>> ', err);
          reject(err);
        });
    });
  }


  render() {
    return (<div>
      <CropViewer
        resetPreviewAfterSelectImage={true}
        onChange={this.onChange}        
        getSpinContent={() => <span></span>}
        renderModal={() => <Modal />}
        circle
        locale="en-US"
        fileType="image/jpeg"
        showSelected={false}
        resetPreviewAfterSelectImage={true}
        accept="image/gif,image/jpeg,image/png,image/bmp,image/x-png,image/pjpeg"
      >
        {console.log('uploadCamera :>> ', uploadCamera)}
          <Image src={uploadCamera} className={this.props?.className ? this.props?.className : 'fa-camera '} >
              </Image>
              </CropViewer>
    </div>);
  }
}

export default UploadImage;