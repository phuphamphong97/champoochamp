import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import styled from '@emotion/styled';

import { typeForm } from '../../../../../../shared/constants';
import { colors } from '../../../../../../shared/principles';
import { formatDateTime } from '../../../../../../shared/util';
import { cities, districts, wards } from '../../../../../../shared/address';

import Avatar from '../../../../../elements/Avatar';

const ModifyText = styled('span')`
  color: ${colors.darkGray};
  font-size: 12px;
`;

const { Option } = Select;

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      districtsData: [],
      wardsData: []
    };
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['rePassword'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu không trùng khớp!');
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleCityChange = value => {
    this.props.form.setFieldsValue({
      district: undefined,
      ward: undefined
    });

    this.setState({
      districtsData: districts[value],
      wardsData: []
    });
  };

  handleDistrictChange = value => {
    this.props.form.setFieldsValue({
      ward: undefined
    });

    this.setState({
      wardsData: wards[value]
    });
  };

  render() {
    const { districtsData, wardsData } = this.state;
    const { getThumbnailBase64, thumbnailBase64, isShowModal, currentTypeForm, title, form, user, onSave, onCancel } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={title}
        visible={isShowModal}
        onOk={onSave}
        onCancel={onCancel}
      >
        <Form>
          {
            currentTypeForm === typeForm.update &&
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('id', { initialValue: user && user.id })}
            </Form.Item>
          }
          <Form.Item label="Tên">
            {getFieldDecorator('name', {
              initialValue: user && user.name,
              rules: [{ required: true, message: 'Vui lòng nhập tên!' }]
            })(<Input placeholder="Tên *" />)}
          </Form.Item>
          <Form.Item label="Email">
            {getFieldDecorator('email', {
              initialValue: user && user.email,
              rules: [{ required: true, message: 'Vui lòng nhập email!' }]
            })(
              <Input
                disabled={currentTypeForm === typeForm.update}
                placeholder="Email *"
              />
            )}
          </Form.Item>
          <Form.Item label="Mật khẩu">
            {getFieldDecorator('password', {
              initialValue: user && user.password,
              rules: [
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { validator: this.validateToNextPassword }
              ]
            })(<Input type="password" placeholder="Mật khẩu *" />)}
          </Form.Item>
          <Form.Item label="Nhập lại mật khẩu">
            {getFieldDecorator('rePassword', {
              initialValue: user && user.password,
              rules: [
                { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                { validator: this.compareToFirstPassword }
              ]
            })(
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu *"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </Form.Item>
          <Form.Item label="Số điện thoại">
            {getFieldDecorator('phone', {
              initialValue: user && user.phone,
              rules: [{ required: true, message: 'Vui lòng nhập số điện thoại!' }]
            })(
              <Input placeholder="Số điện thoại *" />
            )}
          </Form.Item>
          <Form.Item label="Tỉnh / thành phố">
            {getFieldDecorator('province', {
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn tỉnh / thành phố!'
                }
              ],
              onChange: this.handleCityChange
            })(
              <Select showSearch placeholder="Tỉnh / thành phố *">
                {cities.map(city => (
                  <Option key={city}>{city}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Quận / huyện">
            {getFieldDecorator('district', {
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn quận / huyện!'
                }
              ],
              onChange: this.handleDistrictChange
            })(
              <Select showSearch placeholder="Quận / huyện *">
                {districtsData.map(district => (
                  <Option key={district}>{district}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Phường / xã">
            {getFieldDecorator('ward', {
              rules: [
                {
                  required: true,
                  message: 'Vui lòng chọn phường / xã!'
                }
              ]
            })(
              <Select showSearch placeholder="Phường / xã *">
                {wardsData.map(ward => (
                  <Option key={ward}>{ward}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Số nhà, đường">
            {getFieldDecorator('address', {
              rules: [{ message: 'Vui lòng nhập số nhà, đường!' }]
            })(<Input placeholder="Số nhà, đường" />)}
          </Form.Item>
          <Form.Item label="Ảnh đại diện">
            {getFieldDecorator('thumbnail', { initialValue: user && user.thumbnail })(
              <Avatar entity={user} imageUrl={thumbnailBase64} getThumbnailBase64={getThumbnailBase64} />
            )}
          </Form.Item>
          {
            currentTypeForm === typeForm.update && user && user.modifiedBy &&
            (
              <ModifyText>
                Cập nhật lần cuối bởi {user.modifiedBy} lúc{' '}
                {formatDateTime(user.modifiedDate)}.
              </ModifyText>
            )
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'UserForm' })(UserForm);