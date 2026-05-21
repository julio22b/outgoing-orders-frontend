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
import { DATA_GRID_HEADERS, DATA_GRID_ROWS } from '../../app/constants/constants';
import { Fragment } from 'react/jsx-runtime';
import { useState } from 'react';

const DataGrid = ({}) => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const visibleRows = DATA_GRID_ROWS.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {DATA_GRID_HEADERS.map((header) => (
                                <Fragment key={header.id}>
                                    <TableCell>{header.title}</TableCell>
                                </Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row) => (
                            <TableRow>
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
                count={DATA_GRID_ROWS.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default DataGrid;
