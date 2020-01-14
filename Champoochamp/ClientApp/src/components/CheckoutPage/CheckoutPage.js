import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Modal, Spin, Row, Col, Form, notification } from 'antd';
import styled from '@emotion/styled';

import {
  callAPI,
  callghtkAPI,
  formatMoney,
  getTotalMoney,
  updateShoppingCart
} from '../../shared/util';
import { localStorageKey, time, ghtk, champoochampInfo, paymentMethod } from '../../shared/constants';
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
      isOrdering: false,
      visible: false,
      isShoppingCartChanged: false,
      strShoppingCart: props.strShoppingCart,
      shoppingCartList: [],
      paymentMethods: paymentMethod.cod,
      transportFee: 0,
      ghtkResponse: null
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

  getPaymentMethod = method => {
    this.setState({ paymentMethods: method });
  }

  getTransportFee = transportFee => {
    this.setState({ transportFee })
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { shoppingCartList, paymentMethods, transportFee } = this.state;
        const { user, discount, getDiscount } = this.props;
        const data = {
          user: values,
          shoppingCartList,
          invoice: {
            message: values.message,
            total: formatMoney(
              getTotalMoney(shoppingCartList, discount && discount.rate), false
            ),
            shipMoney: formatMoney(transportFee, false),
            paymentMethod: paymentMethods
          },          
          discount    
        };

        this.setState({ isOrdering: true });
        callAPI('Checkout/SaveInVoice', '', 'POST', data).then(res => {
          if (res.data) {
            this.setState({
              isOrdering: false,
              shoppingCartList: []
            });
            updateShoppingCart('', user, this.props.updateShoppingCart);
            getDiscount(null);

            const ghtkData = {
              token: ghtk.token,
              order: {
                id: res.data.id - 80000,
                pick_name: champoochampInfo.name,
                pick_money: paymentMethods === paymentMethod.cod ? res.data.total : 0,
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
                return_tel: champoochampInfo.phone,
                return_email: champoochampInfo.email,
                is_freeship: paymentMethods === paymentMethod.cod ? 0 : 1
              }
            };
            const ghtkResponse = {
              res: null,
              invoice: {
                id: res.data.id,
                total: res.data.total,
                status: "Lỗi đặt hàng"
              }              
            };

            callghtkAPI(`${ghtk.apiOrder}`, 'POST', ghtkData).then(res => {
              if (res && res.data) {
                ghtkResponse.res = res.data;
                this.setState({ ghtkResponse }, () => this.showModal());                
              }
              else {
                callAPI('Checkout/UpdateErrorInVoice', '', 'POST', ghtkResponse.invoice).then(res => {
                  if (res.data) {
                    this.setState({ ghtkResponse }, () => this.showModal());
                  }
                  else {
                    notification.warning({
                      message: 'Đặt hàng thất bại!',
                      placement: 'topRight',
                      onClick: () => notification.destroy(),
                      duration: time.durationNotification,
                    });
                  }
                });
              }
            });
          }
          else {
            notification.warning({
              message: 'Đặt hàng thất bại!',
              placement: 'topRight',
              onClick: () => notification.destroy(),
              duration: time.durationNotification,
            });
          }
        });
      }
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    }, () => this.props.history.push('/'));
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { isInitedFrom, isOrdering, visible, ghtkResponse, shoppingCartList, transportFee } = this.state;
    const { user, form, discount, getDiscount } = this.props;

    return (
      <PageContainer>
        {
          !isInitedFrom || isOrdering ? <Spin /> :
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
                    <PaymentMethod getPaymentMethod={this.getPaymentMethod}/>
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
        <Modal
          title="Đặt hàng thành công"
          visible={visible}
          onOk={this.handleOk}
          okText="Về trang chủ"
          onCancel={this.handleCancel}
          cancelText="Hủy"
        >
          <p>Mã hóa đơn: {ghtkResponse && ghtkResponse.invoice.id}</p>
          <p>Tổng tiền: {ghtkResponse && formatMoney(ghtkResponse.invoice.total, true)}đ</p>
          {
            ghtkResponse && ghtkResponse.res && ghtkResponse.res.order && (
              <p>Thời gian dự kiến giao hàng: {ghtkResponse.res.order.estimated_deliver_time}</p>
            )
          }
        </Modal>
      </PageContainer>
    );
  }
}

export default Form.create({ name: 'CheckoutPage' })(CheckoutPage);
