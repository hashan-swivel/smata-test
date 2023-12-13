import React from 'react';
import mockAxios from 'jest-mock-axios';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import InvoicePreview from '../../pages/invoice';
import { PassToUser } from '../../src/components/v1/DMS/InvoiceView/PassToUser';
import store from '../../src/utils/store';
import {
  authMock,
  buildingProfileMock,
  invoiceMock,
  initialStateMock,
  sitePlansMock
} from '../../__mocks__';

let mockStore;
let subject;

const initialState = {
  ...initialStateMock,
  auth: authMock,
  form: {
    invoiceForm: {
      values: {}
    }
  }
};

const props = {
  approveAndGoToNext: jest.fn(),
  anyTouched: jest.fn(),
  docID: 312752,
  overrideApprove: jest.fn(),
  submitFailed: jest.fn()
};

describe('InvoicePreview page', () => {
  mockStore = store(initialState);

  beforeEach(() => {
    subject = mount(
      <Provider store={mockStore}>
        <InvoicePreview {...props} />
      </Provider>
    );
  });

  afterEach(() => {
    mockAxios.reset();
  });

  // API / State
  it('mounts with mocked props', () => {
    expect(subject.find(InvoicePreview).prop('anyTouched')).toEqual(props.anyTouched);
    expect(subject.find(InvoicePreview).prop('docID')).toEqual(props.docID);
    expect(subject.find(InvoicePreview).prop('submitFailed')).toEqual(props.submitFailed);
  });

  describe('Fetches data from the API & updates state', () => {
    it('for the current invoice', async () => {
      const docID = subject.find(InvoicePreview).prop('docID');
      const url = `/v1/documents/${docID}`;
      mockAxios.mockResponseFor({ url }, { data: invoiceMock });

      await expect(mockAxios.get).toHaveBeenCalledWith(url);
      await expect(mockStore.getState().dms.currentDocument).toEqual(invoiceMock);
    });

    it('for the building profile', async () => {
      const spNumber = mockStore.getState().dms.currentDocument.sp_number;
      const url = `/v1/building_profile/${spNumber}`;
      mockAxios.mockResponseFor({ url }, { data: buildingProfileMock });

      await expect(mockAxios.get).toHaveBeenCalledWith(url);
      await expect(mockStore.getState().buildingProfile.building).toEqual(buildingProfileMock);
    });

    it('for site plan numbers', async () => {
      const url = '/v1/building_profile/site_plans?active=true&organisation_id=1';
      mockAxios.mockResponseFor({ url }, { data: sitePlansMock });

      await expect(mockAxios.get).toHaveBeenCalledWith(url);
    });
  });

  // Snapshot
  it('renders correctly', () => {
    const tree = renderer.create(subject).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
