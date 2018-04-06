import React from 'react';
import { Layout } from 'antd';
import { Switch } from 'react-router-dom';
import { Route } from '../../routing';
import './style.css';

import Login from '../Login';
import Recovery from '../Recovery';

export default () => (
  <Layout>
    <Layout.Content>
      <Switch>
        <Route path="/recovery/:number" component={Recovery} />
        <Route path="/" component={Login} />
      </Switch>
    </Layout.Content>
  </Layout>
);
