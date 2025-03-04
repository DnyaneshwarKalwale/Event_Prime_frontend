import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckOutForm";
import axios from "../Utils/axios";
import MainLoader from "../components/loader/MainLoader";
import NoResult from "../components/NoResult";
import { enqueueSnackbar } from "notistack";

// Load Stripe using the public key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Checkout = () => {
    const { eventId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const user = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!eventId) {
            navigate("/");
            return;
        }
        createTicketOrder();
    }, [eventId]);

    const createTicketOrder = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                "/ticket/create",
                { eventId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            if (response.data.clientSecret) {
                setClientSecret(response.data.clientSecret);
            } else {
                enqueueSnackbar("Purchased successfully", { variant: "success" });
                navigate("/my-tickets");
            }
        } catch (err) {
            console.error("Error creating ticket order:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <MainLoader />;
    if (error) return <NoResult mainText={"Something went wrong. Please refresh and try again."} />;

    return (
        <div>
            <p className="font-bold logo text-center text-2xl mt-6">
                Please make a payment to create an order
            </p>
            <div className="h-[70vh] flex items-center justify-center">
                {clientSecret && (
                    <Elements options={{ clientSecret, appearance: { theme: "stripe" } }} stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default Checkout;
