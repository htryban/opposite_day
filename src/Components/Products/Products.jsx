import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import Product from './Product/Product';
import useStyles from './styles'
import "./style.css";
const Products = ({products, onAddToCart}) => {
	const classes = useStyles();

	return (
		<main className={classes.content}>
			<div className={classes.toolbar}/>
			<Grid className="banner" />
			<Grid className="spacer-class">
				<Typography style={{padding: "5px"}}>&nbsp;</Typography>
			</Grid>
			<Grid container justifyContent="center" spacing={4}>
				{products.map((product) => (
					<Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
						<Product product={product} onAddToCart={onAddToCart}/>
					</Grid>
				))}
			</Grid>
		</main>
	);
}

export default Products;
