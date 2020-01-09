import { css } from '@emotion/core';
import { colors, breakpoint } from '../principles';

const menuStyle = mode => css`
  border: none;
  display: inline-block;
  vertical-align: middle;

  .ant-menu-submenu {
    border-bottom: ${mode === 'horizontal'
      ? '3px solid transparent'
      : `1px solid ${colors.lightGray}`};

    &:active,
    &:focus,
    &:hover {
      ${mode === 'horizontal'
        ? `border-bottom: 3px solid ${colors.black};`
        : `background: ${colors.lightGray}`};
      outline: none;
    }

    .ant-menu-submenu-title {
      padding: 0 15px !important;

      &:active,
      &:focus,
      &:hover {
        background: none;
        border: none;
        outline: none;
      }

      .ant-menu-submenu-arrow {
        display: none;
      }
    }
  }

  ${breakpoint.lg`
    ${mode === 'horizontal' && 'display: none'};
  `}
`;

const menuItemStyle = css`
  background: none !important;

  &:active,
  &:focus,
  &:hover {
    background: ${colors.lightGray} !important;
    border: none;
    outline: none;
  }

  &:after {
    display: none;
  }

  a {
    color: ${colors.darkGray};

    &:hover {
      color: ${colors.black};
    }
  }
`;

export { menuStyle, menuItemStyle };
