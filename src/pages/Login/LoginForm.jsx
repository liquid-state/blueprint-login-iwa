import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Icon, Alert } from 'antd';
import { Button } from '@liquid-state/ui-kit';
import { Link } from '../../routing';

const FormItem = Form.Item;

class LoginForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
  }

  static defaultProps = {
    error: undefined,
  }

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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        {
          this.getError()
        }

        <FormItem hasFeedback>
          {
            getFieldDecorator('username', {
              rules: [
                { required: true, message: 'An email address is required, this will be your username for the app.' },
                { type: 'email', message: 'Please enter a valid email address' },
              ],
            })(<Input placeholder="Enter your email address" prefix={<Icon type="user" />} type="email" />)
          }
        </FormItem>

        <FormItem hasFeedback>
          {
            getFieldDecorator('password', {
              rules: [
                { required: true, message: 'A password is required!' },
              ],
            })(<Input placeholder="Enter a password" prefix={<Icon type="lock" />} type="password" />)
          }
        </FormItem>

        <div className="text-center">
          <p>
            <Link to="/recovery/1">
              I forgot my password
            </Link>
          </p>
        </div>
        <FormItem>
          <Button type="inverted" stretched htmlType="submit" onClick={this.handleSubmit}>
            SIGN-IN
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(LoginForm);
