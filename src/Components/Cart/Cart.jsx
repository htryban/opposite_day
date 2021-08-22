import React from 'react'
import {Button, Container, Grid, Typography} from '@material-ui/core';
import useStyles from './styles'
import CartItem from './CartItem/CartItem'
import {Link} from 'react-router-dom';
import Spinner from "../Spinner/Spinner";

import "./style.css";

const Cart = ({cart, handleUpdateCartQuantity, handleRemoveFromCart, handleEmptyCart}) => {
    const classes = useStyles();

    const EmptyCart = () => (
        <Typography variant="subtitle1">You have no items in your Bag,
            <Link to="/" className={classes.link}> go back to the home page to add some!</Link>
        </Typography>
    );

    const PopulatedCart = () => (
        <>
            <Grid>
                <Grid container justifyContent="center" spacing={3}>
                    {cart.line_items.map((item) => (
                        <Grid item xs={12} lg={3} md={4} sm={6} key={item.id}>
                            <CartItem item={item} onUpdateCartQuantity={handleUpdateCartQuantity}
                                      onRemoveFromCart={handleRemoveFromCart}/>
                        </Grid>
                    ))}
                </Grid>
                <br/>
            </Grid>
            <Typography style={{padding: "5px"}}>&nbsp;</Typography>
            <Grid>
                <div className={classes.cardDetails}>
                    <Typography variant="h4">Subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
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
    );

    if (!cart.line_items) return <Spinner/>

    return (
        <Container>
            <div className={classes.toolbar}/>
            <Typography className={classes.title} variant="h3" gutterBottom>Bag</Typography>
            <br/>
            {!cart.line_items.length ? <EmptyCart/> : <PopulatedCart/>}
        </Container>
    )
}

export default Cart
