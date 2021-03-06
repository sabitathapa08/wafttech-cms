/**
 *
 * Select
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const SelectWrapper = props => {
  return <Select {...props} />;
};

SelectWrapper.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.object,
    }),
  ).isRequired,
};

export default SelectWrapper;
