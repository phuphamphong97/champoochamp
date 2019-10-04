import React, { Component } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";

import COLORS from "../../../shared/color";

const Line = styled("hr")`
  border: none;
  background: ${COLORS.GRAY};
  height: 1px;
`;

class Divider extends Component {
  render() {
    const { vertical } = this.props;

    return <Line vertical={vertical}></Line>;
  }
}

Divider.propsTypes = {
  vertical: PropTypes.bool
};

export default Divider;
