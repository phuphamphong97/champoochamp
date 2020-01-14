import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI, getImageUrl } from '../../../../shared/util';
import { imagesGroup, time, typeForm, localStorageKey } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

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
      thumbnailBase64: ''
    };
  }

  componentDidMount() {
    this.getAllEmployees();
  }

  getAllEmployees = () => {
    callAPI('Employee/GetAllEmployees')
      .then(res => this.setState({ employeeList: res.data }));
  }

  getThumbnailBase64 = thumbnailBase64 => {
    this.setState({ thumbnailBase64 });
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
    const { currentTypeForm, employeeList, thumbnailBase64 } = this.state;
    const { employeeLogin, onLoginAdmin } = this.props;
    const { form } = this.formRef.props;

    
    form.validateFields((err, values) => {  
      const data = {
        employeeLogin,
        employee: values,
        thumbnailBase64,
        folderName: imagesGroup.users,
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
                  employeeList,
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
                  message: 'Tài khoản đã tồn tại, vui lòng nhập tài khoản khác!',
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
        callAPI('Employee/PutEmployee', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = employeeList;
                lst = employeeList.filter(employee => employee.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  employeeList: lst,
                  thumbnailBase64: ''
                });
                form.resetFields();

                if(res.data.id === employeeLogin.id) {
                  onLoginAdmin(res.data);

                  localStorage.setItem(localStorageKey.employeeKey, JSON.stringify(res.data));
                  localStorage.setItem(localStorageKey.timeEmployeeSessionKey, new Date().getTime());
                }

                notification.info({
                  message: 'Cập nhật thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Tài khoản đã tồn tại, vui lòng nhập tài khoản khác!',
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

    callAPI('Employee/DeleteEmployeeById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            employeeList: this.state.employeeList.filter(employee => employee.id !== id)
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
    const { employeeLogin } = this.props;
    let selectedList = selectedRowKeys;

    if (employeeLogin) {
      selectedList = selectedRowKeys.filter(key => key !== employeeLogin.id);
    }
    this.setState({ selectedRowKeys: selectedList });
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
    let { selectedRowKeys, sortedInfo, employeeList, isShowModal, currentTypeForm, title, employee, thumbnailBase64 } = this.state;
    const { employeeLogin } = this.props;
    const { handleChange, onSelectChange, wrappedComponentRef, getThumbnailBase64, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, getThumbnailBase64, isShowModal, currentTypeForm, title, employee, onSave, onCancel, employeeLogin, thumbnailBase64 };
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
        title: 'Tên',
        dataIndex: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Tài khoản',
        dataIndex: 'userName',
        width: '20%',
        ...this.getColumnSearchProps('userName'),
        sorter: (a, b) => a.userName.localeCompare(b.userName),
        sortOrder: sortedInfo.columnKey === 'userName' && sortedInfo.order,
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
                onShowModal(typeForm.update, `Cập nhật nhân viên`, record)
              }
            >
              Sửa
            </LinkButton>
            {
              this.props.employeeLogin.id && record.id === this.props.employeeLogin.id ? null : (
                <Fragment>
                  <Divider type="vertical" />
                  <LinkButton type="link" onClick={() => onDelete(record.id)}>
                    Xoá
                  </LinkButton>
                </Fragment>
              )
            }            
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
              onShowModal(typeForm.create, `Tạo mới nhân viên`, null)
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
          dataSource={employeeList}
          onChange={handleChange}
        />
        <EmployeeForm {...resource} />
      </Fragment>
    );
  }
}

export default EmployeePage;
