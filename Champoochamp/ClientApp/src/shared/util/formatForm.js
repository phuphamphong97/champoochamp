import { css } from '@emotion/core';
import { colors } from '../principles';

const formatForm = css`
  .ant-form-item {
    margin-bottom: 15px;
  }

  .ant-input,
  .ant-select-selection {
    border-color: ${colors.gray};
    border-radius: 0;
    color: ${colors.black};
    height: 40px;
    transition: all 0.2s;

    &:active,
    &:focus,
    &:hover {
      border-color: ${colors.black};
      box-shadow: none;
    }
  }

  .ant-select-selection__rendered {
    line-height: 40px;
  }

  .ant-form-explain {
    color: ${colors.black};
    margin-top: 5px;
  }

  .has-error .ant-input:not([disabled]):hover {
    border-color: ${colors.black};
  }
`;

export default formatForm;
