export const invoiceConstants = {
  UNCHANGEABLE_EXTERNAL_SOURCE_TYPES: ['FileSmart', 'Kofax'],
  CANCELABLE_STATUSES: ['duplicate', 'new', 'under_review', 'on_hold', 'rejected'],
  NON_APPROVABLE_STATUSES: [
    'approved',
    'approved_for_payment',
    'cancelled',
    'deleted',
    'no_payment_required',
    'paid',
    'processing',
    'processing_failed',
    'rejected'
  ],
  NON_SCHEDULABLE_STATUSES: [
    'approved_for_payment',
    'cancelled',
    'no_payment_required',
    'paid',
    'processing',
    'processing_failed',
    'rejected'
  ],
  SCHEDULED_STATUSES: ['scheduled_payment'],
  NON_EDITABLE_STATUSES: [
    'approved',
    'approved_for_payment',
    'checking_for_duplicates',
    'no_payment_required',
    'paid',
    'processing',
    'processing_failed',
    'scheduled_payment'
  ],
  NON_INITIALIZED_STATUSES: [
    'approved',
    'cancelled',
    'deleted',
    'imported',
    'no_payment_required',
    'on_hold',
    'paid',
    'processing',
    'processing_failed',
    'rejected',
    'scheduled_payment'
  ],
  OVERRIDABLE_STATUES: ['under_review', 'new', 'imported', 'duplicate'],
  DIGITAL_REIGN_SOURCE_TYPE: 'DigitalReign',
  MANAGEABLE_EXTRACTION_STATUSES: ['new - failed', 'new - skipped'],
  RE_EXPORTABLE_STATUSES: ['processing_failed'],
  STATUSES: {
    IMPORTED: 'imported'
  },
  INVOICE_NUMBER_MAXLENGTH: 15,
  INVOICE_DESCRIPTION_MAXLENGTH: 50,
  SEO: {
    title: 'Invoice',
    description: 'Invoice'
  }
};
