import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Icon } from 'antd';
import { Button } from '@liquid-state/ui-kit';

class ChangePasswordForm extends React.Component {
  state = {
    isDirty: false,
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.props.onSubmit(Object.assign({}, values));
      }
    });
  }

  validatePasswordRules = (rule, value, callback) => {
    if (!value) {
      callback();
    }
    if (value.length < 8) {
      callback('Your password must be at least 8 characters in length');
    } else if (!new RegExp(/[A-Z]/).test(value)) {
      callback('Your password must contain at least one uppercase letter');
    } else if (!new RegExp(/[a-z]/).test(value)) {
      callback('Your password must contain at least one lowercase letter');
    } else if (!new RegExp(/[0-9]/).test(value)) {
      callback('Your password must contain at least one number');
    }
    callback();
  }

  validateWithConfirmPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.isDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('The passwords that you have entered do not match!');
    } else {
      callback();
    }
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ isDirty: this.state.isDirty || !!value });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: 'Your new password cannot be empty.' },
              { validator: this.validateWithConfirmPassword },
              { validator: this.validatePasswordRules },
            ],
          })(<Input
            placeholder="Enter new password"
            prefix={<Icon type="lock" />}
            type="password"
          />)}
        </Form.Item>
        <Form.Item hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: 'Please confirm your password.' },
              { validator: this.compareToFirstPassword },
            ],
          })(<Input
            placeholder="Confirm your new password"
            prefix={<Icon type="lock" />}
            type="password"
            onBlur={this.handleConfirmBlur}
          />)}
        </Form.Item>
        <Form.Item>
          <Button type="inverted" stretched htmlType="submit">
            CONTINUE
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

ChangePasswordForm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form.create()(ChangePasswordForm);
