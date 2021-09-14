import React from 'react';
import {Button, CssBaseline, Divider, Paper, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import useStyles from "../CheckoutForm/Checkout/styles";

const NotFound = () => {
	const classes = useStyles();

	return (
		<>
			<CssBaseline/>
			<main className={classes.layout}>
				<Paper className={classes.paper}>
					<div>
						<Typography variant="h5">You're lost</Typography>
						<Typography variant="body1">but we can probably find you if you head towards home</Typography>
						<Divider className={classes.divider}/>
					</div>
					<br/>
					<div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
						<Button component={Link} variant="contained" color="secondary" type="button" to="/">Home</Button>
					</div>
				</Paper>
			</main>
		</>
	);
}

export default NotFound;