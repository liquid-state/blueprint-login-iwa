import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginSubmitted } from '../../redux/actions';
import { Link } from '../../routing';
import Container from '../../components/Container';
import TopTitle from '../../components/TopTitle';
import Form from './LoginForm';

export const Login = props => (
  <Container>
    <TopTitle black="LOG" green="-IN" />
    <p className="text-center">
      Please login below. If you are not already registered,
      <Link to="/"> register here</Link>.
    </p>
    <Form onSubmit={props.onSubmit} error={props.error} />
  </Container>
);

Login.propTypes = {
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

Login.defaultProps = {
  error: null,
};

const mapState = state => ({
  error: state.login.error,
});

const actions = {
  onSubmit: loginSubmitted,
};

export default connect(mapState, actions)(Login);
