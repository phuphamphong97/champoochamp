import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI, formatDateTime } from '../../../../shared/util';
import { time, typeForm } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

import ColorForm from './components/ColorForm';

class ColorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      colorList: [],
      isShowModal: false,
      title: '',
      color: null,
      currentTypeForm: ''
    };
  }

  componentDidMount() {
    this.getAllColors();
  }

  getAllColors = () => {
    callAPI('Color/GetAllColors').then(res =>
      this.setState({ colorList: res.data ? res.data : [] })
    );
  };

  onShowModal = (typeForm, title, color) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      color
    });
  };

  onSave = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      const { currentTypeForm, colorList } = this.state;
      const { employee } = this.props;

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Color/CreateColor', '', 'POST', values).then(res => {
          if (res.data) {
            if (res.data.id > 0) {
              colorList.push(res.data);

              this.setState({
                isShowModal: false,
                colorList
              });
              form.resetFields();

              notification.info({
                message: 'Tạo mới thành công!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            } else {
              notification.warning({
                message: 'Mã màu đã tồn tại!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          } else {
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
      } else if (currentTypeForm === typeForm.update) {
        const data = {
          employee,
          color: values,
          colorList: []
        };
        callAPI('Color/PutColor', '', 'PUT', data).then(res => {
          if (res.data) {
            if (res.data.id > 0) {
              let lst = colorList;
              lst = colorList.filter(
                color => color.id !== res.data.id
              );
              lst.unshift(res.data);

              this.setState({
                isShowModal: false,
                colorList: lst
              });
              form.resetFields();

              notification.info({
                message: 'Cập nhật thành công!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            } else {
              notification.warning({
                message: 'Mã màu đã tồn tại!',
                placement: 'topRight',
                onClick: () => notification.destroy(),
                duration: time.durationNotification
              });
            }
          } else {
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
    this.setState({ isShowModal: false });
    this.formRef.props.form.resetFields();
  };

  onSelectedDelete = ids => {
    let colorList = [];
    ids.map(id => colorList.push({ id }));
    const data = {
      employee: null,
      color: null,
      colorList
    };

    callAPI('Color/DeleteColorByIds', '', 'DELETE', data).then(res => {
      if (res.data) {
        this.setState({
          selectedRowKeys: this.state.selectedRowKeys.filter(
            key => !ids.includes(key)
          ),
          colorList: this.state.colorList.filter(
            color => !ids.includes(color.id)
          )
        });

        notification.info({
          message: 'Xóa thành công!',
          placement: 'topRight',
          onClick: () => notification.destroy(),
          duration: time.durationNotification
        });
      } else {
        notification.error({
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

    callAPI('Color/DeleteColorById', '', 'DELETE', data).then(res => {
      if (res.data) {
        this.setState({
          selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
          colorList: this.state.colorList.filter(
            color => color.id !== id
          )
        });

        notification.info({
          message: 'Xóa thành công!',
          placement: 'topRight',
          onClick: () => notification.destroy(),
          duration: time.durationNotification
        });
      } else {
        notification.error({
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
    let {
      selectedRowKeys,
      sortedInfo,
      colorList,
      isShowModal,
      currentTypeForm,
      title,
      color
    } = this.state;
    const {
      handleChange,
      onSelectChange,
      wrappedComponentRef,
      onShowModal,
      onSave,
      onCancel,
      onSelectedDelete,
      onDelete
    } = this;
    const resource = {
      wrappedComponentRef,
      isShowModal,
      currentTypeForm,
      title,
      color,
      onSave,
      onCancel
    };
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
        title: 'Mẫu',
        width: '10%',
        render: (text, record) => (
          <div
            style={{
              width: '15px',
              height: '15px',
              background: `${record.code}`
            }}
          />
        )
      },
      {
        title: 'Màu',
        dataIndex: 'name',
        width: '20%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
      },
      {
        title: 'Mã màu',
        dataIndex: 'code',
        width: '20%',
        ...this.getColumnSearchProps('code'),
        sorter: (a, b) => a.code.localeCompare(b.code),
        sortOrder: sortedInfo.columnKey === 'code' && sortedInfo.order
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: '25%',
        ...this.getColumnSearchProps('createdDate'),
        sorter: (a, b) =>
          moment(a.createdDate).unix() - moment(b.createdDate).unix(),
        sortOrder: sortedInfo.columnKey === 'createdDate' && sortedInfo.order,
        render: (text, record) => (
          <span>{formatDateTime(record.createdDate)}</span>
        )
      },
      {
        title: '',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật màu`, record)
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
      }
    ];

    return (
      <Fragment>
        <ButtonsWrapper>
          <ActionButton
            type="primary"
            onClick={() =>
              onShowModal(typeForm.create, `Tạo mới màu`, null)
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
          dataSource={colorList}
          onChange={handleChange}
        />
        <ColorForm {...resource} />
      </Fragment>
    );
  }
}

export default ColorPage;
