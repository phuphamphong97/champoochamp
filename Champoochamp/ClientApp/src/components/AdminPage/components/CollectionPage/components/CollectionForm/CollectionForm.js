import React, { Component } from 'react';
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

class CollectionForm extends Component {
  render() {
    const { getThumbnailBase64, thumbnailBase64, isShowModal, currentTypeForm, title, form, collection, onSave, onCancel } = this.props;
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
              {getFieldDecorator('id', { initialValue: collection && collection.id })(
                <Input placeholder="Id" />
              )}
            </Form.Item>
          }
          <Form.Item label="Tên">
            {getFieldDecorator('name', {
              initialValue: collection && collection.name,
              rules: [{ required: true, message: 'Vui lòng nhập tên!' }]
            })(<Input placeholder="Tên *" />)}
          </Form.Item>
          <Form.Item label="Ảnh">
            {getFieldDecorator('thumbnail', { initialValue: collection && collection.thumbnail })(
              <Avatar entity={collection} imagesGroup={imagesGroup.collections} imageUrl={thumbnailBase64} getThumbnailBase64={getThumbnailBase64} />
            )}
          </Form.Item>
          {
            currentTypeForm === typeForm.update && collection && collection.modifiedBy &&
            (
              <ModifyText>
                Cập nhật lần cuối bởi {collection.modifiedBy} lúc{' '}
                {formatDateTime(collection.modifiedDate)}.
              </ModifyText>
            )
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'CollectionForm' })(CollectionForm);