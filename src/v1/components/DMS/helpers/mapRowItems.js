import { invoiceConstants } from '../../../../constants';
import { stripInput } from '../../../../utils';

export const mapInvoiceLineItems = (items) =>
  items.map((item) => ({
    id: item.id,
    glCode: item.gl_code_id,
    glCodePrefix: item.gl_code_prefix,
    description: item.description?.substring(0, invoiceConstants.INVOICE_DESCRIPTION_MAXLENGTH),
    gst: item.gst,
    amount: item.amount,
    group: item.group_code_id
  }));

export const mapRowItems = (rowItems = [], deletedIds = []) => {
  const rowItemArr = [];

  if (rowItems.length) {
    rowItems.forEach((item) => {
      if (!deletedIds.includes(item.id)) {
        rowItemArr.push({
          id: item.id || null,
          gl_code_id: item.glCode ? item.glCode.value : null,
          description:
            item.description?.substring(0, invoiceConstants.INVOICE_DESCRIPTION_MAXLENGTH) || null,
          gst: item.gst || 0,
          amount: item.amount || 0,
          group_code_id: item.group ? item.group.value : null
        });
      }
    });
  }

  if (deletedIds) {
    deletedIds.forEach((id) => {
      rowItemArr.push({ id, _destroy: true });
    });
  }

  if (rowItemArr.length) {
    return { invoice_line_items_attributes: rowItemArr };
  }
};
