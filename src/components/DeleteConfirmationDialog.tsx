import { Box, Button, Dialog, Typography } from '@mui/material';
import Rule from './common/Rule';
import { colors } from '../app/theme';
import type { OutgoingOrderInterface } from '../app/types';

interface DeleteConfirmationDialogProps {
    isOpen: boolean;
    selectedOrder: OutgoingOrderInterface | null;
    closeDialog: () => void;
    onDelete: () => void;
}

const DeleteConfirmationDialog = ({ isOpen, selectedOrder, closeDialog, onDelete }: DeleteConfirmationDialogProps) => (
    <Dialog open={isOpen} onClose={closeDialog}>
        <Box sx={{ p: 3, maxWidth: '46ch' }}>
            <Typography variant='section' component='h2'>
                Delete ORD-{selectedOrder?.id}?
            </Typography>
            <Rule weight='mid' sx={{ my: 1.5 }} />
            <Typography variant='body1' sx={{ color: 'text.secondary' }}>
                {selectedOrder?.customer}'s order leaves the manifest for everyone watching the board. This can't be
                undone.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button variant='text' onClick={closeDialog}>
                    Cancel
                </Button>
                <Button
                    variant='outlined'
                    onClick={onDelete}
                    sx={{
                        borderColor: colors.stamp,
                        color: colors.stamp,
                        '&:hover': {
                            borderColor: colors.stamp,
                            backgroundColor: colors.stamp,
                            color: colors.paper,
                        },
                    }}
                >
                    Delete order
                </Button>
            </Box>
        </Box>
    </Dialog>
);

export default DeleteConfirmationDialog;
