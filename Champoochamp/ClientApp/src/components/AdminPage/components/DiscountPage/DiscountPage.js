import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI } from '../../../../shared/util';
import { time, typeForm } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

import DiscountForm from './components/DiscountForm';

class DiscountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      discountList: [],
      isShowModal: false,
      title: '',
      discount: null,
      currentTypeForm: ''
    };
  }

  componentDidMount() {
    this.getAllDiscounts();
  }

  getAllDiscounts = () => {
    callAPI('Discount/GetAllDiscounts').then(res =>
      this.setState({ discountList: res.data ? res.data : [] })
    );
  };

  onShowModal = (typeForm, title, discount) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      discount
    });
  };

  onSave = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      const { currentTypeForm, discountList } = this.state;
      const { employee } = this.props;

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Discount/CreateDiscount', '', 'POST', values).then(res => {
          if (res.data) {
            if (res.data.id > 0) {
              discountList.push(res.data);

              this.setState({
                isShowModal: false,
                discountList
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
                message: 'Mã giảm giá đã tồn tại!',
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
          discount: values,
          discountList: []
        };
        callAPI('Discount/PutDiscount', '', 'PUT', data).then(res => {
          if (res.data) {
            if (res.data.id > 0) {
              let lst = discountList;
              lst = discountList.filter(
                discount => discount.id !== res.data.id
              );
              lst.unshift(res.data);

              this.setState({
                isShowModal: false,
                discountList: lst
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
                message: 'Mã giảm giá đã tồn tại!',
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
    let discountList = [];
    ids.map(id => discountList.push({ id }));
    const data = {
      employee: null,
      discount: null,
      discountList
    };

    callAPI('Discount/DeleteDiscountByIds', '', 'DELETE', data).then(res => {
      if (res.data) {
        this.setState({
          selectedRowKeys: this.state.selectedRowKeys.filter(
            key => !ids.includes(key)
          ),
          discountList: this.state.discountList.filter(
            discount => !ids.includes(discount.id)
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

    callAPI('Discount/DeleteDiscountById', '', 'DELETE', data).then(res => {
      if (res.data) {
        this.setState({
          selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
          discountList: this.state.discountList.filter(
            discount => discount.id !== id
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
      discountList,
      isShowModal,
      currentTypeForm,
      title,
      discount
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
      discount,
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
        title: 'Tên',
        dataIndex: 'name',
        width: '35%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
      },
      {
        title: 'Mã code',
        dataIndex: 'code',
        width: '20%',
        ...this.getColumnSearchProps('code'),
        sorter: (a, b) => a.code.localeCompare(b.code),
        sortOrder: sortedInfo.columnKey === 'code' && sortedInfo.order
      },
      {
        title: 'Mức giảm',
        dataIndex: 'rate',
        width: '20%',
        ...this.getColumnSearchProps('rate'),
        sorter: (a, b) => a.rate - b.rate,
        sortOrder: sortedInfo.columnKey === 'rate' && sortedInfo.order,
        render: (text, record) => <span>{record.rate}%</span>
      },
      {
        title: '',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật mã giảm giá`, record)
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
              onShowModal(typeForm.create, `Tạo mới mã giảm giá`, null)
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
          dataSource={discountList}
          onChange={handleChange}
        />
        <DiscountForm {...resource} />
      </Fragment>
    );
  }
}

export default DiscountPage;
