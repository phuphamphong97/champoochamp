import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Table, Button, Icon, Divider, notification } from 'antd';

import { callAPI, formatDateTime, getImageUrl } from '../../../../../../shared/util';
import { time, typeForm, imagesGroup } from '../../../../../../shared/constants';
import { ModifyText, ButtonsWrapper, ActionButton, LinkButton } from '../../../../styledUtils';

import ProductVariantForm from '../ProductVariantForm';

const { Option } = Select;
const { TextArea } = Input;

class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      materialList: [],
      brandList: [],
      categoryList: [],
      unitList: [],
      suplierList: [],
      selectedRowKeys: [],
      searchText: '',
      searchedColumn: '',
      sortedInfo: null,
      productVariantModelList: [],
      isShowPVModal: false,
      pvTitle: '',
      productVariant: null,
      currentTypePVForm: '',
      productVariantId: 0
    };
  }

  componentDidMount() {
    axios.all([
      callAPI(`Material/GetAllMaterials`),
      callAPI(`Brand/GetAllBrands`),
      callAPI(`Category/GetAllCategories`, `?$filter=parentId ne null`),
      callAPI(`Unit/GetAllUnits`),
      callAPI(`Suplier/GetAllSupliers`),
    ]).then(axios.spread((...res) => {
      this.setState({
        materialList: res[0].data,
        brandList: res[1].data,
        categoryList: res[2].data,
        unitList: res[3].data,
        suplierList: res[4].data
      });
    }));
  }

  handleMaterialChange = value => {
    this.props.form.setFieldsValue({
      materialId: value
    });
  };

  handleBrandChange = value => {
    this.props.form.setFieldsValue({
      brandId: value
    });
  };

  handleCategoryChange = value => {
    this.props.form.setFieldsValue({
      categoryId: value
    });
  };

  handleUnitChange = value => {
    this.props.form.setFieldsValue({
      unitId: value
    });
  };

  handleSuplierChange = value => {
    this.props.form.setFieldsValue({
      suplierId: value
    });
  };

  getAllProductVariantsByProductId = productId => {
    callAPI(`Product/GetAllProductVariantsByProductId-${productId}`)
      .then(res => this.setState({
        isProductIdChange: false,
        productVariantModelList: res.data
      }));
  }

  onShowModal = (typeForm, pvTitle, productVariant, productVariantId) => {
    this.setState({
      isShowPVModal: true,
      currentTypePVForm: typeForm,
      pvTitle,
      productVariant,
      productVariantId
    });
  };

  onPVSave = () => {
    const { currentTypePVForm, productVariantModelList, productVariantId } = this.state;
    const { form } = this.formRef.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      if (currentTypePVForm === typeForm.create) {
        let pv = productVariantModelList.find(p => p.id === values.id);
        if (!pv) {
          pv = {
            productVariant: {
              id: values.id,
              colorId: values.colorId,
              sizeId: values.sizeId,
              quantity: values.quantity,
              color: {
                name: values.colorName
              },
              size: {
                name: values.sizeName
              },
            },            
            imageUrlList: values.imageUrlList
          }

          productVariantModelList.push(pv);

          this.setState({
            isShowPVModal: false,
            productVariantModelList
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
            message: 'Chi tiết sản phẩm đã tồn tại, vui lòng nhập chi tiết khác!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        }        
      }
      else if (currentTypePVForm === typeForm.update) {
        let lst = productVariantModelList;
        lst = productVariantModelList.filter(p => p.id !== productVariantId);
        let pv = lst.find(p => p.id === values.id);
        if (!pv) {
          pv = {
            productVariant: {
              id: values.id,
              colorId: values.colorId,
              sizeId: values.sizeId,
              quantity: values.quantity,
              color: {
                name: values.colorName
              },
              size: {
                name: values.sizeName
              },
            },
            imageUrlList: values.imageUrlList
          }
          lst.unshift(pv);

          this.setState({
            isShowPVModal: false,
            productVariantModelList: lst,
            productVariantId: 0
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
            message: 'Chi tiết sản phẩm đã tồn tại, vui lòng nhập chi tiết khác!',
            placement: 'topRight',
            onClick: () => notification.destroy(),
            duration: time.durationNotification
          });
        } 
      }
    });
  };

  onPVCancel = () => {
    this.setState({
      isShowPVModal: false,
      productVariantId: 0
    });
    this.formRef.props.form.resetFields();
  };

  onSelectedDelete = ids => {
    const { productVariantModelList, selectedRowKeys } = this.state;

    this.setState({
      selectedRowKeys: selectedRowKeys.filter(
        key => !ids.includes(key)
      ),
      productVariantModelList: productVariantModelList.filter(
        p => !ids.includes(p.id)
      )
    });

    notification.info({
      message: 'Xóa thành công!',
      placement: 'topRight',
      onClick: () => notification.destroy(),
      duration: time.durationNotification
    });
  };

  onDelete = id => {
    const { productVariantModelList, selectedRowKeys } = this.state;

    const pv = productVariantModelList.find(p => p.id === id)
    if (pv) {
      this.setState({
        selectedRowKeys: selectedRowKeys.filter(key => key !== id),
        productVariantModelList: productVariantModelList.filter(p => p.id !== id)
      });

      notification.info({
        message: 'Xóa thành công!',
        placement: 'topRight',
        onClick: () => notification.destroy(),
        duration: time.durationNotification
      });
    }
    else {
      notification.error({
        message: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
        placement: 'topRight',
        onClick: () => notification.destroy(),
        duration: time.durationNotification
      });
    }
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
    let { materialList, brandList, categoryList, unitList, suplierList,
      selectedRowKeys,
      sortedInfo,
      productVariantModelList,
      isShowPVModal,
      pvTitle,
      productVariant,
      currentTypePVForm,
    } = this.state;
    const {
      isShowModal,
      currentTypeForm,
      title,
      form,
      product,
      onSave,
      onCancel
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      handleChange,
      onSelectChange,
      wrappedComponentRef,
      onShowModal,
      onPVSave,
      onPVCancel,
      onSelectedDelete,
      onDelete
    } = this;
    const resource = {
      wrappedComponentRef,
      isShowPVModal,
      pvTitle,
      productVariant,
      currentTypePVForm,
      onPVSave,
      onPVCancel
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange
    };
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: 'ID',
        dataIndex: 'productVariant.id',
        width: '10%',
        ...this.getColumnSearchProps('productVariant.id'),
        sorter: (a, b) => a.productVariant.id.toString().localeCompare(b.productVariant.id),
        sortOrder: sortedInfo.columnKey === 'productVariant.id' && sortedInfo.order
      },
      {
        title: 'Ảnh',
        width: '10%',
        render: (text, record) => (
          <img
            src={getImageUrl(record.productVariant.thumbnail ? record.productVariant.thumbnail : 'default.jpg', imagesGroup.products)}
            alt=""
            style={{ width: "50px" }}
          />
        ),
      },
      {
        title: 'Màu',
        dataIndex: 'productVariant.color.name',
        width: '20%',
        ...this.getColumnSearchProps('productVariant.color.name'),
        sorter: (a, b) => a.productVariant.color.name.localeCompare(b.productVariant.color.name),
        sortOrder: sortedInfo.columnKey === 'productVariant.color.name' && sortedInfo.order,
      },
      {
        title: 'Kích thước',
        dataIndex: 'productVariant.size.name',
        width: '20%',
        ...this.getColumnSearchProps('productVariant.size.name'),
        sorter: (a, b) => a.productVariant.size.name.localeCompare(b.productVariant.size.name),
        sortOrder: sortedInfo.columnKey === 'productVariant.size.name' && sortedInfo.order,
      },
      {
        title: 'SL',
        dataIndex: 'productVariant.quantity',
        width: '20%',
        ...this.getColumnSearchProps('productVariant.quantity'),
        sorter: (a, b) => a.productVariant.quantity - b.productVariant.quantity,
        sortOrder: sortedInfo.columnKey === 'productVariant.quantity' && sortedInfo.order,
      },
      {
        title: '',
        width: '20%',
        render: (text, record) => (
          <Fragment>
            <LinkButton
              type="link"
              onClick={() =>
                onShowModal(typeForm.update, `Cập nhật chi tiết sản phẩm`, record.productVariant, record.productVariant.id)
              }
            >
              Sửa
            </LinkButton>
            <Divider type="vertical" />
            <LinkButton type="link" onClick={() => onDelete(record.productVariant.id)}>
              Xoá
            </LinkButton>
          </Fragment>
        )
      }
    ];

    return (
      <Modal
        title={title}
        visible={isShowModal}
        onOk={() => onSave(productVariantModelList)}
        onCancel={onCancel}
        width="800px"
      >
        <Form>
          {currentTypeForm === typeForm.update && (
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('id', {
                initialValue: product && product.id
              })(<Input placeholder="Id" />)}
            </Form.Item>
          )}
          <Form.Item label="Tên">
            {getFieldDecorator('name', {
              initialValue: product && product.name,
              rules: [{ required: true, message: 'Vui lòng nhập tên!' }]
            })(<Input placeholder="Tên *" />)}
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Giá">
                {getFieldDecorator('price', {
                  initialValue: product && product.price,
                  rules: [{ required: true, message: 'Vui lòng nhập giá!' }]
                })(<Input
                  suffix="VNĐ"
                  placeholder="Giá *"
                />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mức giảm (%)">
                {getFieldDecorator('discountAmount', {
                  initialValue: (product && product.discountAmount) || 0,
                })(
                  <InputNumber
                    placeholder="Mức giảm"
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>              
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mô tả">
                {getFieldDecorator('description', {
                  initialValue: product && product.description
                })(<TextArea
                  autosize={{ minRows: 5, maxRows: 10 }}
                  placeholder="Mô tả"
                />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chi tiết">
                {getFieldDecorator('detail', {
                  initialValue: product && product.detail
                })(<TextArea
                  autosize={{ minRows: 5, maxRows: 10 }}
                  placeholder="Chi tiết"
                />)}
              </Form.Item>
            </Col>
          </Row>          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thời gian bảo hành">
                {getFieldDecorator('warrantyPeriod', {
                  initialValue: product ? product.warrantyPeriod : undefined,
                })(
                  <Select showSearch placeholder="Thời gian bảo hành">
                    <Option key="3 tháng">3 tháng</Option>
                    <Option key="6 tháng">6 tháng</Option>
                    <Option key="9 tháng">9 tháng</Option>
                    <Option key="1 nắm">1 năm</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chất liệu">
                {getFieldDecorator('materialId', {
                  initialValue: product && product.material ? product.material.name : undefined,
                  rules: [
                    {
                      required: true,
                      message: 'Vui lòng chọn chất liệu!'
                    }
                  ],
                  onChange: this.handleMaterialChange
                })(
                  <Select showSearch placeholder="Chất liệu *">
                    {materialList.map(material => (
                      <Option key={material.id}>{material.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thương hiệu">
                {getFieldDecorator('brandId', {
                  initialValue: product && product.brand ? product.brand.name : undefined,
                  rules: [
                    {
                      required: true,
                      message: 'Vui lòng chọn thương hiệu!'
                    }
                  ],
                  onChange: this.handleBrandChange
                })(
                  <Select showSearch placeholder="Thương hiệu *">
                    {brandList.map(brand => (
                      <Option key={brand.id}>{brand.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại sản phẩm">
                {getFieldDecorator('categoryId', {
                  initialValue: product && product.category ? product.category.name : undefined,
                  rules: [
                    {
                      required: true,
                      message: 'Vui lòng chọn loại sản phẩm!'
                    }
                  ],
                  onChange: this.handleCategoryChange
                })(
                  <Select showSearch placeholder="Loại sản phẩm *">
                    {categoryList.map(category => (
                      <Option key={category.id}>{category.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>        
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Đơn vị tính">
                {getFieldDecorator('unitId', {
                  initialValue: product && product.unit ? product.unit.name : undefined,
                  rules: [
                    {
                      required: true,
                      message: 'Vui lòng chọn chất liệu!'
                    }
                  ],
                  onChange: this.handleUnitChange
                })(
                  <Select showSearch placeholder="Đơn vị tính *">
                    {unitList.map(unit => (
                      <Option key={unit.id}>{unit.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Nhà cung cấp">
                {getFieldDecorator('suplierId', {
                  initialValue: product && product.suplier ? product.suplier.name : undefined,
                  rules: [
                    {
                      required: true,
                      message: 'Vui lòng chọn nhà cung cấp!'
                    }
                  ],
                  onChange: this.handleSuplierChange
                })(
                  <Select showSearch placeholder="Nhà cung cấp *">
                    {suplierList.map(suplier => (
                      <Option key={suplier.id}>{suplier.name}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Fragment>
            <ButtonsWrapper>
              <ActionButton
                type="primary"
                onClick={() =>
                  onShowModal(typeForm.create, `Tạo mới chi tiết sản phẩm`, null, 0)
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
              rowKey='productVariant.id'
              rowSelection={rowSelection}
              columns={columns}
              dataSource={productVariantModelList}
              onChange={handleChange}
            />
            <ProductVariantForm {...resource} />
          </Fragment>

          {currentTypeForm === typeForm.update &&
            product &&
            product.modifiedBy && (
              <ModifyText>
                Cập nhật lần cuối bởi {product.modifiedBy} lúc{' '}
                {formatDateTime(product.modifiedDate)}.
              </ModifyText>
            )}
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: 'ProductForm' })(ProductForm);
