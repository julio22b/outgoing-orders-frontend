import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import type { OutgoingOrderInterface } from '../../app/types';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    selectedOrder: OutgoingOrderInterface | null;
    closeDialog: () => void;
    onDelete: () => void;
}

const DeleteConfirmationDialog = ({ isOpen, selectedOrder, closeDialog, onDelete }: DeleteConfirmationDialogProps) => {
    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle>{`Are you sure you want to delete this order ${selectedOrder?.id}?`}</DialogTitle>
            <DialogActions>
                <Button onClick={closeDialog} color='secondary' variant='outlined'>
                    Cancel
                </Button>
                <Button color='warning' sx={{ fontWeight: 600 }} variant='outlined' onClick={onDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
