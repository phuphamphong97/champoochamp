import React, { Component } from 'react';
import { Form, Input, Checkbox, notification } from 'antd';
import styled from '@emotion/styled';

import { callAPI, formatForm, formatCheckbox, setCookie, getCookie } from '../../shared/util';
import { time, viewportWidth, localStorageKey } from '../../shared/constants';

import { PageContainer, Button, SectionTitle } from '../elements';

const Wrapper = styled('div')`
  ${formatForm};
  ${formatCheckbox};
  display: flex;
  height: 80vh;
`;

const LoginForm = styled(Form)`
  margin: auto;
  max-width: ${viewportWidth.sm}px;
  width: 100%;
`;

const LoginButton = styled(Button)`
  margin-bottom: 15px;
`;

class LoginAdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRemember: false
    };
    props.onRenderMenu(false);
  }

  componentDidMount() {
    const { onLoginAdmin } = this.props;
    const timeEmployeeSession = localStorage.getItem(localStorageKey.timeEmployeeSessionKey);
    if (timeEmployeeSession && new Date().getTime() - timeEmployeeSession < time.expiresDayOfSession * 24 * 60 * 60 * 1000) {
      onLoginAdmin(JSON.parse(localStorage.getItem(localStorageKey.employeeKey)));
    }
    else {
      const data = {
        userName: getCookie(localStorageKey.userNameAdminKey),
        password: getCookie(localStorageKey.passwordAdminKey)
      }

      callAPI('Employee/CheckLogin', '', 'POST', data).then(res => {
        if (res.data) {
          onLoginAdmin(res.data);
        }
      });
    }
    
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { isRemember } = this.state;
        const url = `Employee/CheckLogin`;
        callAPI(url, '', 'POST', values).then(res => {
          if (res.data) {
            this.props.onLoginAdmin(res.data);

            localStorage.setItem(localStorageKey.employeeKey, JSON.stringify(res.data));
            localStorage.setItem(localStorageKey.timeEmployeeSessionKey, new Date().getTime());
            if (isRemember) {
              setCookie(localStorageKey.userNameAdminKey, values.userName, 1);
              setCookie(localStorageKey.passwordAdminKey, values.password, 1);
            }

            notification.info({
              message: 'Đăng nhập thành công!',
              placement: 'topRight',
              onClick: () => notification.destroy(),
              duration: time.durationNotification
            });
          }
          else {
            notification.warning({
              message: 'Tài khoản hoặc mật khẩu không chính xác!',
              placement: 'topRight',
              onClick: () => notification.destroy(),
              duration: time.durationNotification
            });
          }
        });        
      }
    });
  }

  rememberMe = (e) => {
    this.setState({ isRemember: e.target.checked });
  };

  render() {
    const { employee, history } = this.props;
    const { getFieldDecorator } = this.props.form;
    employee && history.push(`/admin`);

    return (
      <PageContainer>
        <Wrapper>
          <LoginForm onSubmit={this.onSubmit}>
            <SectionTitle content="Đăng nhập" />
            <Form.Item>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Vui lòng nhập tài khoản!' }]
              })(<Input type="text" placeholder="Tài khoản" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Vui lòng nhập mật khẩu!' }]
              })(<Input type="password" placeholder="Mật khẩu" />)}
            </Form.Item>
            <Form.Item>
              <Checkbox onChange={this.rememberMe}>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <LoginButton title="Đăng nhập" htmlType="submit" isBlockButton />
          </LoginForm>
        </Wrapper>
      </PageContainer>
    );
  }
}

export default Form.create({ name: 'LoginAdminPage' })(LoginAdminPage);
