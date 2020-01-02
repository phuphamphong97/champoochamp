import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Form, notification } from 'antd';
import styled from '@emotion/styled';

import {
  callAPI,
  formatMoney,
  getTotalMoney,
  updateShoppingCart
} from '../../shared/utils';
import { localStorageKey, time } from '../../shared/constants';
import { typography } from '../../shared/principles';

import { PageContainer, Section, SectionTitle, Link } from '../elements';
import InvoiceInfo from './components/InvoiceInfo';
import CartInfo from './components/CartInfo';
import PaymentMethod from './components/PaymentMethod';

const SmallTitle = styled('h4')`
  ${typography.smTitle};
`;

const BackButton = styled('div')`
  margin-top: 10px;
`;

class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shoppingCartList: [],
      transportFee: 0
    };
  }

  componentDidMount() {
    this.getShoppingCart(this.props.user);
  }

  getShoppingCart = user => {
    const url = 'Cart/GetShoppingCart';
    const data = {
      email: user && user.email,
      shoppingCarts: `${localStorage.getItem(localStorageKey.storageShoppingCartKey)}`
    };

    callAPI(url, '', 'POST', data).then(res =>
      this.setState({
        shoppingCartList: res.data
      })
    );
  };

  getTransportFee = transportFee => {
    this.setState({ transportFee })
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { shoppingCartList } = this.state;
        const { user, discount, getDiscount } = this.props;
        const data = {
          user: values,
          shoppingCartList,
          message: values.message,
          discount,
          total: formatMoney(
            getTotalMoney(shoppingCartList, discount && discount.rate)
          )
        };

        callAPI('Checkout/SaveInVoice', '', 'POST', data).then(res => {
          if (res.data) {
            this.setState({ shoppingCartList: [] });
            updateShoppingCart('', user, this.props.updateShoppingCart);
            getDiscount(null);

            notification.info({
              message: 'Thanh toán thành công!',
              placement: 'topRight',
              onClick: () => notification.destroy(),
              duration: time.durationNotification,
            });            
          } else {
            notification.warning({
              message: 'Thanh toán thất bại!',
              placement: 'topRight',
              onClick: () => notification.destroy(),
              duration: time.durationNotification,
            });
          }
        });
      }
    });
  };

  render() {
    const { shoppingCartList, transportFee } = this.state;
    const { user, form, discount, getDiscount } = this.props;

    return (
      <PageContainer>
        {shoppingCartList.length > 0 ? (
          <Row gutter={32}>
            <Form onSubmit={this.onSubmit}>
              <Col xs={24} sm={12} md={14}>
                <Section>
                  <SmallTitle>Thông tin giao hàng</SmallTitle>
                  <InvoiceInfo user={user} form={form} getTransportFee={this.getTransportFee} />
                </Section>
                <Section>
                  <SmallTitle>Phương thức thanh toán</SmallTitle>
                  <PaymentMethod />
                </Section>
              </Col>
              <Col xs={24} sm={12} md={10}>
                <Section>
                  <SmallTitle>Chi tiết đơn hàng</SmallTitle>
                  <CartInfo shoppingCartList={shoppingCartList} discount={discount} getDiscount={getDiscount} transportFee={transportFee} />
                </Section>
              </Col>
            </Form>
          </Row>
        ) : (
          <Section>
            <SectionTitle content="Thanh toán" />
            <Fragment>
              <span>Không có sản phẩm nào để thanh toán.</span>
              <NavLink to="/">
                <BackButton>
                  <Link content="Về trang chủ" iconType="fas fa-chevron-left" />
                </BackButton>
              </NavLink>
            </Fragment>
          </Section>
        )}
      </PageContainer>
    );
  }
}

export default Form.create({ name: 'CheckoutPage' })(CheckoutPage);
