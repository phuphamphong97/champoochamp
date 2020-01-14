import React, { Component, Fragment } from 'react';
import { Row, Col, notification } from 'antd';
import styled from '@emotion/styled';

import { adminPage, imagesGroup, localStorageKey, time } from '../../shared/constants';
import { colors } from '../../shared/principles';
import { getImageUrl, setCookie } from '../../shared/util';

import { Link } from '../elements';
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
  margin: 30px auto 0 auto;
  width: 100%;

  .ant-row {
    margin: 0 !important;
  }
`;

const MenuButton = styled('button')`
  background: ${props => (props.isSelected ? colors.white : colors.offWhite)};
  border: none;
  border-bottom: solid 1px ${colors.gray};
  color: ${colors.black};
  cursor: pointer;
  letter-spacing: 0.8px;
  outline: none;
  padding: 1.2rem 2rem;
  margin: 0;
  text-align: left;
  transition: all 0.2s;
  width: 100%;

  &:hover,
  &:active,
  &:focus {
    background: ${colors.white};
  }
`;

const AccountWrapper = styled('div')`
  background: ${colors.offWhite};
  border-bottom: solid 1px ${colors.gray};
  padding: 1.2rem 2rem;
  width: 100%;
`;

const AccountAvatar = styled('div')`
  background-image: url("${props => props.url}");
  background-position: center;
  background-size: contain;
  border-radius: 25px;
  cursor: pointer;
  height: 50px;
  margin-bottom: 10px;
  width: 50px;
`;

const AccountName = styled('span')`
  color: ${colors.black};
  letter-spacing: 0.8px;
`;

const LogoutButton = styled('span')`
  cursor: pointer;
  display: block;
  font-size: 12px;
  text-decoration: underline;
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

  onLogout = () => {
    const { onLoginAdmin, history } = this.props;

    localStorage.setItem(localStorageKey.employeeKey, '');
    localStorage.setItem(localStorageKey.timeEmployeeSessionKey, 0);
    setCookie(localStorageKey.userNameAdminKey, '', -1);
    setCookie(localStorageKey.passwordAdminKey, '', -1);
    onLoginAdmin(null);
    history.push('/admin/dang-nhap');

    notification.info({
      message: 'Đăng xuất thành công!',
      placement: 'topRight',
      onClick: () => notification.destroy(),
      duration: time.durationNotification
    });
  };

  renderButton = (pageCurrent, employee) => {
    console.log(employee);
    return (
      <Fragment>
        <AccountWrapper>
          <AccountAvatar
            url={getImageUrl(
              employee && employee.thumbnail
                ? employee.thumbnail
                : 'default.png',
              imagesGroup.users
            )}
          />
          <AccountName>
            {employee && employee.name ? employee.name : null}
          </AccountName>
          <LogoutButton onClick={() => this.onLogout()}>Đăng xuất</LogoutButton>
        </AccountWrapper>
        <MenuButton
          isSelected={pageCurrent === adminPage.invoicePage}
          onClick={() => this.onPage(adminPage.invoicePage)}
        >
          Hóa đơn
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.discountPage}
          onClick={() => this.onPage(adminPage.discountPage)}
        >
          Mã giảm giá
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.productPage}
          onClick={() => this.onPage(adminPage.productPage)}
        >
          Sản phẩm
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.categoryPage}
          onClick={() => this.onPage(adminPage.categoryPage)}
        >
          Loại sản phẩm
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.collectionPage}
          onClick={() => this.onPage(adminPage.collectionPage)}
        >
          Bộ sưu tập
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.colorPage}
          onClick={() => this.onPage(adminPage.colorPage)}
        >
          Màu sắc
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.sizePage}
          onClick={() => this.onPage(adminPage.sizePage)}
        >
          Kích thước
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.brandPage}
          onClick={() => this.onPage(adminPage.brandPage)}
        >
          Thương hiệu
        </MenuButton>
        <MenuButton
          title="Đơn vị tính"
          isSelected={pageCurrent === adminPage.unitPage}
          onClick={() => this.onPage(adminPage.unitPage)}
        >
          Đơn vị tính
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.suplierPage}
          onClick={() => this.onPage(adminPage.suplierPage)}
        >
          Nhà cung cấp
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.userPage}
          onClick={() => this.onPage(adminPage.userPage)}
        >
          Khách hàng
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.employeePage}
          onClick={() => this.onPage(adminPage.employeePage)}
        >
          Nhân viên
        </MenuButton>
        <MenuButton
          isSelected={pageCurrent === adminPage.prophetPage}
          onClick={() => this.onPage(adminPage.prophetPage)}
        >
          Dự báo
        </MenuButton>
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
        return (
          <EmployeePage
            employeeLogin={employee}
            onLoginAdmin={this.props.onLoginAdmin}
          />
        );
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
        <Row gutter={32}>
          <Col span={4}>{this.renderButton(pageCurrent, employee)}</Col>
          <Col span={20}>{this.renderPage(pageCurrent, employee)}</Col>
        </Row>
      </Wrapper>
    );
  }
}

export default AdminPage;
