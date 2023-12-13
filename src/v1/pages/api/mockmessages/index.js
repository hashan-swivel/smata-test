import mocks from '../mockfiles/mocks';

const { messageContent, users, buildings, lots, categories } = mocks;

module.exports = async (req, res) => {
  const messageData = [
    {
      messages: messageContent.slice(0, 8),
      inMessage: users.slice(0, 3),
      building: buildings[0],
      document: {
        type: 'document',
        id: '#DHUA37HG',
        name: 'Minutes of SCM',
        lot: lots[0],
        url: 'https://cors-anywhere.herokuapp.com/https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
        fileType: 'pdf',
        category: categories[0]
      }
    },
    {
      messages: messageContent.slice(4, 8),
      inMessage: users.slice(0, 5),
      building: buildings[0],
      document: {
        type: 'job',
        id: '#ND73HFM45',
        name: 'Job document',
        lot: lots[2],
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sapien felis, consectetur eget ullamcorper in, euismod sit amet leo. Mauris viverra, ex imperdiet dapibus lacinia, metus ex vehicula lectus, mollis dapibus felis felis in felis. Nullam egestas mi eget sem pharetra, ac consequat dolor venenatis. Etiam elementum viverra feugiat. Donec non sapien orci. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris pulvinar dignissim ex, vitae auctor est hendrerit sit amet. Nulla molestie lacus dui, et lobortis est volutpat et. ',
        images: [
          'https://i1.wp.com/www.rekey.com/locksmith/wp-content/uploads/2013/03/brokenkey.jpg?resize=800%2C400',
          'https://yourprolocksmith.com/wp-content/uploads/2017/04/Broken-Key.jpg',
          'https://static.cms.yp.ca/ecms/media/1/iStock_000042127984_Medium-1427730842-600x360.jpg'
        ],
        fileType: 'pdf',
        category: categories.slice(0, 2)
      }
    },
    {
      messages: [],
      inMessage: users.slice(0, 4),
      building: buildings[1],
      document: {
        type: 'invoice',
        id: '#BDU86NJ9',
        name: 'Invoice document',
        lot: lots[5],
        url: 'https://cors-anywhere.herokuapp.com/https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
        fileType: 'pdf',
        category: categories[3]
      }
    }
  ];
  return res.status(200).send({ messageData });
};
