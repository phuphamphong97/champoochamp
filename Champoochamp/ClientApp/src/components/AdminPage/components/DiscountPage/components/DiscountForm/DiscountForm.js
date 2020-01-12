import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

import { typeForm } from '../../../../../../shared/constants';
import { formatDateTime } from '../../../../../../shared/util';
import { ModifyText } from '../../../../styledUtils';

class DiscountForm extends Component {
  render() {
    const {
      isShowModal,
      currentTypeForm,
      title,
      form,
      discount,
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
              {getFieldDecorator('id', {
                initialValue: discount && discount.id
              })(<Input placeholder="Id" />)}
            </Form.Item>
          )}
          <Form.Item label="Tên">
            {getFieldDecorator('name', {
              initialValue: discount && discount.name
            })(<Input placeholder="Tên" />)}
          </Form.Item>
          <Form.Item label="Mã code">
            {getFieldDecorator('code', {
              initialValue: discount && discount.code,
              rules: [{ required: true, message: 'Vui lòng nhập mã giảm giá!' }]
            })(<Input placeholder="Mã code *" />)}
          </Form.Item>
          <Form.Item label="Mức giảm (%)">
            {getFieldDecorator('rate', {
              initialValue: (discount && discount.rate) || 10,
              rules: [
                { required: true, message: 'Vui lòng nhập mức giảm giá!' }
              ]
            })(
              <InputNumber
                placeholder="Mức giảm *"
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />
            )}
          </Form.Item>
          {currentTypeForm === typeForm.update &&
            discount &&
            discount.modifiedBy && (
              <ModifyText>
                Cập nhật lần cuối bởi {discount.modifiedBy} lúc{' '}
                {formatDateTime(discount.modifiedDate)}.
              </ModifyText>
            )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'DiscountForm' })(DiscountForm);
