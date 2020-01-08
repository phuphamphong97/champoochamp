import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, notification } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/util';
import { imagesGroup, time, typeForm } from '../../../../shared/constants';

import UserForm from './components/UserForm';

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      userList: [],
      isShowModal: false,
      title: '',
      user: null,
      currentTypeForm: '',
      fileName: '',
      imageUrl: ''
    };
  }

  componentDidMount() {
    this.getAllUsers();
  }

  getAllUsers = () => {
    callAPI('User/GetAllUsers')
      .then(res => this.setState({ userList: res.data }));
  }

  getAvatarInfo = (fileName, imageUrl) => {
    this.setState({
      fileName,
      imageUrl
    });
  }

  onShowModal = (typeForm, title, user) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      user
    });
  };

  onSave = () => {
    const { currentTypeForm, userList, fileName, imageUrl } = this.state;
    const { employee } = this.props;
    const { form } = this.formRef.props;
    form.setFieldsValue({
      avatar: fileName
    });

    form.validateFields((err, values) => {
      const data = {
        employee,
        user: values,
        imageUrl,
        userList: []
      }

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('User/CreateUser', '', 'POST', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                userList.push(res.data);

                this.setState({
                  isShowModal: false,
                  userList
                });
                form.resetFields();

                notification.info({
                  message: 'Tạo mới khách hàng thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Tài khoản đã tồn tại!',
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
                message: 'Tạo mới khách hàng thất bại!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          });
      }
      else if (currentTypeForm === typeForm.update) {
        callAPI('User/PutUser', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = userList;
                lst = userList.filter(user => user.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  userList: lst
                });
                form.resetFields();

                notification.info({
                  message: 'Cập nhật khách hàng thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Tài khoản đã tồn tại!',
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
                message: 'Cập nhật khách hàng thất bại!',
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
    let userList = [];
    ids.map(id => userList.push({ id }));
    const data = {
      employee: null,
      user: null,
      userList
    };

    callAPI('User/DeleteUserByIds', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => !ids.includes(key)),
            userList: this.state.userList.filter(user => !ids.includes(user.id))
          });

          notification.info({
            message: 'Xóa khách hàng thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa khách hàng thất bại!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
      });
  };

  onDelete = id => {
    const data = { id };

    callAPI('User/DeleteUserById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            userList: this.state.userList.filter(user => user.id !== id)
          });

          notification.info({
            message: 'Xóa khách hàng thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa khách hàng thất bại!',
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
    let { selectedRowKeys, sortedInfo, userList, isShowModal, currentTypeForm, title, user } = this.state;
    const { handleChange, onSelectChange, wrappedComponentRef, getAvatarInfo, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, getAvatarInfo, isShowModal, currentTypeForm, title, user, onSave, onCancel };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'Avatar',
        width: '10%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.avatar, imagesGroup.users)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Tên khách hàng',
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
        width: '30%',
        ...this.getColumnSearchProps('address'),
        sorter: (a, b) => a.address.localeCompare(b.address),
        sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
        render: (text, record) => (
          <span>
            {record.address ? `${record.address}, ` : ``}
            {record.address ? `${record.ward}, ` : ``}
            {record.address ? `${record.district}, ` : ``}
            {record.address ? `${record.province}` : ``}
          </span>
        ),
      },
      {
        title: 'Action',
        width: '10%',
        render: (text, record) => (
          <Fragment>
            <Icon type="edit" onClick={() => onShowModal(typeForm.update, `Cập nhật khách hàng`, record)} />
            <Icon type="delete" onClick={() => onDelete(record.id)} />
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <Button type="primary" onClick={() => onShowModal(typeForm.create, `Tạo mới khách hàng`, null)}>Tạo mới</Button>
        <Button type="primary" onClick={() => onSelectedDelete(selectedRowKeys)}>Xóa</Button>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={userList}
          onChange={handleChange}
        />
        <UserForm {...resource} />
      </div>
    );
  }
}

export default UserPage;
