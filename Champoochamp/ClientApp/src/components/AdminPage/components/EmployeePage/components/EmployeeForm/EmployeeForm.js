import React, { Component, Fragment } from 'react';
import { Modal, Form, Input } from 'antd';
import styled from '@emotion/styled';

import { typeForm, imagesGroup } from '../../../../../../shared/constants';
import { colors } from '../../../../../../shared/principles';
import { formatDateTime } from '../../../../../../shared/util';

import Avatar from '../../../../../elements/Avatar';

const ModifyText = styled('span')`
  color: ${colors.darkGray};
  font-size: 12px;
`;

class EmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
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

  render() {
    const { getThumbnailBase64, thumbnailBase64, isShowModal, currentTypeForm, title, form, employee, onSave, onCancel, employeeLogin } = this.props;
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
              {getFieldDecorator('id', { initialValue: employee && employee.id })(
                <Input placeholder="Id" />
              )}
            </Form.Item>
          }
          <Form.Item label="Tên">
            {getFieldDecorator('name', {
              initialValue: employee && employee.name,
              rules: [{ required: true, message: 'Vui lòng nhập tên!' }]
            })(<Input placeholder="Tên *" />)}
          </Form.Item>
          <Form.Item label="Tài khoản">
            {getFieldDecorator('userName', {
              initialValue: employee && employee.userName,
              rules: [{ required: true, message: 'Vui lòng nhập tài khoản!' }]
            })(
              <Input
                disabled={currentTypeForm === typeForm.update}
                placeholder="Tài khoản *"
              />
            )}
          </Form.Item>
          {
            (currentTypeForm === typeForm.create || employeeLogin.userName === 'admin') && 
            <Fragment>
              <Form.Item label="Mật khẩu">
                {getFieldDecorator('password', {
                  initialValue: employee && employee.password,
                  rules: [
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { validator: this.validateToNextPassword }
                  ]
                })(<Input type="password" placeholder="Mật khẩu *" />)}
              </Form.Item>
              <Form.Item label="Nhập lại mật khẩu">
                {getFieldDecorator('rePassword', {
                  initialValue: employee && employee.password,
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
            </Fragment>            
          }          
          <Form.Item label="Số điện thoại">
            {getFieldDecorator('phone', { initialValue: employee && employee.phone })(
              <Input placeholder="Số điện thoại" />
            )}
          </Form.Item>
          <Form.Item label="Địa chỉ">
            {getFieldDecorator('address', { initialValue: employee && employee.address })(
              <Input placeholder="Địa chỉ" />
            )}
          </Form.Item>
          <Form.Item label="Ảnh đại diện">
            {getFieldDecorator('thumbnail', { initialValue: employee && employee.thumbnail })(
              <Avatar entity={employee} imagesGroup={imagesGroup.users} imageUrl={thumbnailBase64} getThumbnailBase64={getThumbnailBase64} />
            )}
          </Form.Item>
          {
            currentTypeForm === typeForm.update && employee && employee.modifiedBy &&
            (
              <ModifyText>
                Cập nhật lần cuối bởi {employee.modifiedBy} lúc{' '}
                {formatDateTime(employee.modifiedDate)}.
              </ModifyText>
            )
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'EmployeeForm' })(EmployeeForm);