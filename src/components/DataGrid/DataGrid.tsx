import {
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
import type { OutgoingOrderInterface } from '../../app/types/types';
import { removeOutgoingOrder } from '../../features/slices/outgoingOrdersSlice';
import { Link } from 'react-router-dom';
import theme from '../../app/theme';

const DataGrid = () => {
    const rows = useAppSelector((state) => state.outgoingOrders.orders);
    const { status, priority, date, search } = useAppSelector((state) => state.filters);
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
                row.id?.toLocaleLowerCase().includes(normalizedSearch) ||
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

    return (
        <>
            <TableContainer component={Paper}>
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
                                    <Link
                                        to={`/order/${row.id}`}
                                        style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 'bold' }}
                                    >
                                        {row.id}
                                    </Link>
                                </TableCell>
                                <TableCell>{row.customer}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.priority}</TableCell>
                                <TableCell>{row.createdAt}</TableCell>
                                <TableCell>
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
                        dispatch(removeOutgoingOrder(selectedOrder.id));
                        setIsDeleteConfirmationDialogOpen(false);
                        setSelectedOrder(null);
                    }
                }}
            />
        </>
    );
};

export default DataGrid;
