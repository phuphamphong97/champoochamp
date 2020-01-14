import React, { Component, Fragment } from 'react';
import { Table, Input, Button, Icon, Divider, notification } from 'antd';

import { callAPI, formatMoney, getImageUrl } from '../../../../shared/util';
import { time, typeForm, imagesGroup } from '../../../../shared/constants';
import { ButtonsWrapper, ActionButton, LinkButton } from '../../styledUtils';

import ProductForm from './components/ProductForm';

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      productList: [],
      isShowModal: false,
      title: '',
      product: null,
      currentTypeForm: ''
    };
  }

  componentDidMount() {
    this.getAdminAllProducts();
  }

  getAdminAllProducts = () => {
    callAPI('Product/GetAdminAllProducts')
      .then(res => this.setState({ productList: res.data }));
  }

  onShowModal = (typeForm, title, product) => {
    this.setState({
      isShowModal: true,
      currentTypeForm: typeForm,
      title,
      product
    });
  };

  onSave = productVariantModelList => {
    const { currentTypeForm, productList } = this.state;
    const { employee } = this.props;
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      const data = {
        employee,
        product: values,
        productVariantModelList,
        productList: []
      }

      if (err) {
        return;
      }

      if (currentTypeForm === typeForm.create) {
        callAPI('Product/CreateProduct', '', 'POST', data).then(res => {
          if (res.data) {
            if (res.data.id > 0) {
              productList.push(res.data);

              this.setState({
                isShowModal: false,
                productList
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
                message: 'Sản phẩm đã tồn tại, vui lòng nhập sản phẩm khác!',
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
      else if (currentTypeForm === typeForm.update) {
        callAPI('Product/PutProduct', '', 'PUT', data).then(res => {
          if (res.data) {
            if (res.data.id > 0) {
              let lst = productList;
              lst = productList.filter(
                product => product.id !== res.data.id
              );
              lst.unshift(res.data);

              this.setState({
                isShowModal: false,
                productList: lst
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
                message: 'Sản phẩm đã tồn tại, vui lòng nhập sản phẩm khác!',
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
    let productList = [];
    ids.map(id => productList.push({ id }));
    const data = {
      employee: null,
      product: null,
      productList
    };

    callAPI('Product/DeleteProductByIds', '', 'DELETE', data).then(res => {
      if (res.data) {
        this.setState({
          selectedRowKeys: this.state.selectedRowKeys.filter(
            key => !ids.includes(key)
          ),
          productList: this.state.productList.filter(
            product => !ids.includes(product.id)
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

    callAPI('Product/DeleteProductById', '', 'DELETE', data).then(res => {
      if (res.data) {
        this.setState({
          selectedRowKeys: this.state.selectedRowKeys.filter(key => key !== id),
          productList: this.state.productList.filter(
            product => product.id !== id
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
    let {
      selectedRowKeys,
      sortedInfo,
      productList,
      isShowModal,
      currentTypeForm,
      title,
      product
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
      product,
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
        title: 'Ảnh',
        width: '10%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.productVariant[0].thumbnail, imagesGroup.products)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        width: '20%',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      },
      {
        title: 'Giá',
        dataIndex: 'price',
        width: '15%',
        ...this.getColumnSearchProps('price'),
        sorter: (a, b) => a.price - b.price,
        sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        render: (text, record) => (<span>{formatMoney(record.price, true)}đ</span>),
      },
      {
        title: 'Khuyến mãi',
        dataIndex: 'discountAmount',
        width: '15%',
        ...this.getColumnSearchProps('discountAmount'),
        sorter: (a, b) => a.discountAmount - b.discountAmount,
        sortOrder: sortedInfo.columnKey === 'discountAmount' && sortedInfo.order,
        render: (text, record) => (<span>{record.discountAmount || 0}%</span>),
      },
      {
        title: 'Tổng SL',
        dataIndex: 'totalQuantity',
        width: '15%',
        ...this.getColumnSearchProps('totalQuantity'),
        sorter: (a, b) => a.totalQuantity - b.totalQuantity,
        sortOrder: sortedInfo.columnKey === 'productAmount' && sortedInfo.order,
      },
      {
        title: '',
        width: '15%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật sản phẩm`, record)
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
              onShowModal(typeForm.create, `Tạo mới sản phẩm`, null)
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
          dataSource={productList}
          onChange={handleChange}
        />
        <ProductForm {...resource} />
      </Fragment>
    );
  }
}

export default ProductPage;
