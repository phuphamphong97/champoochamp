import React, { Component, Fragment } from 'react';
import { Modal, Form, Input } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import Avatar from '../../../../../elements/Avatar';

class EmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      imageUrl: '',
      fileName: ''
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
    const { getAvatarInfo, isShowModal, currentTypeForm, title, form, employee, onSave, onCancel, employeeLogin } = this.props;
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
              {getFieldDecorator('id', { initialValue: employee && employee.id })}
            </Form.Item>
          }
          <Form.Item label="Họ tên">
            {getFieldDecorator('name', {
              initialValue: employee && employee.name,
              rules: [{ required: true, message: 'Vui lòng nhập họ tên!' }]
            })(<Input placeholder="Họ tên *" />)}
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
            {getFieldDecorator('avatar')(<Avatar getAvatarInfo={getAvatarInfo} />)}
          </Form.Item>
          {
            currentTypeForm === typeForm.update && employee && employee.modifiedBy &&
            <Form.Item label="Nhân viên cập nhật lần cuối">
              {getFieldDecorator('modifiedBy', { initialValue: employee.modifiedBy })(
                <Input readOnly />
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'EmployeeForm' })(EmployeeForm);