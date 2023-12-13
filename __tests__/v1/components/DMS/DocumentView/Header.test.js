import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { Header } from '../../../../src/components/v1/DMS/DocumentView';
import renderer from 'react-test-renderer';
import store from '../../../../src/utils/store';
import {
  authMock,
  buildingProfileMock,
  documentDetailsMock,
  invoiceHeaderProps,
  invoiceMock,
  initialStateMock,
  sitePlansMock
} from '../../../../__mocks__';

const initialState = {
  ...initialStateMock,
  auth: authMock,
  buildingProfile: {
    building: buildingProfileMock
  },
  dms: {
    currentDocument: invoiceMock
  },
  spNumbers: {
    orgSpNumbers: sitePlansMock
  }
};

const props = {
  ...invoiceHeaderProps,
  ...documentDetailsMock,
  status: 'under_review',
  lot: documentDetailsMock.lot,
  name: documentDetailsMock.name,
  toggleEditMode: jest.fn(),
  invoice: invoiceMock.invoice,
  buildingData: buildingProfileMock,
  buildingProfile: buildingProfileMock,
  ownerId: invoiceMock.owner_id,
  strataManager: buildingProfileMock.strata_manager,
  currentUser: authMock.currentUser,
  spList: sitePlansMock,
  sharedWith: documentDetailsMock.sharedWith,
  openModal: jest.fn(),
  setModalType: jest.fn(),
  setKeepDropdownOpen: jest.fn(),
  isInvoiceOverrider: true,
  isUnchangeableSourceType: false
};

const mountComponent = (props, state = initialState) => {
  const mockStore = store(state);

  return mount(
    <Provider store={mockStore}>
      <Header {...props} />
    </Provider>
  );
};

describe('InvoicePreview > Header', () => {
  describe('Approve invoice button', () => {
    const target = 'button.approve-invoice-button';

    it('will not render', () => {
      const subject = mountComponent({
        ...props,
        hasVoted: true,
        canVote: true,
        isWithCurrentUser: false
      });
      expect(subject.find(target).length).toEqual(0);
    });

    it('will render', () => {
      const subject = mountComponent({ ...props });

      expect(subject.find(target).length).toEqual(1);
    });

    it('can click', () => {
      const subject = mountComponent({ ...props });

      subject.find(target).simulate('click');
      expect(props.openModal).toHaveBeenCalledTimes(1);
      expect(props.setModalType).toHaveBeenCalledWith('approve');
    });
  });

  describe('override approve button', () => {
    const target = 'button.override-approve-button';

    it('will not render', () => {
      const subject = mountComponent({ ...props });
      expect(subject.find(target).length).toEqual(0);
    });

    it('will render', () => {
      const subject = mountComponent({
        ...props,
        hasVoted: true,
        canVote: true,
        isWithCurrentUser: false
      });

      expect(subject.find(target).length).toEqual(1);
    });

    it('can click', () => {
      const subject = mountComponent({
        ...props,
        hasVoted: true,
        canVote: true,
        isWithCurrentUser: false
      });

      subject.find(target).simulate('click');
      expect(props.openModal).toHaveBeenCalledTimes(1);
    });
  });

  // TODO: this test is breaking because of Tooltip library
  // Snapshot
  // it('renders correctly', () => {
  //   const subject = mountComponent({ ...props });
  //   const tree = renderer.create(subject).toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});
