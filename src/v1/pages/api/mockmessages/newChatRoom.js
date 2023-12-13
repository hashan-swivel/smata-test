export default {
  id: 17,
  name: 'New Chat Window',
  last_message: {
    id: 14,
    body: 'New Message',
    created_at: 1578363285,
    sender: {
      id: 5,
      first_name: 'Melina',
      last_name: 'Padberg',
      email: 'kay-5@abc.com',
      role: 'strata_manager'
    }
  },
  users: [
    {
      id: 5,
      email: 'kay-5@abc.com',
      first_name: 'Melina',
      last_name: 'Padberg',
      role: 'strata_manager',
      mobile_number: null
    }
  ],
  messages: [
    {
      id: 14,
      body: 'New Message',
      created_at: 1578363285
    }
  ],
  attachments: [
    {
      id: 1,
      filename: 'Invoice_2019-12-09.pdf',
      file_extension: 'pdf',
      file_size: '16 KB',
      category: 'invoice',
      sp_number: '0688317',
      can_edit: true,
      can_delete: true,
      popular: false,
      owner_id: 5,
      currently_with: 5,
      created_at: 1577113383
    }
  ],
  location: {
    id: 7,
    location_name: '0688317 - 6607 Kozey Glens Spur, Port Adelaide, 2350, Queensland'
  },
  account: {
    organisation_id: null,
    site_plan_id: '0688317',
    number_of_voters: null,
    locations: [
      {
        id: 7,
        address_type: null,
        unit_no: null,
        street_no: '6607',
        street_type: 'Spur',
        street_name: 'Kozey Glens',
        address_1: null,
        address_2: null,
        suburb: 'Port Adelaide',
        state: 'Queensland',
        postcode: '2350',
        created_at: '2019-12-24T01:51:02.369+11:00',
        updated_at: '2019-12-24T01:51:02.369+11:00',
        lat: null,
        lng: null,
        account_id: 5
      },
      {
        id: 6,
        address_type: null,
        unit_no: null,
        street_no: '5641',
        street_type: 'Estates',
        street_name: 'Kassulke Radial',
        address_1: null,
        address_2: null,
        suburb: 'Traralgon',
        state: 'New South Wales',
        postcode: '3672',
        created_at: '2019-12-24T01:51:01.323+11:00',
        updated_at: '2019-12-24T01:51:01.323+11:00',
        lat: null,
        lng: null,
        account_id: 5
      },
      {
        id: 5,
        address_type: null,
        unit_no: null,
        street_no: '7156',
        street_type: 'Unions',
        street_name: 'Borer Circles',
        address_1: null,
        address_2: null,
        suburb: 'Traralgon',
        state: 'New South Wales',
        postcode: '2560',
        created_at: '2019-12-24T01:51:00.428+11:00',
        updated_at: '2019-12-24T01:51:00.428+11:00',
        lat: null,
        lng: null,
        account_id: 5
      },
      {
        id: 4,
        address_type: null,
        unit_no: null,
        street_no: '290',
        street_type: 'Throughway',
        street_name: 'Kaitlin Manors',
        address_1: null,
        address_2: null,
        suburb: 'Ballarat',
        state: 'Victoria',
        postcode: '4740',
        created_at: '2019-12-24T01:50:59.495+11:00',
        updated_at: '2019-12-24T01:50:59.495+11:00',
        lat: null,
        lng: null,
        account_id: 5
      },
      {
        id: 3,
        address_type: null,
        unit_no: null,
        street_no: '536',
        street_type: 'Glen',
        street_name: 'Walker Estates',
        address_1: null,
        address_2: null,
        suburb: 'Bundaberg',
        state: 'Australian Capital Territory',
        postcode: '2612',
        created_at: '2019-12-24T01:50:58.492+11:00',
        updated_at: '2019-12-24T01:50:58.492+11:00',
        lat: null,
        lng: null,
        account_id: 5
      },
      {
        id: 2,
        address_type: null,
        unit_no: null,
        street_no: '53317',
        street_type: 'Circles',
        street_name: 'Estella Burg',
        address_1: null,
        address_2: null,
        suburb: 'Braddon',
        state: 'Victoria',
        postcode: '6009',
        created_at: '2019-12-24T01:50:56.962+11:00',
        updated_at: '2019-12-24T01:50:56.962+11:00',
        lat: null,
        lng: null,
        account_id: 5
      },
      {
        id: 1,
        address_type: null,
        unit_no: null,
        street_no: '0985',
        street_type: 'Hollow',
        street_name: 'Sunshine Meadows',
        address_1: null,
        address_2: null,
        suburb: 'Armidale',
        state: 'Australian Capital Territory',
        postcode: '6168',
        created_at: '2019-12-24T01:50:44.604+11:00',
        updated_at: '2019-12-24T01:50:44.604+11:00',
        lat: null,
        lng: null,
        account_id: 5
      }
    ],
    building_rules: {
      one_off_invoices: {
        amount_is_over: 0,
        approvers: [
          {
            id: 5,
            full_name: 'Melina Padberg',
            approver_type: 'internal',
            approved_invoices: [],
            first_approver: true,
            on_hold_invoices: []
          }
        ],
        invoices: [
          {
            id: 1,
            amount: 0,
            sp_number: '0688317'
          }
        ]
      },
      recurring_invoices: []
    },
    strata_manager: {
      id: 5,
      full_name: 'Melina Padberg',
      rating: []
    },
    building_manager: {
      id: 5,
      full_name: 'Melina Padberg',
      rating: []
    }
  }
};
