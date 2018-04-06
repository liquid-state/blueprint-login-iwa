import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { Pager } from '@liquid-state/ui-kit';

import Container from '../../components/Container';
import BottomContainer from '../../components/BottomContainer';
import TopTitle from '../../components/TopTitle';

import Phone from './Phone';
import Email from './Email';

const ChangeUsername = props => (
  <Container>
    <TopTitle black="EMAIL" green="CHANGE" />

    <Switch>
      <Route path="/change-username/1" component={Phone} />
      <Route path="/change-username/2" component={Email} />
    </Switch>

    <BottomContainer>
      <Pager
        steps={2}
        current={props.match.params.number - 1}
        hideRightArrow
        hideLeftArrow
      />
    </BottomContainer>
  </Container>
);

ChangeUsername.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(ChangeUsername);
