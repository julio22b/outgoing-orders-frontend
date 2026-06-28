import { Box, capitalize, TablePagination, Typography } from '@mui/material';
import { STATUS_COLORS } from '../../app/constants';
import { useMemo, useState } from 'react';
import type { OutgoingOrderInterface } from '../../app/types';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
    status: 'picking' | 'packed' | 'dispatched';
    filteredRows: OutgoingOrderInterface[];
}

const KanbanColumn = ({ status, filteredRows }: KanbanColumnProps) => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const maxPage = Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1);
    const currentPage = page > maxPage ? maxPage : page;

    const visibleOrders = useMemo(() => {
        return filteredRows.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
    }, [filteredRows, currentPage, rowsPerPage]);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box
            sx={{
                borderRadius: '10px',
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: STATUS_COLORS[status].tint,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '1em' }}>
                <Box
                    sx={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: STATUS_COLORS[status].accent,
                        borderRadius: '50%',
                    }}
                ></Box>
                <Typography sx={{ fontWeight: 600, margin: '1em' }}>{capitalize(status)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em', padding: '1em' }}>
                {visibleOrders.map((order) => (
                    <KanbanCard key={order.id} order={order} />
                ))}
            </Box>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ marginTop: 'auto' }}
            />
        </Box>
    );
};

export default KanbanColumn;
