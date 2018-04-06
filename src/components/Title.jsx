import React from 'react';
import PropTypes from 'prop-types';

const Title = (props) => {
  const { className, children } = props;

  return (
    <h2 className={`title ${className}`}>{children}</h2>
  );
};

Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Title.defaultProps = {
  className: '',
};

export default Title;
