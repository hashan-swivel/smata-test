export const invoiceMock = {
  id: 312752,
  filename: "10._Invoice_-_Contractor.pdf",
  display_name: "10  Invoice   Contractor",
  file_extension: "pdf",
  file_size: "13.1 KB",
  category: "invoice",
  sp_number: "SP7110",
  available_balance: 0.0,
  popular: false,
  owner_id: 6508,
  currently_with: [14531, 14106, 6508],
  exported_to_strata_master: true,
  external_creditor_id: null,
  created_at: 1602886457,
  bpay_crn_id: null,
  lot_number: null,
  approvers: [
    {
      id: 6508,
      full_name: "George Vumbaca",
      approver_type: "internal",
      owner: false,
      approved_invoices: [312751],
      first_approver: true
    },
    {
      id: 14531,
      full_name: "R T Sandy Sandy",
      approver_type: "external",
      owner: false,
      approved_invoices: [312751],
      first_approver: false
    }
  ],
  job: null,
  contractor: {
    id: 73,
    name: "Locksmith 2.0.4",
    abn: "85001843232",
    bsb: "062111",
    account_name: null,
    account_no: "777777777",
    payment_method: "eft",
    payments_email: "account@locksmith.com",
    bpay_crn: null,
    gst_registered: true,
    user_profile: {
      id: 14243,
      email: "usersmata@gmail.com",
      first_name: "Noon",
      last_name: "Test"
    }
  },
  invoice: {
    id: 21662,
    invoiced_price: 5001.0,
    invoice_number: "ZJ5000TEST",
    po_number: "ZJPO5000",
    payment_terms: null,
    gst: 454.64,
    status: "approved",
    date: 1602892800,
    due_date: null,
    duplicate: null,
    created_at: 1602886457,
    invoice_line_items: [
      {
        id: 24053,
        gl_code_id: 26720,
        description: "Her eis a test ",
        gst: 454.64,
        amount: 5001.0,
        group_code_id: 65,
        created_at: 1602886520
      }
    ]
  },
  additional_users: [
    { id: 14531, full_name: "R T Sandy Sandy" },
    { id: 6508, full_name: "George Vumbaca" },
    { id: 14106, full_name: "Minal Kulkarni" }
  ],
  history: [
    { name: "Invoice processed to Strata Master", created_at: 1602886917 }
  ],
  locations: [
    { id: 5076, location_name: "SP7110 - 27-31 Ocean Street, BONDI, 2026, NSW" }
  ],
  links: {
    file_url:
      "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/file_attachment/attachment/312752/10._Invoice_-_Contractor.pdf",
    document_url: "https://my.staging.smata.com/api/v1/documents/312752",
    thumb_url:
      "https://my.staging.smata.com/assets/file_thumb-5d036fef2e2005883b13258b23a02edb18cb5599caaa74afdaa9ad5188f83d48.jpg"
  }
};

export const documentDetailsMock = {
  name: "10  Invoice   Contractor",
  building: {
    address: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
    label: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
    value: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW"
  },
  lot: { label: "N/A", value: "N/A" },
  url:
    "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/file_attachment/attachment/345904/10._Invoice_-_Contractor.pdf",
  fileType: "pdf",
  creditor: {
    creditorName: {
      label: "Bells Locksmiths 2.0.4",
      value: "Bells Locksmiths 2.0.4",
      name: "Bells Locksmiths 2.0.4",
      id: 73
    },
    abn: "85001843232",
    bsb: "062127",
    accountNumber: "28006557",
    paymentMethod: "eft",
    paymentsEmail: "accounts@bellslocksmiths.com.au",
    bpayBillerCode: null,
    bpayCrn: null,
    gstRegistered: true
  },
  invoiceDetails: {
    spNumber: { name: "SP7110", label: "SP7110", value: "SP7110" },
    invoiceNumber: "ZJTTSM01",
    poNumber: "4164",
    invoiceAmount: 500,
    invoiceDate: "05-11-2020",
    invoiceGst: 45.45
  },
  rowItems: [
    {
      id: 24073,
      glCode: 27063,
      description: "Testing",
      gst: 45.45,
      amount: 500,
      group: 65
    },
    {
      id: 24072,
      glCode: 27063,
      description: "Testing",
      gst: 45.45,
      amount: 500,
      group: 65
    }
  ],
  history: [
    {
      name:
        "Email has been sent to Zac Jex(zacsamazingmanagement@gmail.com) (Subject: SMATA #S7V6IDGU - Support manager assigned for SP7110).",
      created_at: 1604532064
    },
    { name: "George Vumbaca created a job request.", created_at: 1604532063 },
    {
      name:
        "Email has been sent to user(dynorton3@gmail.com) (Subject: SMATA #S7V6IDGU - New ticket has been created for SP7110).",
      created_at: 1604532063
    },
    {
      name:
        "Email has been sent to George Vumbaca(georgev@jamesons.com.au) (Subject: SMATA #S7V6IDGU - Support manager assigned for SP7110).",
      created_at: 1604532063
    }
  ],
  sharedWith: [
    {
      id: 6499,
      full_name: "Michael Vumbaca",
      firstName: "Michael",
      lastName: "Vumbaca",
      userName: "Michael Vumbaca",
      value: 6499,
      label: "Michael Vumbaca"
    },
    {
      id: 6508,
      full_name: "George Vumbaca",
      firstName: "George",
      lastName: "Vumbaca",
      userName: "George Vumbaca",
      value: 6508,
      label: "George Vumbaca"
    }
  ],
  status: "approved",
  meta: {
    my_tasks: [],
  }
};
