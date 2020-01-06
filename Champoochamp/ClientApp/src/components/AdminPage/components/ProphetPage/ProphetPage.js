import React, { Component } from 'react';
import { port } from "../../../../shared/constants";

class ProphetPage extends Component {
  getIframelyHtml = () => {
    return {
      __html: `<iframe src=${port.prophetPort} width=100% height="900px"></iframe>`
    }
  }

  render() {
    return (
      <div>
        <div dangerouslySetInnerHTML={this.getIframelyHtml()} />
      </div>
    );
  }
}

export default ProphetPage;
