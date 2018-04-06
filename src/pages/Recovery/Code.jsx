import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Pager } from '@liquid-state/ui-kit';
import { Form, Input, Icon, Alert } from 'antd';
import { passwordResetCodeSubmitted } from '../../redux/actions';
import BottomContainer from '../../components/BottomContainer';

const FormItem = Form.Item;

class Code extends Component {
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
          Please enter your six digit code below
        </p>
        <Form onSubmit={this.handleSubmit}>
          {
            this.getError()
          }
          <FormItem hasFeedback>
            {
              getFieldDecorator('code', {
                rules: [
                  { required: true, message: 'A code is required to continue.' },
                  { len: 6, message: 'Your code should be exactly 6 digits.' },
                ],
              })(<Input placeholder="Enter your 6 digit code" prefix={<Icon type="lock" />} type="text" />)
            }
          </FormItem>
          <FormItem style={{ marginTop: 'auto' }}>
            <Button type="inverted" stretched htmlType="submit" onClick={this.handleSubmit}>
              SUBMIT CODE
            </Button>
          </FormItem>
        </Form>
        <BottomContainer>
          <Pager
            steps={3}
            current={1}
            hideRightArrow
            hideLeftArrow
          />
        </BottomContainer>
      </Fragment>
    );
  }
}

const actions = {
  onSubmit: passwordResetCodeSubmitted,
};

const mapStateToProps = state => ({
  error: state.passwordReset.error,
});

export const RecoveryCode = Form.create()(Code);

export default connect(mapStateToProps, actions)(RecoveryCode);
