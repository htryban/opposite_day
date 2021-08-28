import React, {useEffect, useState} from 'react';
import {Button, Grid, InputLabel, MenuItem, Select, Slide, Typography} from '@material-ui/core';
import {FormProvider, useForm} from 'react-hook-form';
import {Link} from 'react-router-dom';

import {commerce} from '../../lib/commerce';
import FormInput from './CustomTextField';
import {withSnackbar} from "notistack";

const AddressForm = ({checkoutToken, cart, test, enqueueSnackbar, closeSnackbar}) => {
	const [shippingCountries, setShippingCountries] = useState([]);
	const [shippingCountry, setShippingCountry] = useState('');
	const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
	const [shippingSubdivision, setShippingSubdivision] = useState('');
	const [shippingOptions, setShippingOptions] = useState([]);
	const [shippingOption, setShippingOption] = useState('');
	const methods = useForm();

	const fetchShippingCountries = async (checkoutTokenId) => {
		const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);

		setShippingCountries(countries);
		setShippingCountry(Object.keys(countries)[0]);
	};

	const fetchSubdivisions = async (countryCode) => {
		const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);

		setShippingSubdivisions(subdivisions);
		setShippingSubdivision(Object.keys(subdivisions)[0]);
	};

	const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
		const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region: stateProvince});

		setShippingOptions(options);
		setShippingOption(options[0].id);
	};

	useEffect(() => {
		const checkRequestedQuantity = () => {
			cart.line_items.forEach((item) => {
				commerce.checkout.checkQuantity(checkoutToken.id, item.id, {
					amount: item.quantity,
					variant_id: item.variant.id
				}).then((response) => {
					if (!response.available) {
						enqueueSnackbar('Some of your selections don\'t have enough Inventory to fulfill your order! Your Bag has been adjusted accordingly.', {
							variant: "error",
							persist: true,
							action,
							TransitionComponent: Slide,
							preventDuplicate: true,
							anchorOrigin: {vertical: 'top', horizontal: 'right'}
						})
					}
				})
			})
		}

		const action = key => (
			<Button onClick={() => {
				closeSnackbar(key)
			}}>
				Dismiss
			</Button>
		);

		checkRequestedQuantity();
	})


	useEffect(() => {
		fetchShippingCountries(checkoutToken.id);
	}, [checkoutToken.id]);

	useEffect(() => {
		if (shippingCountry) fetchSubdivisions(shippingCountry);
	}, [shippingCountry]);

	useEffect(() => {
		if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
	}, [shippingSubdivision, checkoutToken.id, shippingCountry]);

	return (
		<>
			<Typography variant="h6" gutterBottom>Shipping address</Typography>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit((data) => test({
					...data,
					shippingCountry,
					shippingSubdivision,
					shippingOption
				}))}>
					<Grid container spacing={3}>
						<FormInput required name="firstName" label="First Name"/>
						<FormInput required name="lastName" label="Last Name"/>
						<FormInput required name="address" label="Address"/>
						<FormInput required name="email" label="Email"/>
						<FormInput required name="city" label="City"/>
						<FormInput required name="zip" label="Zip / Postal Code"/>
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Country</InputLabel>
							<Select value={shippingCountry} fullWidth
							        onChange={(e) => setShippingCountry(e.target.value)}>
								{Object.entries(shippingCountries).map(([code, name]) => ({
									id: code,
									label: name
								})).map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping State</InputLabel>
							<Select value={shippingSubdivision} fullWidth
							        onChange={(e) => setShippingSubdivision(e.target.value)}>
								{Object.entries(shippingSubdivisions).map(([code, name]) => ({
									id: code,
									label: name
								})).map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</Grid>
						<Grid item xs={12} sm={6}>
							<InputLabel>Shipping Options</InputLabel>
							<Select value={shippingOption} fullWidth
							        onChange={(e) => setShippingOption(e.target.value)}>
								{shippingOptions.map((sO) => ({
									id: sO.id,
									label: `${sO.description} - (${sO.price.formatted_with_symbol})`
								})).map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.label}
									</MenuItem>
								))}
							</Select>
						</Grid>
					</Grid>
					<br/>
					<div style={{display: 'flex', justifyContent: 'space-between'}}>
						<Button component={Link} variant="outlined" to="/cart">Back to Cart</Button>
						<Button type="submit" variant="contained" color="primary">Next</Button>
					</div>
				</form>
			</FormProvider>
			<br/>
			<Typography variant="subtitle1">These products are not currently real, and this site is for testing only.
				Please come back soon to view our new collections when they are available. By clicking 'Next',
				you agree that any product that you checkout is not real and will never be shipping. You are committing
				a
				charitable act with no expectation of anything in return.</Typography>
		</>
	);
};

export default withSnackbar(AddressForm);
