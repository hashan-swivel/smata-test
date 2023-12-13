import { useState } from 'react';
import Router from 'next/router';
import AsyncSelect from 'react-select/async';
import { defaultTheme } from 'react-select';
import { debounce } from 'lodash';
import { axiosInstance } from '../../../utils';
import { locationConstants } from '../../../constants';
import { flashActions } from '../../../actions';

import './Navbar.module.scss';

const { colors } = defaultTheme;

const selectStyles = {
  control: (provided) => ({
    ...provided,
    minWidth: 400,
    margin: 8
  }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' })
};

export const LocationDropdown = ({ dispatch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOnChange = (selected) => {
    setIsOpen(false);
    Router.push({ pathname: '/building-profile', query: { id: selected?.site_plan_id } });
  };

  const loadBuildings = (inputValue, callback) => {
    const params = {
      q: inputValue,
      page: 1,
      per_page: 10
    };

    axiosInstance
      .get(locationConstants.BASE_PATH, { params })
      .then((res) => {
        callback(res.data);
      })
      .catch((error) => {
        dispatch(flashActions.showError(error));
        callback([]);
      });
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      target={
        <button
          type='button'
          className='locations-dropdown-button'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Buildings
          <ChevronDown />
        </button>
      }
    >
      <AsyncSelect
        autoFocus
        defaultOptions
        backspaceRemovesValue={false}
        loadOptions={debounce(loadBuildings, 1000)}
        components={{ DropdownIndicator, IndicatorSeparator: null }}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        isClearable={false}
        menuIsOpen
        onChange={handleOnChange}
        placeholder='Search...'
        styles={selectStyles}
        tabSelectsValue={false}
      />
    </Dropdown>
  );
};

// styled components

const Menu = (props) => {
  const shadow = 'hsla(218, 50%, 10%, 0.1)';
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        marginTop: 8,
        position: 'absolute',
        zIndex: 2
      }}
      {...props}
    />
  );
};

const Blanket = (props) => (
  <div
    style={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1
    }}
    {...props}
  />
);

const Dropdown = ({ children, isOpen, target, onClose }) => (
  <div style={{ position: 'relative' }}>
    {target}
    {isOpen ? <Menu>{children}</Menu> : null}
    {isOpen ? <Blanket onClick={onClose} /> : null}
  </div>
);

const Svg = (p) => (
  <svg width='24' height='24' viewBox='0 0 24 24' focusable='false' role='presentation' {...p} />
);

const DropdownIndicator = () => (
  <div style={{ color: colors.neutral20, height: 24, width: 32 }}>
    <Svg>
      <path
        d='M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z'
        fill='currentColor'
        fillRule='evenodd'
      />
    </Svg>
  </div>
);

const ChevronDown = () => (
  <Svg style={{ marginRight: -6 }}>
    <path
      d='M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z'
      fill='currentColor'
      fillRule='evenodd'
    />
  </Svg>
);

// export default LocationDropdown;
