import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginChangePasswordSubmitted } from '../../redux/actions';
import Form from './ChangePasswordForm';
import Container from '../../components/Container';
import TopTitle from '../../components/TopTitle';

export const ChangePassword = ({ onSubmit }) => (
  <Container>
    <TopTitle black="CHANGE" green="-PASSWORD" />
    <p className="text-center">
      You must change your password before continuing,
      change you password below to finish logging in.
    </p>

    <Form onSubmit={onSubmit} />
  </Container>
);

ChangePassword.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

const actions = {
  onSubmit: loginChangePasswordSubmitted,
};

export default connect(null, actions)(ChangePassword);
