export const documentConstants = {
  BASE_PATH: '/v1/documents',
  PDF_PREVIEWABLE_TYPES: ['pdf', 'msg'],
  IMAGE_PREVIEWABLE_TYPES: ['jpg', 'jpeg', 'png'],
  MS_OFFICE_PREVIEWABLE_TYPES: ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'],
  VIEW_TYPE_KEY: 'SmataDMSView',
  VIEW_EXPANDED_ROWS_KEY: 'SmataExpandedDMSRowsView',
  DEFAULT_ACCEPTED_FILES: {
    '*/*': [
      '.png',
      '.jpg',
      '.jpeg',
      '.doc',
      '.docx',
      '.pdf',
      '.ppt',
      '.pptx',
      '.xlsx',
      '.xls',
      '.csv',
      '.tif',
      '.tiff'
    ]
  },
  IMAGE_ACCEPTED_FILES: { 'image/*': [] },
  PDF_EXTENSION: 'pdf',
  SHOW_ALL_DOCUMENTS_KEY: 'showAllDocuments',
  SHOW_ALL_INVOICES_KEY: 'showAllInvoices',
  EXPORT_STATUSES: {
    RUNNING: 'running',
    ERROR: 'error',
    COMPLETED: 'completed'
  },
  DEFAULT_PER_PAGE_OPTIONS: { 50: '50', 100: '100', 500: '500', 9999: 'All' },
  INDEX_SEO: {
    title: 'Documents',
    description: 'Documents'
  },
  SHOW_SEO: {
    title: 'Document',
    description: 'Document'
  },
  MS_OFFICE_WEB_VIEWER: 'https://view.officeapps.live.com/op/embed.aspx',
  DROPZONE_DEFAULT_CONFIGURATIONS: {
    accept: {
      '*/*': [
        '.png',
        '.jpg',
        '.jpeg',
        '.doc',
        '.docx',
        '.pdf',
        '.ppt',
        '.pptx',
        '.xlsx',
        '.xls',
        '.csv',
        '.tif',
        '.tiff'
      ]
    },
    multiple: true,
    maxSize: 30000000,
    minSize: 1
  },
  LEVY_NOTICES_CATEGORIES: ['levy notice', 'levy notices']
};
