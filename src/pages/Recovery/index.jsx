import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Container from '../../components/Container';
import TopTitle from '../../components/TopTitle';

import Email from './Email';
import Code from './Code';
import Password from './Password';

const Recovery = () => (
  <Container>
    <TopTitle black="PASSWORD" green="RECOVERY" />
    <Switch>
      <Route path="/recovery/1" component={Email} />
      <Route path="/recovery/2" component={Code} />
      <Route path="/recovery/3" component={Password} />
    </Switch>
  </Container>
);

export default Recovery;
