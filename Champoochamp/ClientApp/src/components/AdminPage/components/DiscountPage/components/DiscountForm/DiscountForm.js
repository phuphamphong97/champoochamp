import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

import { typeForm } from '../../../../../../shared/constants';

class DiscountForm extends Component {
  render() {
    const { isShowModal, currentTypeForm, title, form, discount, onSave, onCancel } = this.props;
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
              {getFieldDecorator('id', { initialValue: discount && discount.id })(
                <Input placeholder="Id" />
              )}
            </Form.Item>
          }
          <Form.Item label="Tên mã giảm giá">
            {getFieldDecorator('name', { initialValue: discount && discount.name })(
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
                <Input readOnly />
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'DiscountForm' })(DiscountForm);