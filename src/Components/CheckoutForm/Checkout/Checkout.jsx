import React, {useEffect, useState} from 'react';
import {
	Button,
	CircularProgress,
	CssBaseline,
	Divider,
	Paper,
	Step,
	StepLabel,
	Stepper,
	Typography
} from '@material-ui/core';
import {Link, useHistory} from 'react-router-dom';

import {commerce} from '../../../lib/commerce';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';
import {withSnackbar} from "notistack";

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({cart, onCaptureCheckout, order, error, logCheckout, enqueueSnackbar}) => {
	const [checkoutToken, setCheckoutToken] = useState(null);
	const [activeStep, setActiveStep] = useState(0);
	const [shippingData, setShippingData] = useState({});
	const classes = useStyles();
	const history = useHistory();

	const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
	const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

	useEffect(() => {
		if (cart.id) {
			const generateToken = async () => {
				try {
					const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'});

					setCheckoutToken(token);
				} catch {
					if (activeStep !== steps.length) history.push('/');
				}
			};
			generateToken();
		}
		logCheckout();
	}, [cart, activeStep, history, logCheckout]);

	const test = (data) => {
		setShippingData(data);

		nextStep();
	};

	let Confirmation = () => (order.customer ? (
		<>
			<div>
				<Typography variant="h5">Thank you for your purchase, {order.customer.firstname}.</Typography>
				<Typography variant="body1">You should receive an email confirming your order shortly.</Typography>
				<Divider className={classes.divider}/>
				<Typography variant="subtitle2">Order Number: {order.customer_reference}</Typography>
			</div>
			<br/>
			<Button component={Link} variant="outlined" type="button" to="/">Home</Button>
		</>
	) : (
		<div className={classes.spinner}>
			<CircularProgress/>
		</div>
	));

	if (error) {
		Confirmation = () => (
			<>
				<Typography variant="h5">Error: {error}</Typography>
				<br/>
				<Typography variant="body1">The item you are trying to purchase may no longer be available. Refresh your
					Bag.</Typography>
				<br/>
				<Typography variant="body1">Please double check your information and try again.</Typography>
				<br/>
				<br/>
				<Button component={Link} variant="outlined" type="button" to="/bag">Bag</Button>
			</>
		);
	}

	const Form = () => (activeStep === 0
		?
		<AddressForm checkoutToken={checkoutToken} cart={cart} nextStep={nextStep} test={test}/>
		: <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData}
		               onCaptureCheckout={onCaptureCheckout}/>);

	return (
		<>
			<CssBaseline/>
			<div className={classes.toolbar}/>
			<main className={classes.layout}>
				<Paper className={classes.paper}>
					<Typography variant="h4" align="center">Checkout</Typography>
					<Stepper activeStep={activeStep} className={classes.stepper}>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
					{activeStep === steps.length ? <Confirmation/> : checkoutToken && <Form/>}
				</Paper>
			</main>
		</>
	);
};

export default withSnackbar(Checkout);
