import api from './axiosInstance';

const fetchOrders = async () => {
    try {
        const orders = await api.get('/orders');
        return orders;
    } catch (err) {
        console.log(err);
    }
};

export { fetchOrders };
