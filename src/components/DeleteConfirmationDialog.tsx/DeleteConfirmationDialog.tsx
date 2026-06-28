import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
                <Button variant='outlined' sx={{ color: 'warning.main', fontWeight: 600 }} startIcon={<DeleteIcon color='warning' />} onClick={onDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
