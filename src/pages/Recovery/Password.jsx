import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Pager } from '@liquid-state/ui-kit';
import { Form, Input, Icon, Alert } from 'antd';
import { passwordResetPasswordSubmitted } from '../../redux/actions';
import BottomContainer from '../../components/BottomContainer';

const FormItem = Form.Item;

class Password extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
  }

  static defaultProps = {
    error: undefined,
  }

  state = {
    confirmDirty: false,
  };

  getError() {
    return this.props.error ? <Alert message={this.props.error} type="error" showIcon /> : null;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.props.onSubmit(Object.assign({}, values));
      }
    });
  };

  validateWithConfirmPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('The passwords that you have entered are inconsistent!');
    } else {
      callback();
    }
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <p className="text-center">
          Please enter your new password below
        </p>

        <Form onSubmit={this.handleSubmit}>
          {
            this.getError()
          }
          <FormItem hasFeedback>
            {
              getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'New password is required!' },
                  { validator: this.validateWithConfirmPassword },
                ],
              })(<Input placeholder="Enter new password" prefix={<Icon type="lock" />} type="password" />)
            }
          </FormItem>

          <FormItem hasFeedback>
            {
              getFieldDecorator('confirm', {
                rules: [
                  { required: true, message: 'Please confirm your password' },
                  { validator: this.compareToFirstPassword },
                ],
              })(<Input type="password" placeholder="Repeat your password" prefix={<Icon type="lock" />} onBlur={this.handleConfirmBlur} />)
            }
          </FormItem>

          <FormItem>
            <Button type="inverted" stretched htmlType="submit" onClick={this.handleSubmit}>
              RESET PASSWORD
            </Button>
          </FormItem>
        </Form>
        <BottomContainer>
          <Pager
            steps={3}
            current={2}
            hideRightArrow
            hideLeftArrow
          />
        </BottomContainer>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  error: state.passwordReset.error,
});

const actions = {
  onSubmit: passwordResetPasswordSubmitted,
};

export const RecoveryPassword = Form.create()(Password);

export default connect(mapStateToProps, actions)(RecoveryPassword);
