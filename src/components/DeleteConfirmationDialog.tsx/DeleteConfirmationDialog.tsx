import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import type { OutgoingOrderInterface } from '../../app/types/types';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    selectedOrder: OutgoingOrderInterface | null
    closeDialog: () => void;
    onDelete: () => void;
}

const DeleteConfirmationDialog = ({ isOpen, selectedOrder, closeDialog, onDelete }: DeleteConfirmationDialogProps) => {
    return (
        <Dialog open={isOpen} onClose={closeDialog}>
            <DialogTitle>
                {`Are you sure you want to delete this order ${selectedOrder?.id}?`}
            </DialogTitle>
            <DialogActions>
                <Button onClick={closeDialog} color='secondary' variant='outlined'>Cancel</Button>
                <Button color='primary' variant='contained' onClick={onDelete}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
