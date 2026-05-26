import { useParams } from 'react-router-dom';

const OutgoingOrderDetails = () => {
    const { id } = useParams();
    console.log(id)
    return <div>OutgoingOrderDetails</div>;
};

export default OutgoingOrderDetails;
