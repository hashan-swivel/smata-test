import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { zipSync } from 'fflate';
import { flashActions } from './flash';
import { SET_EXPORT_DOCUMENTS } from './types';
import { documentConstants } from '../constants';
import {
  axiosInstance,
  warningSwal,
  loadingSwal,
  filenameWithoutExtension,
  getFileExtension,
  chunk,
  autoDownloadLink
} from '../utils';

const deleteDocument = (id, afterDeleteCallback) => (dispatch) => {
  const MySwal = withReactContent(Swal);

  MySwal.fire(
    warningSwal({
      confirmButtonText: 'DELETE',
      input: 'text',
      inputPlaceholder: 'Add a note (optional)'
    })
  ).then(async (result) => {
    if (result.isConfirmed) {
      MySwal.fire(loadingSwal({ title: 'Deleting...', didOpen: () => MySwal.showLoading() }));

      await axiosInstance
        .delete(`/v1/documents/${id}`, { data: { note: result?.value } })
        .then(() => {
          MySwal.close();
          afterDeleteCallback();
        })
        .catch((error) => {
          MySwal.close();
          dispatch(flashActions.showError(error));
        });
    }
  });
};

const downloadAndZipDocuments = (documents) => async (dispatch) => {
  dispatch({
    type: SET_EXPORT_DOCUMENTS,
    payload: { status: documentConstants.EXPORT_STATUSES.RUNNING, exportedPercent: 0 }
  });

  let succeededDocumentCounter = 0;
  let failedDocumentCounter = 0;
  const totalDocumentCounter = documents.length;
  const toZip = {};
  const filenames = []; // To store duplicate name and increase counter

  const batches = chunk(documents, 1); // [[item1], [item16], ...]

  while (batches.length) {
    const batch = batches.shift();
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(
      // eslint-disable-next-line no-loop-func
      batch.map(async (doc) => {
        try {
          let { sp_number: spNumber, category, filename } = doc;
          let url = doc.links.file_url;

          if (doc.links.pdf_url) {
            url = doc.links.pdf_url;
            filename = `${doc.display_name}.pdf`;
          }

          if (
            spNumber === undefined ||
            spNumber === null ||
            (typeof spNumber === 'string' && spNumber.length === 0)
          ) {
            spNumber = 'unknown';
          }

          if (
            category === undefined ||
            category === null ||
            (typeof category === 'string' && category.length === 0)
          ) {
            category = 'unknown';
          }

          let found = 0;
          let zipDirectory = `${spNumber}/${category}/${filename}`;

          filenames.push(zipDirectory);
          filenames.forEach((n) => {
            if (zipDirectory === n) found += 1;
          });

          if (found !== 1) {
            const f = filenameWithoutExtension(filename);
            const e = getFileExtension(filename);

            zipDirectory = `${spNumber}/${category}/${f} (${found}).${e}`;
          }

          await fetch(url)
            .then(async (res) => {
              toZip[zipDirectory] = new Uint8Array(await res.arrayBuffer());
              succeededDocumentCounter += 1;
            })
            .catch((err) => {
              console.log('error @fetch', err);
              failedDocumentCounter += 1;
            })
            .finally(() =>
              dispatch({
                type: SET_EXPORT_DOCUMENTS,
                payload: {
                  status: documentConstants.EXPORT_STATUSES.RUNNING,
                  exportedPercent: parseInt(
                    ((succeededDocumentCounter + failedDocumentCounter) / totalDocumentCounter) *
                      100,
                    10
                  )
                }
              })
            );
        } catch (error) {
          console.log(error);

          dispatch({
            type: SET_EXPORT_DOCUMENTS,
            payload: {
              status: documentConstants.EXPORT_STATUSES.ERROR,
              exportedPercent: parseInt((succeededDocumentCounter / totalDocumentCounter) * 100, 10)
            }
          });
        }
      })
    );
  }

  if (Object.keys(toZip) !== 0) {
    const zip = zipSync(toZip, { level: 0 });
    autoDownloadLink(zip, `SMATA_${new Date().getTime()}.zip`);
  }

  dispatch({
    type: SET_EXPORT_DOCUMENTS,
    payload: {
      status: documentConstants.EXPORT_STATUSES.COMPLETED,
      exportedPercent: parseInt(
        ((succeededDocumentCounter + failedDocumentCounter) / totalDocumentCounter) * 100,
        10
      )
    }
  });
};

export const documentActions = {
  deleteDocument,
  downloadAndZipDocuments
};
