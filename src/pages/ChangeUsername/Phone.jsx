import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Alert, Icon } from 'antd';
import { MediaButton, Button } from '@liquid-state/ui-kit';

const FormItem = Form.Item;

class Phone extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
  };

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
        <p>
          Please contact support on
          <span className="theme-color">0728372093</span>
          to recive your email recovery code and enter it below.
        </p>

        <div className="center-children">
          <a href="tel:0728372093" style={{ width: '30%' }}>
            <MediaButton>
              <MediaButton.Icon type="phone" circle />
              <MediaButton.Text>CALL SUPPORT</MediaButton.Text>
            </MediaButton>
          </a>
        </div>

        <Form onSubmit={this.handleSubmit}>
          {
            this.getError()
          }
          <FormItem hasFeedback>
            {
              getFieldDecorator('code', {
                rules: [
                  {
                    len: 6, message: 'Your code must be 6 digits in length, please check you have entered your code correctly.',
                  },
                  {
                    required: true, message: 'Your code is required to continue.',
                  },
                ],
              })(<Input placeholder="Enter your recovery code" prefix={<Icon type="lock" />} />)
            }
          </FormItem>
          <FormItem>
            <Button type="inverted" stretched htmlType="submit" onClick={this.handleSubmit}>
              SUBMIT CODE
            </Button>
          </FormItem>
        </Form>
      </Fragment>
    );
  }
}

export default Form.create()(Phone);
