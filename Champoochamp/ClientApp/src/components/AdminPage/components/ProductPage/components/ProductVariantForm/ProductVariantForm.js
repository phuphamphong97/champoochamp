import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Upload, Icon, Modal, Form, Input, Select } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import { callAPI, formatDateTime } from '../../../../../../shared/util';
import { ModifyText } from '../../../../styledUtils';

const { Option } = Select;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class ProductVariantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorList: [],
      sizeList: [],
      previewVisible: false,
      previewImage: '',
      fileList: []
    };
  }

  componentDidMount() {
    axios.all([
      callAPI(`Color/GetAllColors`),
      callAPI(`Size/GetAllSizes`),
    ]).then(axios.spread((...res) => {
      this.setState({
        colorList: res[0].data,
        sizeList: res[1].data,
      });
    }));
  }

  handleColorChange = (value, e) => {
    const { form } = this.props;
    const sizeId = form.getFieldValue('sizeId');

    form.setFieldsValue({
      id: value + sizeId,
      colorId: value,
      colorName: e.props.children
    });   
  };

  handleSizeChange = (value, e) => {
    const { form } = this.props;
    const colorId = form.getFieldValue('colorId');

    form.setFieldsValue({
      id: colorId + value,
      sizeId: value,
      sizeName: e.props.children
    });   
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });

    this.props.form.setFieldsValue({
      imageUrlList: fileList
    }); 
  };

  render() {
    const { colorList, sizeList, previewVisible, previewImage, fileList } = this.state;
    const {
      isShowPVModal,
      currentTypePVForm,
      pvTitle,
      form,
      productVariant,
      onPVSave,
      onPVCancel
    } = this.props;
    const { getFieldDecorator } = form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <Modal
        title={pvTitle}
        visible={isShowPVModal}
        onOk={onPVSave}
        onCancel={onPVCancel}
      >
        <Form>
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('id', {
              initialValue: productVariant && productVariant.id
            })(<Input placeholder="Id" />)}
          </Form.Item>
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('colorId', {
              initialValue: productVariant ? productVariant.colorId : undefined
            })(<Input />)}
          </Form.Item>
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('sizeId', {
              initialValue: productVariant ? productVariant.sizeId : undefined
            })(<Input />)}
          </Form.Item>
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('imageUrlList')(<Input />)}
          </Form.Item>
          <Form.Item label="Màu">
            {getFieldDecorator('colorName', {
              initialValue: productVariant && productVariant.size ? productVariant.color.name : undefined,
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn màu!'
                }
              ],
              onChange: this.handleColorChange
            })(
              <Select showSearch placeholder="Màu *">
                {colorList.map(color => (
                  <Option key={color.id}>{color.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Kích thước">
            {getFieldDecorator('sizeName', {
              initialValue: productVariant && productVariant.size ? productVariant.size.name : undefined,
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn kích thước!'
                }
              ],
              onChange: this.handleSizeChange
            })(
              <Select showSearch placeholder="Kích thước *">
                {sizeList.map(size => (
                  <Option key={size.id}>{size.name}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Số lượng">
            {getFieldDecorator('quantity', {
              initialValue: productVariant && productVariant.quantity,
              rules: [{ required: true, message: 'Vui lòng nhập số lượng!' }]
            })(<Input placeholder="Số lượng *" />)}
          </Form.Item>

          <Fragment>
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={fileList}
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Fragment>

          {currentTypePVForm === typeForm.update &&
            productVariant &&
            productVariant.modifiedBy && (
              <ModifyText>
                Cập nhật lần cuối bởi {productVariant.modifiedBy} lúc{' '}
                {formatDateTime(productVariant.modifiedDate)}.
              </ModifyText>
            )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'ProductVariantForm' })(ProductVariantForm);
