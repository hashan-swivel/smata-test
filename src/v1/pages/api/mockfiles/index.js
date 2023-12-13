import mocks from './mocks';

module.exports = async (req, res) => {
  const { query } = req;
  const { sortBy, dateStart, dateEnd } = query;
  const start = dateStart ? Number(dateStart) : null;
  const end = dateEnd ? Number(dateEnd) : null;
  let documents = mocks.filesArr ? [...mocks.filesArr] : [];
  if (sortBy !== 'action') {
    documents = documents.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
  }
  if (sortBy === 'action') {
    documents = documents.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
  }
  if (start && end) {
    documents = documents.filter((item) => item.uploaded >= start && item.uploaded <= end);
  }
  return res.status(200).send({ documents });
};
