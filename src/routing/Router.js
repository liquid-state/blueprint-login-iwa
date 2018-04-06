import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ConnectedRouter as ReactRouter } from 'react-router-redux';

class Router extends Component {
  static childContextTypes = {
    iwaRouter: PropTypes.object,
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  }

  getChildContext() {
    return {
      iwaRouter: this.props.router,
    };
  }

  render() {
    return (
      <ReactRouter history={this.props.history}>
        {this.props.children}
      </ReactRouter>
    );
  }
}

export default Router;
