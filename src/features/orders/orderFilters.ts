import dayjs from 'dayjs';
import type { ListOrdersArgs, OrderFilterArgs, OrderPriority, OutgoingOrderInterface } from '../../app/types';

const ALL_OPTIONS = 'all';
const ORDER_REFERENCE_PATTERN = /^(?:ord-?)?(\d+)$/i;
const MIN_CUSTOMER_SEARCH_LENGTH = 3;
const MAX_SEARCH_LENGTH = 100;

interface SelectedFilters {
    priority: string;
    date: string | null;
}

const isOrderReference = (search: string) => ORDER_REFERENCE_PATTERN.test(search);

export const isSearchTooShort = (search: string) => {
    const trimmedSearch = search.trim();
    return (
        trimmedSearch.length > 0 &&
        !isOrderReference(trimmedSearch) &&
        trimmedSearch.length < MIN_CUSTOMER_SEARCH_LENGTH
    );
};

const isSearchSendable = (trimmedSearch: string) =>
    trimmedSearch.length > 0 &&
    trimmedSearch.length <= MAX_SEARCH_LENGTH &&
    (isOrderReference(trimmedSearch) || trimmedSearch.length >= MIN_CUSTOMER_SEARCH_LENGTH);

export const buildFilterArgs = (selectedFilters: SelectedFilters, search: string): OrderFilterArgs => {
    const filterArgs: OrderFilterArgs = {};

    if (selectedFilters.priority !== ALL_OPTIONS) {
        filterArgs.priority = selectedFilters.priority as OrderPriority;
    }

    const trimmedSearch = search.trim();
    if (isSearchSendable(trimmedSearch)) {
        filterArgs.search = trimmedSearch;
    }

    if (selectedFilters.date) {
        const startOfSelectedDay = dayjs(selectedFilters.date).startOf('day');
        filterArgs.from = startOfSelectedDay.toISOString();
        filterArgs.to = startOfSelectedDay.add(1, 'day').toISOString();
    }

    return filterArgs;
};

const matchesSearch = (order: OutgoingOrderInterface, search: string) => {
    const orderReferenceMatch = ORDER_REFERENCE_PATTERN.exec(search);
    if (orderReferenceMatch) {
        return order.id === Number(orderReferenceMatch[1]);
    }
    return order.customer.toLowerCase().includes(search.toLowerCase());
};

export const matchesListArgs = (order: OutgoingOrderInterface, listArgs: ListOrdersArgs) => {
    const createdAtTime = Date.parse(order.createdAt);

    return (
        order.status === listArgs.status &&
        (!listArgs.priority || order.priority === listArgs.priority) &&
        (!listArgs.search || matchesSearch(order, listArgs.search)) &&
        (!listArgs.from || createdAtTime >= Date.parse(listArgs.from)) &&
        (!listArgs.to || createdAtTime < Date.parse(listArgs.to))
    );
};

export const sortsBefore = (order: OutgoingOrderInterface, otherOrder: OutgoingOrderInterface) => {
    const createdAtTime = Date.parse(order.createdAt);
    const otherCreatedAtTime = Date.parse(otherOrder.createdAt);
    return createdAtTime !== otherCreatedAtTime ? createdAtTime > otherCreatedAtTime : order.id > otherOrder.id;
};
