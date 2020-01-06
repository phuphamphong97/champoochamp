import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';
import styled from '@emotion/styled';

import { adminPage } from '../../shared/constants';

import { Button } from '../elements';
import BrandPage from './components/BrandPage';
import CategoryPage from './components/CategoryPage';
import CollectionPage from './components/CollectionPage';
import ColorPage from './components/ColorPage';
import DiscountPage from './components/DiscountPage';
import EmployeePage from './components/EmployeePage';
import InvoicePage from './components/InvoicePage';
import ProductPage from './components/ProductPage';
import ProphetPage from './components/ProphetPage';
import SizePage from './components/SizePage';
import SuplierPage from './components/SuplierPage';
import UnitPage from './components/UnitPage';
import UserPage from './components/UserPage';

const Wrapper = styled('div')`
  width: 95%;
  margin: auto;
`;

class AdminPage extends Component {
  constructor(props) {
    super(props);
    const { employee, history } = props;
    !employee && history.push(`/admin/dang-nhap`);
    this.state = {
      pageCurrent: adminPage.invoicePage,
      selectedItem: []
    };
  }

  onPage = pageCurrent => {
    this.setState({
      pageCurrent,
      selectedItem: []
    });
  };

  renderButton = pageCurrent => {
    return (
      <Fragment>
        <Button
          title="Hóa đơn"
          isBlockButton
          isSecondary={pageCurrent === adminPage.invoicePage ? false : true}
          onClick={() => this.onPage(adminPage.invoicePage)}
        />
        <Button
          title="Mã giảm giá"
          isBlockButton
          isSecondary={pageCurrent === adminPage.discountPage ? false : true}
          onClick={() => this.onPage(adminPage.discountPage)}
        />
        <Button
          title="Sản phẩm"
          isBlockButton
          isSecondary={pageCurrent === adminPage.productPage ? false : true}
          onClick={() => this.onPage(adminPage.productPage)}
        />
        <Button
          title="Loại sản phẩm"
          isBlockButton
          isSecondary={pageCurrent === adminPage.categoryPage ? false : true}
          onClick={() => this.onPage(adminPage.categoryPage)}
        />
        <Button
          title="Bộ sưu tập"
          isBlockButton
          isSecondary={pageCurrent === adminPage.collectionPage ? false : true}
          onClick={() => this.onPage(adminPage.collectionPage)}
        />
        <Button
          title="Màu sắc"
          isBlockButton
          isSecondary={pageCurrent === adminPage.colorPage ? false : true}
          onClick={() => this.onPage(adminPage.colorPage)}
        />
        <Button
          title="Kích thước"
          isBlockButton
          isSecondary={pageCurrent === adminPage.sizePage ? false : true}
          onClick={() => this.onPage(adminPage.sizePage)}
        />
        <Button
          title="Thương hiệu"
          isBlockButton
          isSecondary={pageCurrent === adminPage.brandPage ? false : true}
          onClick={() => this.onPage(adminPage.brandPage)}
        />
        <Button
          title="Đơn vị tính"
          isBlockButton
          isSecondary={pageCurrent === adminPage.unitPage ? false : true}
          onClick={() => this.onPage(adminPage.unitPage)}
        />
        <Button
          title="Nhà cung cấp"
          isBlockButton
          isSecondary={pageCurrent === adminPage.suplierPage ? false : true}
          onClick={() => this.onPage(adminPage.suplierPage)}
        />
        <Button
          title="Khách hàng"
          isBlockButton
          isSecondary={pageCurrent === adminPage.userPage ? false : true}
          onClick={() => this.onPage(adminPage.userPage)}
        />
        <Button
          title="Nhân viên"
          isBlockButton
          isSecondary={pageCurrent === adminPage.employeePage ? false : true}
          onClick={() => this.onPage(adminPage.employeePage)}
        />
        <Button
          title="Dự báo"
          isBlockButton
          isSecondary={pageCurrent === adminPage.prophetPage ? false : true}
          onClick={() => this.onPage(adminPage.prophetPage)}
        />
      </Fragment>
    );
  };

  renderPage = (pageCurrent, employee) => {
    switch (pageCurrent) {
      case adminPage.invoicePage:
        return <InvoicePage employee={employee} />;
      case adminPage.discountPage:
        return <DiscountPage employee={employee} />;
      case adminPage.productPage:
        return <ProductPage employee={employee} />;
      case adminPage.categoryPage:
        return <CategoryPage employee={employee} />;
      case adminPage.collectionPage:
        return <CollectionPage employee={employee} />;
      case adminPage.colorPage:
        return <ColorPage employee={employee} />;
      case adminPage.sizePage:
        return <SizePage employee={employee} />;
      case adminPage.brandPage:
        return <BrandPage employee={employee} />;
      case adminPage.unitPage:
        return <UnitPage employee={employee} />;
      case adminPage.suplierPage:
        return <SuplierPage employee={employee} />;
      case adminPage.userPage:
        return <UserPage employee={employee} />;
      case adminPage.employeePage:
        return <EmployeePage employeeLogin={employee} />;
      case adminPage.prophetPage:
        return <ProphetPage />;
      default:
        break;
    }
  };

  render() {
    const { pageCurrent } = this.state;
    const { employee } = this.props;

    return (
      <Wrapper>
        <Row className="product-list-wrapper" gutter={32}>
          <Col span={4}>
            {this.renderButton(pageCurrent)}
          </Col>
          <Col span={20}>
            {this.renderPage(pageCurrent, employee)}
          </Col>
        </Row>
      </Wrapper>
    );
  }
}

export default AdminPage;
