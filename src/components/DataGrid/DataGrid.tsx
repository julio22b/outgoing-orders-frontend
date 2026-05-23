import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';
import { DATA_GRID_HEADERS } from '../../app/constants';
import { useState } from 'react';
import { useAppSelector } from '../../app/hooks';

const DataGrid = () => {
    const rows = useAppSelector((state) => state.outgoingOrders.orders);
    const { status, priority, date, search } = useAppSelector((state) => state.filters);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const normalizedSearch = search.toLocaleLowerCase();
    const visibleRows = rows
        .filter((row) => {
            if (
                (status === 'all' || row.status === status) &&
                (priority === 'all' || row.priority === priority) &&
                (!search ||
                    row.id?.toLocaleLowerCase().includes(normalizedSearch) ||
                    row.customer?.toLocaleLowerCase().includes(normalizedSearch)) &&
                (!date || row.createdAt === date)
            ) {
                return true;
            }
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                            {DATA_GRID_HEADERS.map((header) => (
                                <TableCell key={header.id} sx={{ color: 'white', opacity: 0.5 }}>
                                    {header.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.customer}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.priority}</TableCell>
                                <TableCell>{row.createdAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default DataGrid;
