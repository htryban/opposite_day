import React from 'react'
import {AppBar, Badge, IconButton, Toolbar, Typography} from '@material-ui/core';
import {LocalMallOutlined} from "@material-ui/icons";
import {Link, useLocation} from 'react-router-dom';

import logo from '../../assets/logo cropped square.JPG';
import useStyles from './styles';

const Navbar = ({totalItems}) => {
	const classes = useStyles();
	const location = useLocation();

	return (
		<>
			<AppBar position="fixed" className={classes.appBar} color="inherit">
				<Toolbar>
					<Typography component={Link} to="/" variant="h5" className={classes.title} color="inherit">
						<img src={logo} alt="Commerce.js" height="40px" className={classes.image} />
						Opposite Day
					</Typography>
					<div className={classes.grow} />
					{location.pathname !== '/bag' && (
						<div className={classes.button}>
							<IconButton component={Link} to="/bag" aria-label="Show Cart Items" color="inherit">
								<Badge badgeContent={totalItems} color="secondary">
									<LocalMallOutlined />
								</Badge>
							</IconButton>
						</div>)}
				</Toolbar>
			</AppBar>
		</>
	)
}

export default Navbar
