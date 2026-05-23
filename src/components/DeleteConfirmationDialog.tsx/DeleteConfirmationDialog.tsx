import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import type { OutgoingOrderInterface } from '../../app/types/types';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    selectedOrder: OutgoingOrderInterface | null
    closeDialog: () => void;
}

const DeleteConfirmationDialog = ({ isOpen, selectedOrder, closeDialog }: DeleteConfirmationDialogProps) => {
    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle>
                {`Are you sure you want to delete this order ${selectedOrder?.id}?`}
            </DialogTitle>
            <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button>Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
