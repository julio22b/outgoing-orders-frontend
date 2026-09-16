import { useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useDebouncedValue } from '../../app/useDebouncedValue';
import { buildFilterArgs } from './orderFilters';

const SEARCH_DEBOUNCE_MS = 300;

export const useOrderFilterArgs = () => {
    const { status, priority, search, date } = useAppSelector((state) => state.filters);
    const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

    const filterArgs = useMemo(
        () => buildFilterArgs({ priority, date }, debouncedSearch),
        [priority, date, debouncedSearch],
    );

    return { statusFilter: status, filterArgs };
};
