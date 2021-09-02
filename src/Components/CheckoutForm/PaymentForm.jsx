import React, {useState} from 'react';
import {Button, Divider, Typography} from '@material-ui/core';
import {CardElement, Elements, ElementsConsumer} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import Review from './Review';
import "./style.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY_LIVE);

const PaymentForm = ({checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout}) => {

	const handleSubmit = async (event, elements, stripe) => {
		event.preventDefault();

		if (!stripe || !elements) return;

		const cardElement = elements.getElement(CardElement);

		const {error, paymentMethod} = await stripe.createPaymentMethod({type: 'card', card: cardElement});

		console.log("checkout", checkoutToken)
		if (error) {
			console.log('pain [error]', error);
		} else {
			const orderData = {
				line_items: checkoutToken.live.line_items,
				customer: {
					firstname: shippingData.firstName,
					lastname: shippingData.lastName,
					email: shippingData.email
				},
				shipping: {
					name: 'Domestic',
					street: shippingData.address,
					town_city: shippingData.city,
					county_state: shippingData.shippingSubdivision,
					postal_zip_code: shippingData.zip,
					country: shippingData.shippingCountry
				},
				billing: {
					name: 'Customer',
					street: shippingData.address,
					town_city: shippingData.city,
					county_state: shippingData.shippingSubdivision,
					postal_zip_code: shippingData.zip,
					country: shippingData.shippingCountry
				},
				fulfillment: {shipping_method: shippingData.shippingOption},
				payment: {
					gateway: 'stripe',
					stripe: {
						payment_method_id: paymentMethod.id,
					},
				},
			};
			console.log('Order Data', orderData);
			onCaptureCheckout(checkoutToken.id, orderData);

			nextStep();
		}
	};

	return (
		<>
			<Review checkoutToken={checkoutToken} shippingData={shippingData} backStep={backStep}/>
			<Divider/>
			<Typography variant="h6" gutterBottom style={{margin: '20px 0'}}>Payment method</Typography>
			<Elements stripe={stripePromise}>
				<ElementsConsumer>{({elements, stripe}) => (
					<form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
						<CardElement/>
						<br/> <br/>
						<div style={{display: 'flex', justifyContent: 'space-between'}}>
							<Button variant="outlined" onClick={backStep}>Back</Button>
							<Button type="submit" variant="contained" disabled={!stripe} color="primary">
								Pay
							</Button>
						</div>
					</form>
				)}
				</ElementsConsumer>
			</Elements>
		</>
	);
};

export default PaymentForm;
