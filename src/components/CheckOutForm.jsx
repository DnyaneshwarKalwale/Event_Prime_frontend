import { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
        if (!clientSecret) return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) {
                setMessage("Something went wrong.");
                return;
            }

            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            console.error("Stripe or Elements is not loaded yet!");
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/success`,
                },
            });

            if (error) {
                setMessage(error.message || "An unexpected error occurred.");
            } else {
                setMessage("Payment successful!");
            }
        } catch (err) {
            console.error("Payment error:", err);
            setMessage("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-col" id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button className="p-4 bg-green-500 text-white font-bold mt-5" disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}</span>
            </button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}
