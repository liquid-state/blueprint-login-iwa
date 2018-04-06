import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Pager } from '@liquid-state/ui-kit';
import { Form, Input, Icon, Alert } from 'antd';

import { passwordResetStarted } from '../../redux/actions';
import BottomContainer from '../../components/BottomContainer';

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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <p className="text-center">
          Please enter your email below to receive your recovery code.
        </p>
        <Form onSubmit={this.handleSubmit}>
          {
            this.getError()
          }
          <FormItem hasFeedback>
            {
              getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email', message: 'Please enter a valid email address',
                  },
                  {
                    required: true, message: 'Your email is required to continue',
                  },
                ],
              })(<Input placeholder="Enter your email address" prefix={<Icon type="user" />} type="email" />)
            }
          </FormItem>
          <FormItem>
            <Button type="inverted" stretched htmlType="submit" onClick={this.handleSubmit}>
              SEND CODE
            </Button>
          </FormItem>
        </Form>
        <BottomContainer>
          <Pager
            steps={3}
            current={0}
            hideLeftArrow
            hideRightArrow
          />
        </BottomContainer>
      </Fragment>
    );
  }
}

const actions = {
  onSubmit: passwordResetStarted,
};

export const RecoveryEmail = Form.create()(Email);

export default connect(null, actions)(RecoveryEmail);
