import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import styled from '@emotion/styled';

import { typeForm } from '../../../../../../shared/constants';
import { colors } from '../../../../../../shared/principles';
import { formatDateTime } from '../../../../../../shared/util';

import Avatar from '../../../../../elements/Avatar';

const ModifyText = styled('span')`
  color: ${colors.darkGray};
  font-size: 12px;
`;

class BrandForm extends Component {
  render() {
    const { getThumbnailBase64, thumbnailBase64, isShowModal, currentTypeForm, title, form, brand, onSave, onCancel } = this.props;
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
              {getFieldDecorator('id', { initialValue: brand && brand.id })(
                <Input placeholder="Id" />
              )}
            </Form.Item>
          }
          <Form.Item label="Tên">
            {getFieldDecorator('name', {
              initialValue: brand && brand.name,
              rules: [{ required: true, message: 'Vui lòng nhập tên!' }]
            })(<Input placeholder="Tên *" />)}
          </Form.Item>
          <Form.Item label="Quốc gia">
            {getFieldDecorator('description', { initialValue: brand && brand.country })(
              <Input placeholder="Quốc gia" />
            )}
          </Form.Item>
          <Form.Item label="Logo">
            {getFieldDecorator('thumbnail', { initialValue: brand && brand.thumbnail })(
              <Avatar entity={brand} imageUrl={thumbnailBase64} getThumbnailBase64={getThumbnailBase64} />
            )}
          </Form.Item>
          {
            currentTypeForm === typeForm.update && brand && brand.modifiedBy &&
            (
              <ModifyText>
                Cập nhật lần cuối bởi {brand.modifiedBy} lúc{' '}
                {formatDateTime(brand.modifiedDate)}.
              </ModifyText>
            )
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'BrandForm' })(BrandForm);