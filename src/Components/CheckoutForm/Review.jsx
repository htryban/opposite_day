import React from 'react';
import {List, ListItem, ListItemText, Typography} from '@material-ui/core';
import "./style.css";

const Review = ({checkoutToken}) => (
	<>
		<Typography variant="h6" gutterBottom>Order summary</Typography>
		<List disablePadding>
			{checkoutToken.live.line_items.map((product, index) => (
				<ListItem style={{padding: '10px 0'}} key={product.variant && product.variant.sku ? (product.variant.sku + product.name) : (product.name + index)}>
					<ListItemText
						primary={product.variant && product.variant.sku ? (product.name + " ("+product.variant.sku+")") : product.name}
						secondary={`Quantity: ${product.quantity}`}/>
					<Typography variant="body2">{product.line_total.formatted_with_symbol}</Typography>
				</ListItem>
			))}
			<ListItem style={{padding: '10px 0'}} key="shippingListItem">
				<ListItemText
					primary="Shipping"
					secondary="Standard Domestic" />
				<Typography variant="body2">$10.00</Typography>
			</ListItem>
			<ListItem style={{padding: '10px 0'}}>
				<ListItemText primary="Total"/>
				<Typography variant="subtitle1" style={{fontWeight: 700}}>
					{checkoutToken.live.total.formatted_with_symbol}
				</Typography>
			</ListItem>
		</List>
	</>
);

export default Review;
