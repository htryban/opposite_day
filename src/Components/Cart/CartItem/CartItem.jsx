import React from 'react'
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from '@material-ui/core'

import useStyles from './styles'
import {DeleteForeverOutlined} from "@material-ui/icons";

const CartItem = ({item, onUpdateCartQuantity, onRemoveFromCart}) => {
	const classes = useStyles();
	console.log({item});
	return (
		<Card>
			<CardMedia image={item.media.source} alt={item.name} className={classes.media}/>
			<CardContent className={classes.cardContent}>
				<Typography variant="h4">{item.name}</Typography>
			</CardContent>
			<CardContent className={classes.cardContent}>
				<Typography variant="h5">{item.variant ? item.variant.sku : ''}</Typography>
				<Typography variant="h5">{item.line_total.formatted_with_symbol}</Typography>
			</CardContent>
			<CardActions className={classes.cartActions}>
				<div className={classes.buttons}>
					<Button type="button" size="small"
					        onClick={() => onUpdateCartQuantity(item, item.id, item.quantity - 1)}>-</Button>
					<Typography>{item.quantity}</Typography>
					<Button type="button" size="small"
					        onClick={() => onUpdateCartQuantity(item, item.id, item.quantity + 1)}>+</Button>
				</div>
				<Button variant="contained" text-align="center" type="button" color="secondary"
				        onClick={() => onRemoveFromCart(item.id)}>
					<DeleteForeverOutlined/>
				</Button>
			</CardActions>
		</Card>
	)
}

export default CartItem
