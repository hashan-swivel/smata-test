import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import store from '../../src/utils/store';
import Home from '../../pages/index';

const mountComponent = () => {
  const mockStore = store({});

  return shallow(
    <Provider store={mockStore}>
      <Home />
    </Provider>
  );
};

describe('Home component', () => {
  it('should render', () => {
    const component = mountComponent();
    expect(component.length).toEqual(1);
  });

  // TODO: this test is breaking because of Tooltip library
  // Snapshot
  // it("renders correctly", () => {
  //   const tree = renderer.create(mountComponent()).toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});
