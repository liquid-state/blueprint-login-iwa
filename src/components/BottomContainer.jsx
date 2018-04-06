import React from 'react';
import PropTypes from 'prop-types';

const BottomContainer = (props) => {
  const { children, className } = props;

  return (
    <div className={`bottom-container ${className}`}>
      { children }
    </div>
  );
};

BottomContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

BottomContainer.defaultProps = {
  className: '',
};

export default BottomContainer;
