import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';

import { adminPage } from '../../shared/constants';

import { PageContainer, Button } from '../elements';
import InvoicePage from './components/InvoicePage';
import CategoryPage from './components/CategoryPage';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    const { employee, history } = props;
    !employee && history.push(`/admin/dang-nhap`);
    this.state = {
      pageCurrent: adminPage.invoicePage
    }
  }

  onPage = pageCurrent => {
    this.setState({ pageCurrent });
  }

  renderButton = pageCurrent => {
    return (
      <Fragment>
        <Button title="Hóa đơn" isBlockButton isSecondary={pageCurrent === adminPage.invoicePage ? false : true} onClick={() => this.onPage(adminPage.invoicePage)} />
        <Button title="Chi tiết hóa đơn" isBlockButton isSecondary={pageCurrent === adminPage.invoiceDetailPage ? false : true} onClick={() => this.onPage(adminPage.invoiceDetailPage)} />
        <Button title="Sản phẩm" isBlockButton isSecondary={pageCurrent === adminPage.productPage ? false : true} onClick={() => this.onPage(adminPage.productPage)} />
        <Button title="Loại sản phẩm" isBlockButton isSecondary={pageCurrent === adminPage.categoryPage ? false : true} onClick={() => this.onPage(adminPage.categoryPage)} />
        <Button title="Bộ sưu tập" isBlockButton isSecondary={pageCurrent === adminPage.collectionPage ? false : true} onClick={() => this.onPage(adminPage.collectionPage)} />
        <Button title="Màu sắc" isBlockButton isSecondary={pageCurrent === adminPage.colorPage ? false : true} onClick={() => this.onPage(adminPage.colorPage)} />
        <Button title="Kích thước" isBlockButton isSecondary={pageCurrent === adminPage.sizePage ? false : true} onClick={() => this.onPage(adminPage.sizePage)} />
        <Button title="Khách hàng" isBlockButton isSecondary={pageCurrent === adminPage.userPage ? false : true} onClick={() => this.onPage(adminPage.userPage)} />
        <Button title="Nhân viên" isBlockButton isSecondary={pageCurrent === adminPage.employeePage ? false : true} onClick={() => this.onPage(adminPage.employeePage)} />
      </Fragment>
    );
  }

  renderPage = (pageCurrent, employee) => {
    switch (pageCurrent) {
      case adminPage.invoicePage:
        return (<InvoicePage employee={employee} />);
      case adminPage.invoiceDetailPage:
        return (<InvoicePage employee={employee} />);
      case adminPage.productPage:
        return (<InvoicePage employee={employee} />);
      case adminPage.categoryPage:
        return (<CategoryPage employee={employee} />);
      case adminPage.collectionPage:
        return (<InvoicePage employee={employee} />);
      case adminPage.colorPage:
        return (<InvoicePage employee={employee} />);
      case adminPage.sizePage:
        return (<InvoicePage employee={employee} />);
      case adminPage.userPage:
        return (<InvoicePage employee={employee} />);
      case adminPage.employeePage:
        return (<InvoicePage employee={employee} />);
    }
  }

  render() {
    const { pageCurrent } = this.state;
    const { employee } = this.props;

    return (
      <PageContainer>
        <Row className="product-list-wrapper">
          <Col xs={24} lg={6}>
            {this.renderButton(pageCurrent)}
          </Col>
          <Col xs={24} lg={18}>
            {this.renderPage(pageCurrent, employee)}
          </Col>
        </Row>
      </PageContainer>
    );
  }
}

export default AdminPage;
