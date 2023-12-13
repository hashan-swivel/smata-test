import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { PassToUser } from '../../../../src/components/v1/DMS/InvoiceView';
import renderer from 'react-test-renderer';
import store from '../../../../src/utils/store';
import { authMock, buildingProfileMock, invoiceMock } from '../../../../__mocks__';

let subject;

const initialState = {
  form: {
    passToUser: {
      values: {},
      onSubmit: jest.fn()
    }
  }
};

let props = {
  approveAndGoToNext: jest.fn(),
  closeModal: jest.fn(),
  currentUser: authMock.currentUser,
  externalApprovers: [],
  firstApprover: authMock.currentUser,
  handleSubmit: jest.fn(),
  id: invoiceMock.id,
  inProcess: true,
  internalApprovers: invoiceMock.approvers,
  isWithCurrentUser: true,
  nextInvoice: null,
  onSubmit: jest.fn(),
  overrideApprove: jest.fn(),
  reloadInvoice: jest.fn(),
  rowItems: invoiceMock.rowItems,
  setKeepDropdownOpen: jest.fn(),
  spNumber: buildingProfileMock.spNumber,
  status: invoiceMock.status
};

const mountComponent = (props, state = initialState) => {
  const mockStore = store(state);

  const component = shallow(
    <PassToUser {...props} store={mockStore}>
      <button
        type='button'
        className='button pass-to-user-button'
        onClick={() => props.approveAndGoToNext()}
      >
        Pass to user
      </button>
      {props.inProcess && (
        <button
          type='button'
          className='button override-approve-button'
          onClick={() => props.overrideApprove()}
        >
          Override & Approve
        </button>
      )}
    </PassToUser>
  );

  return component.dive({ context: { store } }).dive();
};

describe('PassToUser modal', () => {
  // Interactions
  describe('Strata managers', () => {
    it('can click the Pass to user button', () => {
      const subject = mountComponent(props);
      const target = 'button.pass-to-user-button';
      subject.find(target).simulate('click');
      expect(props.approveAndGoToNext).toHaveBeenCalledTimes(1);
    });

    it('can click the Override & Approve button', () => {
      const subject = mountComponent(props);
      const target = 'button.override-approve-button';

      subject.find(target).simulate('click');
      expect(props.overrideApprove).toHaveBeenCalledTimes(1);
    });
  });

  // Snapshot
  it('renders correctly', () => {
    const tree = renderer.create(subject).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// TODO:
// - Test API requests get fired. Ex.:

// const url = `/v1/building_profile/${props.spNumber}/approver_status?invoice_id=${props.id}&user_id=${authMock.currentUser.id}&approved=true`;
// mockAxios.mockResponseFor({ url }, { data: {} });
//
// await expect(mockAxios.put).toHaveBeenCalledWith(url);

// const urlApprove = `/v1/building_profile/${props.spNumber}/approver_status?invoice_id=${props.id}&user_id=${authMock.currentUser.id}`;
// const urlOverride = `/v1/documents/${props.id}/action_accomplished`;
// mockAxios.mockResponseFor({ urlApprove }, { data: {} });
// mockAxios.mocResponseFor({ urlOverride }, { data: {} });
//
// await expect(mockAxios.put).toHaveBeenCalledWith(urlApprove);
// await expect(mockAxios.put).toHaveBeenCalledWith(urlOverride);
