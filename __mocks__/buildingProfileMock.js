export const buildingProfileMock = {
  organisation_id: 1,
  site_plan_id: "SP7110",
  number_of_voters: 3,
  action_required_invoices_count: 52,
  admin_fund_balance: -61835.37,
  sinking_fund_balance: 11510.29,
  locations: [
    { id: 818, location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW" }
  ],
  building_rules: {
    one_off_invoices: {
      amount_is_over_internal: "0",
      amount_is_over_external: "500",
      external_approvers_needed: 1,
      approvers: [
        {
          id: 6499,
          full_name: "Michael Vumbaca",
          approver_type: "internal",
          approved_invoices: [],
          first_approver: false,
          on_hold_invoices: [],
          cancelled_invoices: [],
          passed_invoices: [],
          state: "active"
        },
        {
          id: 14139,
          full_name: "Diane Norton",
          approver_type: "external",
          approved_invoices: [345862, 345863],
          first_approver: false,
          on_hold_invoices: [],
          cancelled_invoices: [],
          passed_invoices: [],
          state: "active"
        },
        {
          id: 6508,
          full_name: "George Vumbaca",
          approver_type: "internal",
          approved_invoices: [
            296412,
            296415,
            296418,
            296424,
            296441,
            296446,
            296363,
            296297,
            296484,
            296489,
            296492,
            296494,
            296503,
            296504,
            296508,
            296548,
            296537,
            296769,
            296686,
            296783,
            296470,
            296823,
            296822,
            296826,
            296788,
            296466,
            296476,
            296574,
            296833,
            296841,
            296842,
            296843,
            296844,
            296845,
            296846,
            296847,
            296848,
            296850,
            296851,
            296835,
            296451,
            296411,
            296852,
            296853,
            296414,
            296868,
            296413,
            296124,
            296402,
            296882,
            299511,
            299512,
            299513,
            299553,
            299557,
            299568,
            299567,
            296825,
            299646,
            308839,
            312663,
            312697,
            313853,
            345862,
            345863,
            345873
          ],
          first_approver: true,
          on_hold_invoices: [296824, 296815, 296822, 296793],
          cancelled_invoices: [345805],
          passed_invoices: [
            296412,
            296415,
            296416,
            296417,
            296418,
            296424,
            296446,
            296363,
            296480,
            296484,
            296492,
            296504,
            296537,
            296548,
            296574,
            296769,
            296792,
            296793,
            296139,
            296049,
            296124,
            296046,
            284709,
            7246,
            7114,
            7134,
            296851,
            296852,
            296853,
            299511,
            299512,
            299513,
            299514,
            299531,
            299533,
            299553,
            299559,
            299560,
            312697,
            313853,
            345873
          ],
          state: "active"
        }
      ],
      invoices: [
        { id: 345876, amount: 0, sp_number: "SP7110" },
        { id: 345875, amount: 0, sp_number: "SP7110" },
        { id: 345873, amount: 500.0, sp_number: "SP7110" },
        { id: 345871, amount: 0, sp_number: "SP7110" },
        { id: 345864, amount: 0, sp_number: "SP7110" }
      ]
    },
    recurring_invoices: []
  },
  strata_manager: {
    id: 1,
    full_name: "George Vumbaca",
    rating: [{ id: 6499, vote: 5 }]
  },
  building_manager: {
    id: 14219,
    full_name: "Zac Jex",
    rating: [{ id: 14219, vote: 4 }]
  },
  theme: {
    primary_color: "#ffffff",
    secondary_color: "#000",
    logo:
      "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/organisation_setting/logo/1/header_Screen_Shot_2020-06-18_at_12.10.02_pm.png"
  },
  votes: 1,
  voted_with: null,
  contacts: [
    { id: 85876, lot_number: null },
    { id: 83434, lot_number: null },
    { id: 83407, lot_number: null },
    { id: 83248, lot_number: null },
    { id: 83221, lot_number: null }
  ],
  recent_work_history: [
    {
      id: 3860,
      title: "Test 2",
      description: "test",
      job_type: "job",
      job_reference_id: "QVGANEPK",
      job_owner: {
        id: 6499,
        email: "michaelv@jamesons.com.au",
        first_name: "Michael",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: " 0402306306",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6499/large_Screen_Shot_2020-06-10_at_10.30.56_am.png",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: [
        "Awaiting Committee Approval",
        "Invoice Cancelled",
        "Invoice Marked As Complete",
        "Cancelled"
      ],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Big Boys Construction Group",
          status: "Awaiting Committee Approval",
          date: null
        },
        {
          contractor_name: "Big Boys Construction Group",
          status: "Invoice Cancelled",
          date: null
        },
        {
          contractor_name: "Big Boys Construction Group",
          status: "Invoice Marked As Complete",
          date: null
        },
        {
          contractor_name: "Big Boys Construction Group",
          status: "Cancelled",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1603758598,
      attachments_ids: [],
      strata_manager_id: 6499,
      strata_manager_name: "Michael Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    },
    {
      id: 3853,
      title: "test quote",
      description: "test",
      job_type: "job",
      job_reference_id: "X001A3XS",
      job_owner: {
        id: 6499,
        email: "michaelv@jamesons.com.au",
        first_name: "Michael",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: " 0402306306",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6499/large_Screen_Shot_2020-06-10_at_10.30.56_am.png",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: [
        "Awaiting Committee Approval",
        "Invoice Cancelled",
        "Invoice Marked As Complete",
        "Cancelled"
      ],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Beyond Balconies Pty Ltd",
          status: "Awaiting Committee Approval",
          date: null
        },
        {
          contractor_name: "Beyond Balconies Pty Ltd",
          status: "Invoice Cancelled",
          date: null
        },
        {
          contractor_name: "Beyond Balconies Pty Ltd",
          status: "Invoice Marked As Complete",
          date: null
        },
        {
          contractor_name: "Beyond Balconies Pty Ltd",
          status: "Cancelled",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1603693586,
      attachments_ids: [],
      strata_manager_id: 6499,
      strata_manager_name: "Michael Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    },
    {
      id: 3847,
      title: "Test 2 ",
      description: "test",
      job_type: "job",
      job_reference_id: "BM1CQPF9",
      job_owner: {
        id: 6499,
        email: "michaelv@jamesons.com.au",
        first_name: "Michael",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: " 0402306306",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6499/large_Screen_Shot_2020-06-10_at_10.30.56_am.png",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: [
        "Invoice Processed",
        "Invoice On Hold",
        "Cancelled",
        "Invoice Marked As Complete",
        "Cancelled"
      ],
      job_trade_contractor_statuses: [
        {
          contractor_name: "50 Shades of Green Lawn \u0026 Garden Services",
          status: "Invoice Processed",
          date: null
        },
        {
          contractor_name: "50 Shades of Green Lawn \u0026 Garden Services",
          status: "Invoice On Hold",
          date: null
        },
        {
          contractor_name: "50 Shades of Green Lawn \u0026 Garden Services",
          status: "Invoice Marked As Complete",
          date: null
        },
        {
          contractor_name: "Sports Clean Pty Ltd",
          status: "Cancelled",
          date: null
        },
        {
          contractor_name: "50 Shades of Green Lawn \u0026 Garden Services",
          status: "Cancelled",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1603681737,
      attachments_ids: [],
      strata_manager_id: 6499,
      strata_manager_name: "Michael Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    },
    {
      id: 3838,
      title: "Bensons 2 Test",
      description: "test x 2",
      job_type: "job",
      job_reference_id: "P18WNBVS",
      job_owner: {
        id: 6499,
        email: "michaelv@jamesons.com.au",
        first_name: "Michael",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: " 0402306306",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6499/large_Screen_Shot_2020-06-10_at_10.30.56_am.png",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: [
        "Cancelled",
        "Invoice Marked As Complete",
        "Cancelled",
        "Job Scheduled"
      ],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Bensons Locksmiths Pty Ltd",
          status: "Invoice Marked As Complete",
          date: null
        },
        {
          contractor_name: "Bensons Locksmiths Pty Ltd",
          status: "Job Scheduled",
          date: 1603386501
        },
        {
          contractor_name: "Gow Plumbing \u0026 Draining (NSW) Pty Ltd",
          status: "Cancelled",
          date: null
        },
        {
          contractor_name: "Bensons Locksmiths Pty Ltd",
          status: "Cancelled",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1603348033,
      attachments_ids: [],
      strata_manager_id: 6499,
      strata_manager_name: "Michael Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    },
    {
      id: 3772,
      title: "Digest test 3",
      description: "test test",
      job_type: "job",
      job_reference_id: "5RPK3B8K",
      job_owner: {
        id: 6499,
        email: "michaelv@jamesons.com.au",
        first_name: "Michael",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: " 0402306306",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6499/large_Screen_Shot_2020-06-10_at_10.30.56_am.png",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: ["Invoice Marked As Complete"],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Bells Locksmiths 2.0.4",
          status: "Invoice Marked As Complete",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1602716659,
      attachments_ids: [],
      strata_manager_id: 6499,
      strata_manager_name: "Michael Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    }
  ],
  upcoming_work: [
    {
      id: 3885,
      title: "Test - Pass invoice",
      description: "Test",
      job_type: "job",
      job_reference_id: "ZON8O56A",
      job_owner: {
        id: 6499,
        email: "michaelv@jamesons.com.au",
        first_name: "Michael",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: " 0402306306",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6499/large_Screen_Shot_2020-06-10_at_10.30.56_am.png",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: ["Invoice Processed"],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Bells Locksmiths 2.0.4",
          status: "Invoice Processed",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1604279663,
      attachments_ids: [],
      strata_manager_id: 6499,
      strata_manager_name: "Michael Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    },
    {
      id: 3884,
      title: "New hemanth update test",
      description: "test test",
      job_type: "job",
      job_reference_id: "M42WQWOM",
      job_owner: {
        id: 6499,
        email: "michaelv@jamesons.com.au",
        first_name: "Michael",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: " 0402306306",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6499/large_Screen_Shot_2020-06-10_at_10.30.56_am.png",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: ["Variance Added", "Job Scheduled"],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Bells Locksmiths 2.0.4",
          status: "Variance Added",
          date: null
        },
        {
          contractor_name: "Bells Locksmiths 2.0.4",
          status: "Job Scheduled",
          date: 1605578400
        }
      ],
      building_contacts: [],
      created_at: 1604279318,
      attachments_ids: [],
      strata_manager_id: 6499,
      strata_manager_name: "Michael Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    },
    {
      id: 3883,
      title: "Here is a test",
      description: "Here is a test ",
      job_type: "job",
      job_reference_id: "NISUHCSV",
      job_owner: {
        id: 6508,
        email: "georgev@jamesons.com.au",
        first_name: "George",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: "null",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6508/200515_Maplelodge_14178.jpg",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: ["Quote Requested"],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Bells Locksmiths 2.0.4",
          status: "Quote Requested",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1604276730,
      attachments_ids: [],
      strata_manager_id: 6508,
      strata_manager_name: "George Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    },
    {
      id: 3881,
      title: "Here is a test ",
      description: "Here is a test ",
      job_type: "job",
      job_reference_id: "WD1FZWJ",
      job_owner: {
        id: 6508,
        email: "georgev@jamesons.com.au",
        first_name: "George",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: "null",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6508/200515_Maplelodge_14178.jpg",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: ["Quote Added"],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Bells Locksmiths 2.0.4",
          status: "Quote Added",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1604269662,
      attachments_ids: [],
      strata_manager_id: 6508,
      strata_manager_name: "George Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    },
    {
      id: 3880,
      title: "Test new Hemanth Updates",
      description: "Test description",
      job_type: "job",
      job_reference_id: "MOG223JZ",
      job_owner: {
        id: 6499,
        email: "michaelv@jamesons.com.au",
        first_name: "Michael",
        last_name: "Vumbaca",
        role: "strata_manager",
        mobile_number: " 0402306306",
        organisation_id: 1,
        image:
          "https://bucketeer-9ab9ffa9-2337-4379-bd32-f6323e935b89.s3.amazonaws.com/uploads/user/profile_image/6499/large_Screen_Shot_2020-06-10_at_10.30.56_am.png",
        mailing_address: null,
        is_displayed_in_contact_list: true,
        is_receiving_messages: true,
        state: "active"
      },
      job_statuses: ["Pending Closure"],
      job_trade_contractor_statuses: [
        {
          contractor_name: "Bells Locksmiths 2.0.4",
          status: "Pending Closure",
          date: null
        }
      ],
      building_contacts: [],
      created_at: 1604269162,
      attachments_ids: [],
      strata_manager_id: 6499,
      strata_manager_name: "Michael Vumbaca",
      location_id: 818,
      location_name: "SP7110 - 2 Cross Street, MOSMAN, 2088, NSW",
      requirements: [],
      term: "one_off"
    }
  ],
  noticeboards: [
    {
      id: 215,
      title: "Here is a notice board notification",
      uploaded_by: 6499,
      type: "document",
      document_id: 107060,
      text: "This is a the notification ",
      uploader: { first_name: "Michael", last_name: "Vumbaca" },
      created_at: 1593599550
    },
    {
      id: 214,
      title: "Fire Service Providers",
      uploaded_by: 6499,
      type: "text",
      text:
        "The fire service providers are going to be in the building in the next week",
      uploader: { first_name: "Michael", last_name: "Vumbaca" },
      created_at: 1593598377
    },
    {
      id: 213,
      title: "This is going to the notice board",
      uploaded_by: 6499,
      type: "document",
      document_id: 107035,
      text: "Here is a test fro the notice board for you ",
      uploader: { first_name: "Michael", last_name: "Vumbaca" },
      created_at: 1593486920
    },
    {
      id: 212,
      title: "This is a Notifice Board Post",
      uploaded_by: 6499,
      type: "document",
      document_id: 107033,
      text: "Here is an important message for you ",
      uploader: { first_name: "Michael", last_name: "Vumbaca" },
      created_at: 1593486629
    },
    {
      id: 200,
      title: "Testing",
      uploaded_by: 6499,
      type: "document",
      document_id: 40341,
      text: "This is a test",
      uploader: { first_name: "Michael", last_name: "Vumbaca" },
      created_at: 1591319640
    }
  ]
};
