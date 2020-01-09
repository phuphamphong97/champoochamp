import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import { formatDateTime } from '../../../../../../shared/util';
import { ModifyText } from '../../../../styledUtils';

class SuplierForm extends Component {
  render() {
    const {
      isShowModal,
      currentTypeForm,
      title,
      form,
      suplier,
      onSave,
      onCancel
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={title}
        visible={isShowModal}
        onOk={onSave}
        onCancel={onCancel}
      >
        <Form>
          {currentTypeForm === typeForm.update && (
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('id', { initialValue: suplier && suplier.id })}
            </Form.Item>
          )}
          <Form.Item label="Tên">
            {getFieldDecorator('name', {
              initialValue: suplier && suplier.name,
              rules: [
                { required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }
              ]
            })(<Input placeholder="Tên *" />)}
          </Form.Item>
          <Form.Item label="Email">
            {getFieldDecorator('email', {
              initialValue: suplier && suplier.email
            })(<Input type="email" placeholder="Email" />)}
          </Form.Item>
          <Form.Item label="Số điện thoại">
            {getFieldDecorator('phone', {
              initialValue: suplier && suplier.phone
            })(<Input placeholder="Số điện thoại" />)}
          </Form.Item>
          <Form.Item label="Địa chỉ">
            {getFieldDecorator('address', {
              initialValue: suplier && suplier.address
            })(<Input placeholder="Địa chỉ" />)}
          </Form.Item>
          <Form.Item label="Ghi chú">
            {getFieldDecorator('description', {
              initialValue: suplier && suplier.description
            })(<Input placeholder="Ghi chú" />)}
          </Form.Item>
          {currentTypeForm === typeForm.update &&
            suplier &&
            suplier.modifiedBy && (
              <ModifyText>
                Cập nhật lần cuối bởi {suplier.modifiedBy} lúc{' '}
                {formatDateTime(suplier.modifiedDate)}.
              </ModifyText>
            )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'SuplierForm' })(SuplierForm);
