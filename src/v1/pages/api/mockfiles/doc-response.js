const JsonRes = {
  documents: [
    {
      id: 1,
      filename: 'invoice.pdf',
      file_extension: 'pdf',
      file_size: '255 KB',
      document_type: 'misc',
      created_at: '2019-10-04T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 2,
      filename: 'invoice2.png',
      file_extension: 'png',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-04T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-08T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 3,
      filename: 'invoice3.doc',
      file_extension: 'doc',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-09T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 4,
      filename: 'invoice4.xls',
      file_extension: 'xls',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-04T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 5,
      filename: 'invoice5.jpg',
      file_extension: 'jpg',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-11T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 6,
      filename: 'Tinvoice6.mov',
      file_extension: 'mov',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-04T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 7,
      filename: 'invoice7.csv',
      file_extension: 'csv',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-04T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 8,
      filename: 'invoice8.csv',
      file_extension: 'csv',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-04T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 9,
      filename: 'invoice9.csv',
      file_extension: 'csv',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-04T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    },
    {
      id: 10,
      filename: 'invoice10.csv',
      file_extension: 'csv',
      file_size: '255 KB',
      document_type: 'invoice',
      created_at: '2019-10-04T15:34:55.479+10:00',
      invoice: {
        id: 1,
        invoiced_price: 850,
        invoice_number: 'INV-987',
        state: 'approved',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      job: {
        id: 1,
        job_reference_id: 5,
        description: 'This is custom description',
        created_at: '2019-10-07T18:58:39.965+11:00'
      },
      contractor: {
        id: 1,
        name: 'Test contractor',
        abn: '12345678901',
        bsb: '554303',
        account_name: 'Account name',
        payments_email: 'example@gmail.com'
      }
    }
  ],
  meta: {
    total_count: 90,
    page: 1,
    per_page: 50,
    total_pages: 2
  }
};

export default JsonRes;
