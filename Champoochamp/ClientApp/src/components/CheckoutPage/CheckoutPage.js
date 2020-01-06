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
import { localStorageKey, time, ghtk, champoochampInfo } from '../../shared/constants';
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
      isInitedFrom: false,
      isShoppingCartChanged: false,
      strShoppingCart: props.strShoppingCart,
      shoppingCartList: [],
      transportFee: 0
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.strShoppingCart !== prevState.strShoppingCart) {
      return {
        strShoppingCart: nextProps.strShoppingCart,
        isShoppingCartChanged: true
      };
    }

    return null;
  }

  componentDidUpdate() {
    const { isShoppingCartChanged } = this.state;
    const { user } = this.props;
    isShoppingCartChanged && this.getShoppingCart(user);
  }

  componentDidMount() {
    this.getShoppingCart(this.props.user);
  }

  getShoppingCart = user => {   
    const data = {
      email: user && user.email,
      shoppingCarts: `${localStorage.getItem(localStorageKey.storageShoppingCartKey)}`
    };

    callAPI('Cart/GetShoppingCart', '', 'POST', data).then(res =>
      this.setState({
        isInitedFrom: true,
        shoppingCartList: res.data,
        isShoppingCartChanged: false
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
        const { shoppingCartList, transportFee } = this.state;
        const { user, discount, getDiscount } = this.props;
        const data = {
          user: values,
          shoppingCartList,
          message: values.message,
          discount,
          total: formatMoney(
            getTotalMoney(shoppingCartList, discount && discount.rate), true
          ),
          shipMoney: formatMoney(transportFee, true)
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

            const ghtkData = {
              token: ghtk.token,
              order: {
                id: res.data.id,
                pick_name: champoochampInfo.name,
                pick_money: data.total,
                pick_address: champoochampInfo.address,
                pick_province: champoochampInfo.province,
                pick_district: champoochampInfo.district,
                pick_tel: champoochampInfo.phone,
                name: values.name,
                address: values.address,
                province: values.province,
                district: values.district,
                tel: values.phone,
                email: values.email,
                return_name: champoochampInfo.name,
                return_address: champoochampInfo.address,
                return_province: champoochampInfo.province,
                return_district: champoochampInfo.district,
                return_tel: champoochampInfo.tel,
                return_email: champoochampInfo.email,
              }
            };

            callAPI(`${apiOrder.apiOrder}`, 'POST', ghtkData).then(res => {
              if (res.data) {

              }
              else {

              }
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
    const { isInitedFrom, shoppingCartList, transportFee } = this.state;
    const { user, form, discount, getDiscount } = this.props;

    return (
      <PageContainer>
        {
          !isInitedFrom ? null :
          shoppingCartList.length > 0 ? (
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
          )
        }        
      </PageContainer>
    );
  }
}

export default Form.create({ name: 'CheckoutPage' })(CheckoutPage);
