import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
import { getImageUrl } from '../../../shared/util';
import { imagesGroup } from '../../../shared/constants';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      loading: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.imageUrl !== prevState.imageUrl) {
      return {
        imageUrl: nextProps.imageUrl
      };
    }

    return null;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }, () => this.props.getThumbnailBase64(imageUrl)),
      );
    }
  };

  uploadButton = () => {
    return (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
  }

  render() {
    const { imageUrl } = this.state;
    const { entity } = this.props;

    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {
          imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :
            entity ? <img src={getImageUrl(entity.thumbnail, imagesGroup.users)} alt="avatar" style={{ width: '100%' }} /> : this.uploadButton()
        }
      </Upload>
    );
  }
}

export default Avatar;