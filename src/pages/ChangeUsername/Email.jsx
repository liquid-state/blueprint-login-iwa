import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Icon, Alert } from 'antd';
import { Button } from '@liquid-state/ui-kit';

const FormItem = Form.Item;

class Email extends Component {
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

  validateWithConfirmPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('email')) {
      callback('The email address that you have entered are inconsistent!');
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
          Please enter your new email below
        </p>

        <Form onSubmit={this.handleSubmit}>
          {
            this.getError()
          }
          <FormItem hasFeedback>
            {
              getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'New email address is required!' },
                  { type: 'email', message: 'Please enter a valid email address!' },
                  { validator: this.validateWithConfirmEmail },
                ],
              })(<Input placeholder="Enter new email address" prefix={<Icon type="user" />} />)
            }
          </FormItem>

          <FormItem hasFeedback>
            {
              getFieldDecorator('confirm', {
                rules: [
                  { required: true, message: 'Please confirm your new email address' },
                  { type: 'email', message: 'Please enter a valid email address!' },
                  { validator: this.compareToFirstPassword },
                ],
              })(<Input placeholder="Repeat your new email address" prefix={<Icon type="user" />} onBlur={this.handleConfirmBlur} />)
            }
          </FormItem>

          <FormItem>
            <Button type="inverted" stretched htmlType="submit" onClick={this.handleSubmit}>
              SUBMIT EMAIL
            </Button>
          </FormItem>
        </Form>
      </Fragment>
    );
  }
}

export default Form.create()(Email);
