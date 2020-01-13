import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/util';
import { imagesGroup, time, typeForm } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

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
      thumbnailBase64: ''
    };
  }

  componentDidMount() {
    this.getAllUsers();
  }

  getAllUsers = () => {
    callAPI('User/GetAllUsers')
      .then(res => this.setState({ userList: res.data }));
  }

  getThumbnailBase64 = thumbnailBase64 => {
    this.setState({ thumbnailBase64 });
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
    const { currentTypeForm, userList, thumbnailBase64 } = this.state;
    const { employee } = this.props;
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      const data = {
        employee,
        user: values,
        thumbnailBase64,
        folderName: imagesGroup.users,
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
                  userList,
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
                  message: 'Email đã tồn tại, vui lòng nhập email khác!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
            }
            else {
              this.setState({
                isShowModal: false,
                thumbnailBase64: ''
              });
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
        callAPI('User/PutUser', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = userList;
                lst = userList.filter(user => user.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  userList: lst,
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
                  message: 'Email đã tồn tại, vui lòng nhập email khác!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
            }
            else {
              this.setState({
                isShowModal: false,
                thumbnailBase64: ''
              });
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

    callAPI('User/DeleteUserById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            userList: this.state.userList.filter(user => user.id !== id)
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
    let { selectedRowKeys, sortedInfo, userList, isShowModal, currentTypeForm, title, user, thumbnailBase64 } = this.state;
    const { handleChange, onSelectChange, wrappedComponentRef, getThumbnailBase64, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, getThumbnailBase64, isShowModal, currentTypeForm, title, user, onSave, onCancel, thumbnailBase64 };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '10%',
        ...this.getColumnSearchProps('id'),
        sorter: (a, b) => a.id.toString().localeCompare(b.id.toString()),
        sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order
      },
      {
        title: 'Ảnh',
        width: '10%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.thumbnail ? record.thumbnail : 'default.png', imagesGroup.users)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Tên khách hàng',
        dataIndex: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '20%',
        ...this.getColumnSearchProps('email'),
        sorter: (a, b) => a.email.localeCompare(b.email),
        sortOrder: sortedInfo.columnKey === 'email' && sortedInfo.order,
      },
      {
        title: 'SĐT',
        dataIndex: 'phone',
        width: '15%',
        ...this.getColumnSearchProps('phone'),
        sorter: (a, b) => a.phone.localeCompare(b.phone),
        sortOrder: sortedInfo.columnKey === 'phone' && sortedInfo.order,
      },
      {
        title: '',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật thông tin khách hàng`, record)
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
              onShowModal(typeForm.create, `Tạo mới khách hàng`, null)
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
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={userList}
          onChange={handleChange}
        />
        <UserForm {...resource} />
      </Fragment>
    );
  }
}

export default UserPage;
