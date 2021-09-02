import React, {useEffect, useState} from 'react';
import {Button, Grid, InputLabel, MenuItem, Select, Slide, Typography} from '@material-ui/core';
import {FormProvider, useForm} from 'react-hook-form';
import {Link, useHistory} from 'react-router-dom';

import {commerce} from '../../lib/commerce';
import FormInput from './CustomTextField';
import {withSnackbar} from "notistack";
import "./style.css";

const AddressForm = ({checkoutToken, cart, test, enqueueSnackbar, closeSnackbar, handleUpdateCartQuantity}) => {
	const [shippingCountries, setShippingCountries] = useState([]);
	const [shippingCountry, setShippingCountry] = useState('');
	const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
	const [shippingSubdivision, setShippingSubdivision] = useState('');
	const [shippingOptions, setShippingOptions] = useState([]);
	const [shippingOption, setShippingOption] = useState('');
	const methods = useForm();
	const history = useHistory();

	const fetchShippingCountries = async (checkoutTokenId) => {
		const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);

		setShippingCountries(countries);
		setShippingCountry(Object.keys(countries)[0]);
	};

	const fetchSubdivisions = async (countryCode) => {
		const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);
		for (let key in subdivisions) { //remove US territories that we dont ship to
			if (key === "AS" || key === "GU" || key === "MP" || key === "PR" || key === "UM" || key === "VI") {
				delete (subdivisions[key])
			}
		}
		console.log("token",checkoutToken)
		setShippingSubdivisions(subdivisions);
		setShippingSubdivision(Object.keys(subdivisions)[0]);
	};

	const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
		const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region: stateProvince});

		setShippingOptions(options);
		setShippingOption(options[0].id);
		console.log('cart',cart)
		console.log('shipping option',shippingOption)
	};

	useEffect(() => {
		const checkRequestedQuantity = () => {
			cart.line_items.forEach((item) => {
				commerce.checkout.checkQuantity(checkoutToken.id, item.id, {
					amount: item.quantity,
					variant_id: item.variant.id
				}).then(async (response) => {
					if (!response.available) {
						enqueueSnackbar('Some of your items are no longer available. Only ' + response.live.line_items[0].variant.inventory +
							' ' + item.variant.sku + ' ' + item.name + ' is available.' +
							' Please update your order and Check Out again', {
							variant: "error",
							persist: true,
							action,
							TransitionComponent: Slide,
							preventDuplicate: true,
							anchorOrigin: {vertical: 'top', horizontal: 'right'}
						})
						//console.log(item.product_id)
						//console.log("available",response.live.line_items[0].variant.inventory)
						//handleUpdateCartQuantity(item.product_id, response.live.line_items[0].variant.inventory);
						history.push("/bag");
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
	}, [cart.line_items, checkoutToken.id, closeSnackbar, enqueueSnackbar, history])


	useEffect(() => {
		fetchShippingCountries(checkoutToken.id);
	}, [checkoutToken.id]);

	useEffect(() => {
		if (shippingCountry) fetchSubdivisions(shippingCountry);
		// eslint-disable-next-line
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
						<Button component={Link} variant="outlined" to="/cart">Back to Bag</Button>
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
