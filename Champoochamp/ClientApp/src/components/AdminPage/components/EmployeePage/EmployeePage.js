import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, notification } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/util';
import { imagesGroup, time, typeForm } from '../../../../shared/constants';

import EmployeeForm from './components/EmployeeForm';

class EmployeePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      employeeList: [],
      isShowModal: false,
      title: '',
      employee: null,
      currentTypeForm: '',
      fileName: '',
      imageUrl: ''
    };
  }

  componentDidMount() {
    this.getAllEmployees();
  }

  getAllEmployees = () => {
    callAPI('Employee/GetAllEmployees')
      .then(res => this.setState({ employeeList: res.data }));
  }

  getAvatarInfo = (fileName, imageUrl) => {
    this.setState({
      fileName,
      imageUrl
    });
  }

  onShowModal = (typeForm, title, employee) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      employee
    });
  };

  onSave = () => {
    const { currentTypeForm, employeeList, fileName, imageUrl } = this.state;
    const { employeeLogin } = this.props;
    const { form } = this.formRef.props;
    form.setFieldsValue({
      avatar: fileName
    });
    
    form.validateFields((err, values) => {  
      const data = {
        employeeLogin,
        employee: values,
        imageUrl,
        employeeList: []        
      }

      if (err) {
        return;
      }      

      if (currentTypeForm === typeForm.create) {
        callAPI('Employee/CreateEmployee', '', 'POST', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                employeeList.push(res.data);

                this.setState({
                  isShowModal: false,
                  employeeList
                });
                form.resetFields();

                notification.info({
                  message: 'Tạo mới nhân viên thành công!',
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
                message: 'Tạo mới nhân viên thất bại!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          });
      }
      else if (currentTypeForm === typeForm.update) {        
        callAPI('Employee/PutEmployee', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = employeeList;
                lst = employeeList.filter(employee => employee.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  employeeList: lst
                });
                form.resetFields();

                notification.info({
                  message: 'Cập nhật nhân viên thành công!',
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
                message: 'Cập nhật nhân viên thất bại!',
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
    let employeeList = [];
    ids.map(id => employeeList.push({ id }));
    const data = {
      employeeLogin: null,
      employee: null,
      employeeList
    };

    callAPI('Employee/DeleteEmployeeByIds', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => !ids.includes(key)),
            employeeList: this.state.employeeList.filter(employee => !ids.includes(employee.id))
          });

          notification.info({
            message: 'Xóa nhân viên thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa nhân viên thất bại!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
      });
  };

  onDelete = id => {
    const data = { id };

    callAPI('Employee/DeleteEmployeeById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            employeeList: this.state.employeeList.filter(employee => employee.id !== id)
          });

          notification.info({
            message: 'Xóa nhân viên thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa nhân viên thất bại!',
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
    let { selectedRowKeys, sortedInfo, employeeList, isShowModal, currentTypeForm, title, employee } = this.state;
    const { employeeLogin } = this.props;
    const { handleChange, onSelectChange, wrappedComponentRef, getAvatarInfo, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, getAvatarInfo, isShowModal, currentTypeForm, title, employee, onSave, onCancel, employeeLogin };
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
            src={getImageUrl(record.avatar ? record.avatar : 'default.png', imagesGroup.users)}
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
        title: 'Tài khoản',
        dataIndex: 'userName',
        width: '16%',
        ...this.getColumnSearchProps('userName'),
        sorter: (a, b) => a.userName.localeCompare(b.userName),
        sortOrder: sortedInfo.columnKey === 'userName' && sortedInfo.order,
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
        width: '20%',
        ...this.getColumnSearchProps('address'),
        sorter: (a, b) => a.address.localeCompare(b.address),
        sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,
      },
      {
        title: 'Action',
        width: '10%',
        render: (text, record) => (
          <Fragment>
            <Icon type="edit" onClick={() => onShowModal(typeForm.update, `Cập nhật nhân viên`, record)} />
            <Icon type="delete" onClick={() => onDelete(record.id)} />
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <Button type="primary" onClick={() => onShowModal(typeForm.create, `Tạo mới nhân viên`, null)}>Tạo mới</Button>
        <Button type="primary" onClick={() => onSelectedDelete(selectedRowKeys)}>Xóa</Button>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={employeeList}
          onChange={handleChange}
        />
        <EmployeeForm {...resource} />
      </div>
    );
  }
}

export default EmployeePage;
