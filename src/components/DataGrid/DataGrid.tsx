import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
} from '@mui/material';
import { OUTGOING_ORDERS_DATAGRID_COLUMNS } from '../../app/constants';
import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog.tsx/DeleteConfirmationDialog';
import type { OutgoingOrderInterface } from '../../app/types';
import { deleteOrder } from '../../features/slices/outgoingOrdersSlice';
import CustomChip from './CustomChip';
import { formatOrderDate } from '../../app/utils';
import LoadingOverlay from '../common/LoadingOverlay';
import DetailsIcon from '@mui/icons-material/Details';
import DetailsLink from '../common/DetailsLink';

const DataGrid = () => {
    const rows = useAppSelector((state) => state.outgoingOrders.orders);
    const { status, priority, date, search } = useAppSelector((state) => state.filters);
    const loading = useAppSelector((state) => state.outgoingOrders.loading);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OutgoingOrderInterface | null>(null);
    const dispatch = useAppDispatch();

    const filteredRows = useMemo(() => {
        const normalizedSearch = search.toLocaleLowerCase();
        return rows.filter((row) => {
            const matchesStatus = status === 'all' || row.status === status;
            const matchesPriority = priority === 'all' || row.priority === priority;
            const matchesSearch =
                !search ||
                row.id?.toString().toLocaleLowerCase().includes(normalizedSearch) ||
                row.customer?.toLocaleLowerCase().includes(normalizedSearch);
            const matchesDate = !date || row.createdAt === date;

            return matchesStatus && matchesPriority && matchesSearch && matchesDate;
        });
    }, [rows, status, priority, search, date]);

    const visibleRows = useMemo(() => {
        return filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredRows, page, rowsPerPage]);

    // Adjust page if it's out of bounds due to filtering or deletion
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    const currentPage = page > maxPage ? maxPage : page;

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (loading) {
        return <LoadingOverlay />;
    }

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    margin: '2em',
                    width: 'calc(100% - 4em)',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                }}
            >
                <Table sx={{ backgroundColor: 'background.paper' }}>
                    <TableHead>
                        <TableRow>
                            {OUTGOING_ORDERS_DATAGRID_COLUMNS.map((header) => (
                                <TableCell key={header.id} sx={{ color: 'white', opacity: 0.5 }}>
                                    {header.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>
                                    <DetailsLink orderId={row.id} />
                                </TableCell>
                                <TableCell>{row.customer}</TableCell>
                                <TableCell>
                                    <CustomChip title={row.status} />
                                </TableCell>
                                <TableCell>
                                    <CustomChip title={row.priority} />
                                </TableCell>
                                <TableCell>{formatOrderDate(row.createdAt)}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '1em' }}>
                                        <Tooltip title='Delete'>
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedOrder(row);
                                                    setIsDeleteConfirmationDialogOpen(true);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Details'>
                                            <IconButton>
                                                <DetailsLink orderId={row.id} component={<DetailsIcon />} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <DeleteConfirmationDialog
                closeDialog={() => setIsDeleteConfirmationDialogOpen(false)}
                isOpen={isDeleteConfirmationDialogOpen}
                selectedOrder={selectedOrder}
                onDelete={() => {
                    if (selectedOrder) {
                        dispatch(deleteOrder(selectedOrder.id));
                        setIsDeleteConfirmationDialogOpen(false);
                        setSelectedOrder(null);
                    }
                }}
            />
        </>
    );
};

export default DataGrid;
