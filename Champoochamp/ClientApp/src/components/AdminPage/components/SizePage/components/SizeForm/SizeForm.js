import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

import { typeForm } from '../../../../../../shared/constants';

class SizeForm extends Component {
  render() {
    const { isShowModal, currentTypeForm, title, form, size, onSave, onCancel } = this.props;
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
              {getFieldDecorator('id', { initialValue: size && size.id })}
            </Form.Item>
          }
          <Form.Item label="Kích thước">
            {getFieldDecorator('name', { initialValue: size && size.name })(
              <Input placeholder="Tên mã giảm giá" />
            )}
          </Form.Item>
          <Form.Item label="Mã giảm giá">
            {getFieldDecorator('code', {
              initialValue: discount && discount.code,
              rules: [{ required: true, message: 'Vui lòng nhập mã giảm giá!' }]
            })(<Input placeholder="Mã giảm giá *" />)}
          </Form.Item>
          <Form.Item label="Mức giảm giá (%)">
            {getFieldDecorator('rate', {
              initialValue: discount && discount.rate,
              rules: [{ required: true, message: 'Vui lòng nhập mức giảm giá!' }]
            })(<InputNumber placeholder="Mức giảm giá *" min={0} max={100} />)}
          </Form.Item>
          {
            currentTypeForm === typeForm.update && discount && discount.modifiedBy &&
            <Form.Item label="Mã nhân viên cập nhật lần cuối">
              {getFieldDecorator('modifiedBy', { initialValue: discount.modifiedBy })(
                <Input disabled />
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'SizeForm' })(SizeForm);