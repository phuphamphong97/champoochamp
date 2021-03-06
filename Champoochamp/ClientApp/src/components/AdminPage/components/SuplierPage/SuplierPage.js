﻿import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/util';
import { imagesGroup, time, typeForm } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

import SuplierForm from './components/SuplierForm';

class SuplierPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      suplierList: [],
      isShowModal: false,
      title: '',
      suplier: null,
      currentTypeForm: '',
      thumbnailBase64: ''
    };
  }

  componentDidMount() {
    this.getAllSupliers();
  }

  getAllSupliers = () => {
    callAPI('Suplier/GetAllSupliers').then(res =>
      this.setState({ suplierList: res.data ? res.data : [] })
    );
  };

  getThumbnailBase64 = thumbnailBase64 => {
    this.setState({ thumbnailBase64 });
  }

  onShowModal = (typeForm, title, suplier) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      suplier
    });
  };

  onSave = () => {
    const { currentTypeForm, suplierList, thumbnailBase64 } = this.state;
    const { employee } = this.props;
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      const data = {
        employee,
        suplier: values,
        thumbnailBase64,
        folderName: imagesGroup.logos,
        suplierList: []
      }

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Suplier/CreateSuplier', '', 'POST', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                suplierList.push(res.data);

                this.setState({
                  isShowModal: false,
                  suplierList,
                  thumbnailBase64: ''
                });
                form.resetFields();

                notification.info({
                  message: 'Tạo mới thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Nhà cung cấp đã tồn tại, vui lòng nhập nhà cung cấp khác!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
            }
            else {
              this.setState({ isShowModal: false });
              form.resetFields();

              notification.warning({
                message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          });
      }
      else if (currentTypeForm === typeForm.update) {
        callAPI('Suplier/PutSuplier', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = suplierList;
                lst = suplierList.filter(suplier => suplier.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  suplierList: lst,
                  thumbnailBase64: ''
                });
                form.resetFields();

                notification.info({
                  message: 'Cập nhật thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Nhà cung cấp đã tồn tại, vui lòng nhập nhà cung cấp khác!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
            }
            else {
              this.setState({ isShowModal: false });
              form.resetFields();

              notification.warning({
                message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          });
      }
    });
  };

  onCancel = () => {
    this.setState({
      isShowModal: false,
      thumbnailBase64: ''
    });
    this.formRef.props.form.resetFields();
  };

  onSelectedDelete = ids => {
    let suplierList = [];
    ids.map(id => suplierList.push({ id }));
    const data = {
      employee: null,
      suplier: null,
      suplierList
    };

    callAPI('Suplier/DeleteSuplierByIds', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => !ids.includes(key)),
            suplierList: this.state.suplierList.filter(suplier => !ids.includes(suplier.id))
          });

          notification.info({
            message: 'Xóa thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
      });
  };

  onDelete = id => {
    const data = { id };

    callAPI('Suplier/DeleteSuplierById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            suplierList: this.state.suplierList.filter(suplier => suplier.id !== id)
          });

          notification.info({
            message: 'Xóa thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
      });
  };

  wrappedComponentRef = formRef => {
    this.formRef = formRef;
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter
    });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => text
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    let { selectedRowKeys, sortedInfo, suplierList, isShowModal, currentTypeForm, title, suplier, thumbnailBase64 } = this.state;
    const { handleChange, onSelectChange, wrappedComponentRef, getThumbnailBase64, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, getThumbnailBase64, isShowModal, currentTypeForm, title, suplier, onSave, onCancel, thumbnailBase64 };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange
    };
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
        ...this.getColumnSearchProps('id'),
        sorter: (a, b) => a.id.toString().localeCompare(b.id),
        sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order
      },
      {
        title: 'Logo',
        width: '10%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.thumbnail ? record.thumbnail : 'default.png', imagesGroup.logos)}
            alt=""
            style={{ width: '50px' }}
          />
        )
      },
      {
        title: 'Tên',
        dataIndex: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '20%',
        ...this.getColumnSearchProps('email'),
        sorter: (a, b) => a.email.localeCompare(b.email),
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        width: '15%',
        ...this.getColumnSearchProps('phone'),
        sorter: (a, b) => a.phone.localeCompare(b.phone),
        sortOrder: sortedInfo.columnKey === 'phone' && sortedInfo.order
      },
      {
        title: '',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật nhà cung cấp`, record)
              }
            >
              Sửa
            </LinkButton>
            <Divider type="vertical" />
            <LinkButton type="link" onClick={() => onDelete(record.id)}>
              Xoá
            </LinkButton>
          </Fragment>
        )
      },
    ];

    return (
      <Fragment>
        <ButtonsWrapper>
          <ActionButton
            type="primary"
            onClick={() =>
              onShowModal(typeForm.create, `Tạo mới nhà cung cấp`, null)
            }
          >
            Tạo mới
          </ActionButton>
          {selectedRowKeys.length > 0 && (
            <ActionButton
              type="danger"
              onClick={() => onSelectedDelete(selectedRowKeys)}
            >
              Xóa
            </ActionButton>
          )}
        </ButtonsWrapper>

        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={suplierList}
          onChange={handleChange}
        />
        <SuplierForm {...resource} />
      </Fragment>
    );
  }
}

export default SuplierPage;
