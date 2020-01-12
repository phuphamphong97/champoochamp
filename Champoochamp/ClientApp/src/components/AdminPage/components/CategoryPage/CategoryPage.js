import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI } from '../../../../shared/util';
import { time, typeForm } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

import CategoryForm from './components/CategoryForm';

class CategoryAdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      categoryList: [],
      isShowModal: false,
      title: '',
      category: null,
      currentTypeForm: ''
    };
  }

  componentDidMount() {
    this.getAllCategories();
  }

  getAllCategories = () => {
    callAPI('Category/GetAdminAllCategories').then(res =>
      this.setState({ categoryList: res.data ? res.data : [] })
    );
  };

  onShowModal = (typeForm, title, category) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      category
    });
  };

  onSave = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      const { currentTypeForm, categoryList } = this.state;
      const { employee } = this.props;

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Category/CreateCategory', '', 'POST', values).then(res => {
          if (res.data) {
            if (res.data.id > 0) {
              categoryList.push(res.data);

              this.setState({
                isShowModal: false,
                categoryList
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
                message: 'Loại sản phẩm đã tồn tại!',
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
          category: values,
          categoryList: []
        };
        callAPI('Category/PutCategory', '', 'PUT', data).then(res => {
          if (res.data) {
            if (res.data.id > 0) {
              let lst = categoryList;
              lst = categoryList.filter(
                category => category.id !== res.data.id
              );
              lst.unshift(res.data);

              this.setState({
                isShowModal: false,
                categoryList: lst
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
                message: 'Loại sản phẩm đã tồn tại!',
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
    let categoryList = [];
    ids.map(id => categoryList.push({ id }));
    const data = {
      employee: null,
      category: null,
      categoryList
    };

    callAPI('Category/DeleteCategoryByIds', '', 'DELETE', data).then(res => {
      if (res.data) {
        this.setState({
          selectedRowKeys: this.state.selectedRowKeys.filter(
            key => !ids.includes(key)
          ),
          categoryList: this.state.categoryList.filter(
            category => !ids.includes(category.id)
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

    callAPI('Category/DeleteCategoryById', '', 'DELETE', data).then(res => {
      if (res.data) {
        this.setState({
          selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
          categoryList: this.state.categoryList.filter(
            category => category.id !== id
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
      categoryList,
      isShowModal,
      currentTypeForm,
      title,
      category
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
      category,
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
        title: 'Tên loại sản phẩm',
        dataIndex: 'name',
        width: '30%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'Nhóm loại sản phẩm',
        dataIndex: 'parent.name',
        width: '45%',
        ...this.getColumnSearchProps('parent.name'),
        sorter: (a, b) =>
          (a.parent ? a.parent.name : '').localeCompare(
            b.parent ? b.parent.name : ''
          ),
        sortOrder: sortedInfo.columnKey === 'parent.name' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: '',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật loại sản phẩm`, record)
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
              onShowModal(typeForm.create, `Tạo mới loại sản phẩm`, null)
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
          dataSource={categoryList}
          onChange={handleChange}
        />
        <CategoryForm {...resource} />
      </Fragment>
    );
  }
}

export default CategoryAdminPage;
