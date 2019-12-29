import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col } from 'antd';
import styled from '@emotion/styled';

import { colors, breakpoint, typography } from '../../shared/principles';
import { AwesomeIcon } from '../elements';

const Wrapper = styled('footer')`
  background: ${colors.offWhite};
  justify-content: center;
  width: 100%;
`;

const FooterInner = styled('div')`
  align-items: center;
  display: flex;
  height: 80px;
  justify-content: center;
  margin: 0 auto;
  max-width: 1400px;
  text-align: center;
  width: 90%;

  i {
    color: ${colors.black};
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ItemLink = styled('a')`
  color: ${colors.black};
  display: ${({ isIcon }) => (isIcon ? 'inline-block' : 'block')};
  margin-right: 15px;
  text-decoration: none;

  &:hover {
    color: ${colors.black};
    text-decoration: underline;
  }
`;

const CopyRight = styled('div')`
  ${typography.xsTitle};
`;

class Footer extends Component {
  render() {
    return (
      <Wrapper>
        <FooterInner>
          <div>
            <CopyRight>Champoochamp &copy; 2019</CopyRight>
            <div>
              <ItemLink
                isIcon
                href="https://www.facebook.com/champoochamp.clothing/"
                target="_blank"
              >
                <AwesomeIcon type="fab fa-facebook" />
                /champoochamp.clothing
              </ItemLink>
              <ItemLink
                isIcon
                href="https://www.instagram.com/champoochamp/"
                target="_blank"
              >
                <AwesomeIcon type="fab fa-instagram" />
                /champoochamp
              </ItemLink>
            </div>
          </div>
        </FooterInner>
      </Wrapper>
    );
  }
}

export default Footer;
