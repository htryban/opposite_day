import React, {useEffect, useState} from 'react';
import {List, ListItem, ListItemText, Typography} from '@material-ui/core';
import "./style.css";
import {commerce} from "../../lib/commerce";


const Review = ({checkoutToken, shippingData}) => {
	const [taxes, setTaxes] = useState();

	useEffect(() => {
		const setTaxZone = () => {
			commerce.checkout.setTaxZone(checkoutToken.id, {
				country: 'US',
				region: shippingData.shippingSubdivision,
				postal_zip_code: shippingData.zip,
			}).then((response) => setTaxes(response.live));
		}

		if (!taxes) {
			setTaxZone();
		}
	}, [checkoutToken.id, shippingData.shippingSubdivision, shippingData.zip, taxes])

	return (
		<>
			<Typography variant="h6" gutterBottom>Order summary</Typography>
			<List disablePadding>
				{checkoutToken.live.line_items.map((product, index) => (
					<ListItem style={{padding: '10px 0'}}
					          key={product.variant && product.variant.sku ? (product.variant.sku + product.name) : (product.name + index)}>
						<ListItemText
							primary={product.variant && product.variant.sku ? (product.name + " (" + product.variant.sku + ")") : product.name}
							secondary={`Quantity: ${product.quantity}`}/>
						<Typography variant="body2">{product.line_total.formatted_with_symbol}</Typography>
					</ListItem>
				))}
				<ListItem style={{padding: '10px 0'}} key="shippingListItem">
					<ListItemText
						primary="Shipping"
						secondary="Standard Domestic"/>
					<Typography variant="body2">{checkoutToken.live.shipping.formatted_with_symbol}</Typography>
				</ListItem>
				<ListItem style={{padding: '10px 0'}} key="taxListItem">
					<ListItemText
						primary="Tax"
						secondary={shippingData.shippingSubdivision}/>
					<Typography variant="body2">{taxes ? taxes.tax.amount.formatted_with_symbol : 'Calculating...'}</Typography>
				</ListItem>
				<ListItem style={{padding: '10px 0'}}>
					<ListItemText primary="Total"/>
					<Typography variant="subtitle1" style={{fontWeight: 700}}>
						{taxes ? taxes.total_with_tax.formatted_with_symbol : 'Calculating...'}
					</Typography>
				</ListItem>
			</List>
		</>
	);
};

export default Review;
