import React, {useEffect} from 'react'
import {
	Button,
	Container,
	Grid,
	Paper, Slide,
	Table, TableBody, TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography, useMediaQuery
} from '@material-ui/core';
import useStyles from './styles'
import CartItem from './CartItem/CartItem'
import {Link} from 'react-router-dom';
import Spinner from "../Spinner/Spinner";
import {withSnackbar} from "notistack";

import "./style.css";
import {DeleteForeverOutlined, LocalMallOutlined} from "@material-ui/icons";
import {Image} from "react-bootstrap";

const Cart = ({cart, handleUpdateCartQuantity, handleRemoveFromCart, handleEmptyCart, enqueueSnackbar}) => {
	const classes = useStyles();

	const handleAddQuantityCheck = async (item, productId, quantity, variantId) => {
		if (item.variant && item.variant.inventory) { //covers items with sizes
			if (item.variant.inventory >= quantity) {
				handleUpdateCartQuantity(productId, quantity, variantId)
			} else {
				console.log("no more of this item")
				enqueueSnackbar('No More Available!', {
					variant: "error",
					autoHideDuration: 1500,
					TransitionComponent: Slide,
					preventDuplicate: true,
					anchorOrigin: { vertical: 'top', horizontal:'right'}
				})
			}
		} else { //items with unlimited quantity
			console.log("unlimited")
			handleUpdateCartQuantity(productId, quantity, variantId)
		}
	}

	const columns = [
		{id: 'image', label: <LocalMallOutlined/>, maxWidth: 200, align: "center"},
		{id: 'product', label: 'Product', maxWidth: 200, align: "center"},
		{id: 'size', label: 'Size', maxWidth: 200, align: "center"},
		{id: 'quantity', label: 'Quantity', maxWidth: 200, align: "center"},
		{id: 'price', label: 'Price', maxWidth: 200, align: "center"},
		{id: 'remove', label: 'Remove', maxWidth: 200, align: "center"}
	];

	useEffect(() => {
		cart.line_items.forEach((item, index) => {
				if(item.quantity > item.variant.inventory) {
					item.quantity = item.variant.inventory;
					handleUpdateCartQuantity(item.id, item.variant.inventory, item.variant.id)
					enqueueSnackbar('Some of your items don\'t have enough Inventory to fulfill your order! Your Bag has been adjusted accordingly.', {
						variant: "error",
						autoHideDuration: 10000,
						TransitionComponent: Slide,
						preventDuplicate: true,
						anchorOrigin: { vertical: 'top', horizontal:'right'}
					})
				}
		})
	})

	const EmptyCart = () => (
		<Grid>
			<Typography align='center' variant="subtitle1">You have no items in your Bag.</Typography>
			<Typography align='center' variant="subtitle1">Go back to the home page to add some!</Typography>
			<br/><br/>
			<Button style={{display: "flex", justifyContent: "center"}} component={Link} to="/"
			        className={classes.checkoutButton} size="large"
			        variant="contained" color="primary" type="button">Home</Button>
		</Grid>
	);

	const CartTable = () => (
		<Paper className={classes.root}>
			<Typography variant="h4" align="center" style={{padding: "15px"}} gutterBottom>Your Bag</Typography>
			<hr/>
			<TableContainer className={classes.container}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{cart.line_items.map((item) => {
							const row = [
								<Image src={item.media.source} key={'img' + item.id} alt="prod-img" width="150px"/>,
								item.name,
								item.variant && item.variant.sku ? item.variant.sku : "One Size",
								<div className={classes.buttons} key={'buttonsDiv' + item.id}>
									<Button type="button" size="small" key={'minusOne' + item.id}
									        onClick={() => handleAddQuantityCheck(item, item.id, item.quantity - 1)}>-</Button>
									<Typography key={'quantity' + item.id}>{item.quantity}</Typography>
									<Button type="button" size="small" key={'plusOne' + item.id}
									        onClick={() => handleAddQuantityCheck(item, item.id, item.quantity + 1)}>+</Button>
								</div>,
								item.price.formatted_with_symbol,
								<Button variant="contained" key={'delete' + item.id} text-align="center" type="button"
								        color="secondary"
								        onClick={() => handleRemoveFromCart(item.id)}>
									<DeleteForeverOutlined key={'deleteButton' + item.id}/>
								</Button>
							]
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={'row'+item.id}>
									{columns.map((column, index) => {
										const value = row[index];
										return (
											<TableCell
												key={index}
												align="center"
												style={{maxWidth: column.maxWidth}}>
												{value}
											</TableCell>
										)
									})}
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	)

	const CartCards = () => (
		<>
			<Grid>
				<Typography variant="h4" align="center" style={{padding: "15px"}} gutterBottom>Your Bag</Typography>
				<hr/>
				<br/>
				<Grid container justifyContent="center" spacing={3}>
					{cart.line_items.map((item) => (
						<Grid item xs={12} lg={3} md={4} sm={6} key={item.id}>
							<CartItem item={item} onUpdateCartQuantity={handleAddQuantityCheck}
							          onRemoveFromCart={handleRemoveFromCart}/>
						</Grid>
					))}
				</Grid>
				<br/>
			</Grid>
		</>
	);

	const TotalsBox = () => (
		<>
			<Typography style={{padding: "5px"}}>&nbsp;</Typography>
			<Grid>
				<Typography variant="h4" align="center" gutterBottom>Bag Total</Typography>
				<hr/>
				<>
					{cart.line_items.map((item) => (
						<Typography align="right" key={item.id} variant="subtitle1" display="block">
							{(item.variant && item.variant.sku ? item.variant.sku : "") + " " + item.name + " : " + item.price.formatted_with_symbol + " x " + item.quantity + " .......... " + item.line_total.formatted_with_symbol}
						</Typography>
					))}
				</>
				<br/>
				<div className={classes.cardDetails}>
					<Typography variant="h5">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
				</div>
				<div className={classes.checkoutButtons}>
					<Button className={classes.emptyButton} size="large" variant="contained" color="secondary"
					        type="button"
					        onClick={handleEmptyCart}>Empty Bag</Button>
					<Button component={Link} to="/checkout" className={classes.checkoutButton} size="large"
					        variant="contained" color="primary" type="button">Checkout</Button>
				</div>
			</Grid>
			<Typography style={{padding: "10px"}}>&nbsp;</Typography>
		</>
	)

	const mediaMatches = useMediaQuery('(max-width:815px)');

	if (!cart.line_items) return <Spinner/>

	return (
		<Container>
			<div className={classes.toolbar}/>
			<br/>
			{cart.line_items.length ? (mediaMatches ? <CartCards/> : <CartTable/>) : ''}
			{!cart.line_items.length ? <EmptyCart/> : <TotalsBox/>}
		</Container>
	)
}

export default withSnackbar(Cart)
