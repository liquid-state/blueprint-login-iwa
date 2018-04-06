import React from 'react';
import PropTypes from 'prop-types';

const Container = (props) => {
  const { children, className } = props;
  return (
    <div className={`container ${className}`}>
      { children }
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Container.defaultProps = {
  children: null,
  className: '',
};

export default Container;
