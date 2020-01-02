import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Table, Input, Button, Icon, notification } from 'antd';

import { callAPI } from '../../../../shared/utils';
import { time, typeForm } from '../../../../shared/constants';

import UnitForm from './components/UnitForm';

class UnitPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      unitList: [],
      isShowModal: false,
      title: '',
      unit: null,
      currentTypeForm: ''
    };
  }

  componentDidMount() {
    this.getAllUnits();
  }

  getAllUnits = () => {
    callAPI('Unit/GetAllUnits')
      .then(res => this.setState({ unitList: res.data }));
  }

  onShowModal = (typeForm, title, unit) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      unit
    });
  };

  onSave = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      const { currentTypeForm, unitList } = this.state;
      const { employee } = this.props;

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Unit/CreateUnit', '', 'POST', values)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                unitList.push(res.data);

                this.setState({
                  isShowModal: false,
                  unitList
                });
                form.resetFields();

                notification.info({
                  message: 'Tạo mới đơn vị tính thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Đơn vị tính đã tồn tại!',
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
                message: 'Tạo mới đơn vị tính thất bại!',
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
          unit: values,
          unitList: []
        }
        callAPI('Unit/PutUnit', '', 'PUT', data)
          .then(res => {
            if (res.data) {
              if (res.data.id > 0) {
                let lst = unitList;
                lst = unitList.filter(unit => unit.id !== res.data.id)
                lst.unshift(res.data);

                this.setState({
                  isShowModal: false,
                  unitList: lst
                });
                form.resetFields();

                notification.info({
                  message: 'Cập nhật đơn vị tính thành công!',
                  placement: 'topRight',
                  onClick: () => notification.destroy(),
                  duration: time.durationNotification
                });
              }
              else {
                notification.warning({
                  message: 'Đơn vị tính đã tồn tại!',
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
                message: 'Cập nhật đơn vị tính thất bại!',
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
    let unitList = [];
    ids.map(id => unitList.push({ id }));
    const data = {
      employee: null,
      unit: null,
      unitList
    };

    callAPI('Unit/DeleteUnitByIds', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => !ids.includes(key)),
            unitList: this.state.unitList.filter(unit => !ids.includes(unit.id))
          });

          notification.info({
            message: 'Xóa đơn vị tính thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa đơn vị tính thất bại!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
      });
  };

  onDelete = id => {
    const data = { id };

    callAPI('Unit/DeleteUnitById', '', 'DELETE', data)
      .then(res => {
        if (res.data) {
          this.setState({
            selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
            unitList: this.state.unitList.filter(unit => unit.id !== id)
          });

          notification.info({
            message: 'Xóa đơn vị tính thành công!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }
        else {
          notification.warning({
            message: 'Xóa đơn vị tính thất bại!',
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
    let { selectedRowKeys, sortedInfo, unitList, isShowModal, currentTypeForm, title, unit } = this.state;
    const { handleChange, onSelectChange, wrappedComponentRef, onShowModal, onSave, onCancel, onSelectedDelete, onDelete } = this;
    const resource = { wrappedComponentRef, isShowModal, currentTypeForm, title, unit, onSave, onCancel };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    sortedInfo = sortedInfo || {};


    const columns = [
      {
        title: 'Đơn vị tính',
        dataIndex: 'name',
        width: '20%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: '70%',
        ...this.getColumnSearchProps('createdDate'),
        sorter: (a, b) => moment(a.createdDate).unix() - moment(b.createdDate).unix(),
        sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
        render: (text, record) => (<span>{moment(record.createdDate).format('DD/MM/YYYY')}</span>),
      },
      {
        title: 'Action',
        width: '10%',
        render: (text, record) => (
          <Fragment>
            <Icon type="edit" onClick={() => onShowModal(typeForm.update, `Cập nhật đơn vị tính`, record)} />
            <Icon type="delete" onClick={() => onDelete(record.id)} />
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <Button type="primary" onClick={() => onShowModal(typeForm.create, `Tạo mới đơn vị tính`, null)}>Tạo mới</Button>
        <Button type="primary" onClick={() => onSelectedDelete(selectedRowKeys)}>Xóa</Button>
        <Table
          rowKey='id'
          rowSelection={rowSelection}
          columns={columns}
          dataSource={unitList}
          onChange={handleChange}
        />
        <UnitForm {...resource} />
      </div>
    );
  }
}

export default UnitPage;
