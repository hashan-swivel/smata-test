import React, { useState } from 'react';
import Select, { defaultTheme } from 'react-select';

import './Navbar.module.scss';

const { colors } = defaultTheme;

const selectStyles = {
  control: (provided) => ({
    ...provided,
    minWidth: 300,
    margin: 8
  }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' })
};

const internalLinks = [
  { value: 'location-contacts', label: 'Building Contacts' },
  { value: 'building-team-users', label: 'Building Managers' },
  { value: 'emergency-contacts', label: 'Contacts for Emergencies' },
  { value: 'excluded-contractors', label: 'Excluded Contractors' },
  { value: 'important-documents', label: 'Important Documents' },
  { value: 'building-rules', label: 'Job Rules' },
  { value: 'keyholder', label: 'Key Holder' },
  { value: 'location-notes', label: 'Notes' },
  { value: 'preferred-contractors', label: 'Preferred Contractors' },
  { value: 'price-limit', label: 'Price Limit' },
  { value: 'recent-works', label: 'Recent Works' }
];

export const ServiceDropdown = ({ user, currentBuilding }) => {
  const [isOpen, setIsOpen] = useState(false);

  const canAccessInternalService = user?.isSystemManager || user?.isTenantManager;

  const options = () => {
    let o = [];

    const location = currentBuilding.locations[0];
    const externalLinks = currentBuilding?.custom_building_services;

    if (user?.compare_connect?.url) {
      o.push({
        value: 'compare-your-bills',
        label: 'Compare your bills',
        url: user?.compare_connect?.url
      });
      o.push({ value: 'get-connected', label: 'Get connected', url: user?.compare_connect?.url });
    }

    if (canAccessInternalService) {
      o = o.concat([
        {
          label: 'INTERNAL LINKS',
          options: internalLinks.map((i) => ({
            ...i,
            url: `${user?.baseUrlWithNameSpace}/locations/${location.id}?tab=${i.value}`
          }))
        }
      ]);

      if (externalLinks.length > 0) {
        o = o.concat([
          {
            label: 'VISIBLE TO EXTERNAL USERS',
            options: externalLinks.map((i) => {
              if (i.document_type === 'link') {
                return { value: `${i.link}-${i.id}`, label: i.name, url: i.link };
              }

              return {
                value: `/document-preview?id=${i.attachment_id}-${i.id}`,
                label: i.name,
                url: `/document-preview?id=${i.attachment_id}`
              };
            })
          }
        ]);
      }
    }

    if (!canAccessInternalService && externalLinks.length > 0) {
      o = o.concat([
        {
          label: 'IMPORTANT LINKS',
          options: externalLinks.map((i) => {
            if (i.document_type === 'link') {
              return { value: `${i.link}-${i.id}`, label: i.name, url: i.link };
            }

            return {
              value: `/document-preview?id=${i.attachment_id}-${i.id}`,
              label: i.name,
              url: `/document-preview?id=${i.attachment_id}`
            };
          })
        }
      ]);
    }

    return o;
  };

  const handleOnChange = (selected) => {
    setIsOpen(false);
    window.open(selected.url, '_blank').focus();
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      target={
        <button
          type='button'
          className='services-dropdown-button'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Services
          <ChevronDown />
        </button>
      }
    >
      <Select
        autoFocus
        backspaceRemovesValue={false}
        components={{ DropdownIndicator, IndicatorSeparator: null }}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        isClearable={false}
        menuIsOpen
        onChange={handleOnChange}
        options={options()}
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
