import { Modal } from '@/components/molecules';
import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { hideAddInvoiceModal } from '@/lib/features/modal/modalSlice';

const AddInvoice = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.addInvoiceModal);

  const handleOnClose = () => {
    dispatch(hideAddInvoiceModal());
  };
  return (
    <Modal
      open={isOpen}
      onClose={handleOnClose}
      title='Add Invoice'
      content={<div>Content</div>}
      footerAction={{ label: 'Save', onClick: () => handleOnClose() }}
    />
  );
};

export default AddInvoice;
