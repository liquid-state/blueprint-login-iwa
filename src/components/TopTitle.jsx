import React from 'react';
import PropTypes from 'prop-types';

const TopTitle = props => (
  <div className="top-title">
    <h1>
      <span className="black">{props.black}</span>
      <span className="green">{props.green}</span>
    </h1>
  </div>
);

TopTitle.propTypes = {
  black: PropTypes.string.isRequired,
  green: PropTypes.string.isRequired,
};

export default TopTitle;
