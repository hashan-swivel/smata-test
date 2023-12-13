import { SampleForm } from '@/components/organisms';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';

describe('SampleForm', () => {
  let nameInput: HTMLElement,
    emailInput: HTMLElement,
    phoneNumberInput: HTMLElement,
    genderSelect: HTMLElement,
    websiteInput: HTMLElement,
    submitButton: HTMLElement;

  beforeEach(() => {
    render(<SampleForm />);

    nameInput = screen.getByRole('textbox', { name: 'Name' });
    emailInput = screen.getByRole('textbox', { name: 'Email' });
    phoneNumberInput = screen.getByRole('textbox', { name: 'Phone' });
    genderSelect = screen.getByRole('combobox', { name: 'Gender' });
    websiteInput = screen.getByRole('textbox', { name: 'Website' });
    submitButton = screen.getByRole('button', { name: 'Submit' });
  });

  it('should render the form correctly', async () => {
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneNumberInput).toBeInTheDocument();
    expect(genderSelect).toBeInTheDocument();
    expect(websiteInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should display validation error when the name is empty', async () => {
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.click(submitButton);
    });

    expect(nameInput).toBeInvalid();
  });

  it('should display validation error when the email is empty', async () => {
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.click(submitButton);
    });

    expect(emailInput).toBeInvalid();
  });

  it('should display validation error when the phone number is empty', async () => {
    await act(async () => {
      fireEvent.change(phoneNumberInput, { target: { value: '' } });
      fireEvent.click(submitButton);
    });

    expect(phoneNumberInput).toBeInvalid();
  });

  it('should display validation error when gender is empty', async () => {
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = screen.getByText('Gender is required');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should display validation error when the website name is invalid', async () => {
    await act(async () => {
      fireEvent.change(websiteInput, { target: { value: 'abcd' } });
      fireEvent.click(submitButton);
    });

    expect(websiteInput).toBeInvalid();
  });
});
