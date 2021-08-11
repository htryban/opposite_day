import React from 'react'
import { Container, Typography, Grid, Button } from '@material-ui/core';
import useStyles from './styles'
import CartItem from './CartItem/CartItem'
import { Link } from 'react-router-dom';

const Cart = ({ cart, handleUpdateCartQuantity, handleRemoveFromCart, handleEmptyCart }) => {
    const classes = useStyles();

    const EmptyCart = () => (
        <Typography variant="subtitle1">You have no items in your Cart, 
            <Link to="/" className={classes.link}> go back to the home page to add some!</Link>
        </Typography>
    );

    const PopulatedCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} onUpdateCartQuantity={handleUpdateCartQuantity} onRemoveFromCart={handleRemoveFromCart} />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" variant="contained" color="secondary" type="button" onClick={handleEmptyCart}>Empty Cart</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" variant="contained" color="primary" type="button">Checkout</Button>
                </div>
            </div>
        </>
    );

    if(!cart.line_items) return 'Loading...'

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom>Your Cart</Typography>
            {!cart.line_items.length ? <EmptyCart /> : <PopulatedCart />}
        </Container>
    )
}

export default Cart
