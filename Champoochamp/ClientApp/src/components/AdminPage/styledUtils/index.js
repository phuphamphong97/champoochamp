import { Button } from 'antd';
import styled from '@emotion/styled';

const ButtonsWrapper = styled('div')`
  margin-bottom: 10px;
  text-align: right;
`;

const ActionButton = styled(Button)`
  margin-left: 5px;
`;

const LinkButton = styled(Button)`
  padding: 0;

  &:hover {
    text-decoration: underline !important;
  }
`;

export { ButtonsWrapper, ActionButton, LinkButton };
