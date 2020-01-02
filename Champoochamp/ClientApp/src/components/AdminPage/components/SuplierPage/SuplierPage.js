import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, notification } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/utils';
import { imagesGroup, time, typeForm } from '../../../../shared/constants';

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
      currentTypeForm: ''
    };
  }

  componentDidMount() {
    this.getAllSupliers();
  }

  getAllSupliers = () => {
    callAPI('Suplier/GetAllSupliers')
      .then(res => this.setState({ suplierList: res.data }));
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
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      const { currentTypeForm, suplierList } = this.state;
      const { employee } = this.props;

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Suplier/CreateSuplier', '', 'POST', values)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                suplierList.push(res.data);

                this.setState({
                  isShowModal: false,
                  suplierList
                });
                form.resetFields();

                notification.info({
                  message: 'Tạo mới nhà cung cấp thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Nhà cung cấp đã tồn tại!',
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
                message: 'Tạo mới nhà cung cấp thất bại!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          });
      }
      else if (currentTypeForm === typeForm.update) {
        const data = {
          employee,
          suplier: values,
          suplierList: []
        }
        callAPI('Suplier/PutSuplier', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = suplierList;
                lst = suplierList.filter(suplier => suplier.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  suplierList: lst
                });
                form.resetFields();

                notification.info({
                  message: 'Cập nhật nhà cung cấp thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Nhà cung cấp đã tồn tại!',
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
                message: 'Cập nhật nhà cung cấp thất bại!',
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
    this.setState({ isShowModal: false });
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
            message: 'Xóa nhà cung cấp thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa nhà cung cấp thất bại!',
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
            message: 'Xóa nhà cung cấp thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa nhà cung cấp thất bại!',
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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
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
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    let { selectedRowKeys, sortedInfo, suplierList, isShowModal, currentTypeForm, title, suplier } = this.state;
    const { handleChange, onSelectChange, wrappedComponentRef, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, isShowModal, currentTypeForm, title, suplier, onSave, onCancel };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'Logo',
        width: '15%',
        render: (text, record) => (
          <img
            src={imagesGroup.logos && record.logo && getImageUrl(record.logo, imagesGroup.logos)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Nhà cung cấp',
        dataIndex: 'name',
        width: '18%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '16%',
        ...this.getColumnSearchProps('email'),
        sorter: (a, b) => a.email.localeCompare(b.email),
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        width: '16%',
        ...this.getColumnSearchProps('phone'),
        sorter: (a, b) => a.phone.localeCompare(b.phone),
        sortOrder: sortedInfo.columnKey === 'phone' && sortedInfo.order,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        width: '25%',
        ...this.getColumnSearchProps('address'),
        sorter: (a, b) => a.address.localeCompare(b.address),
        sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
      },
      {
        title: 'Action',
        width: '10%',
        render: (text, record) => (
          <Fragment>
            <Icon type="edit" onClick={() => onShowModal(typeForm.update, `Cập nhật nhà cung cấp`, record)} />
            <Icon type="delete" onClick={() => onDelete(record.id)} />
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <Button type="primary" onClick={() => onShowModal(typeForm.create, `Tạo mới nhà cung cấp`, null)}>Tạo mới</Button>
        <Button type="primary" onClick={() => onSelectedDelete(selectedRowKeys)}>Xóa</Button>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={suplierList}
          onChange={handleChange}
        />
        <SuplierForm {...resource} />
      </div>
    );
  }
}

export default SuplierPage;
