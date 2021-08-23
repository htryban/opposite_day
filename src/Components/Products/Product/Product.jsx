import React from 'react'
import {Card, CardActionArea, CardContent, CardMedia, Typography} from '@material-ui/core'
// import {LocalMallOutlined} from "@material-ui/icons";
// import AddRoundedIcon from '@material-ui/icons/Add';
import {Link} from "react-router-dom";

import useStyles from './styles';
import "./style.css";

const Product = ({product, onAddToCart}) => {
	console.log(product)
	const classes = useStyles();
	return (
		<Card className="productCard">
			<Link to={`/product/${product.permalink}`} style={{textDecoration: 'none'}}>
				<CardActionArea>
					<CardMedia className={classes.media} image={product.media.source} title={product.name}/>
					<CardContent>
						<div className={classes.cardContent}>
							<Typography variant="h5" gutterBottom>
								{product.name}
							</Typography>
							<Typography variant="h5">
								{product.price.formatted_with_symbol}
							</Typography>
						</div>
						<Typography dangerouslySetInnerHTML={{__html: product.description.split('.', 1)}}
						            variant="body2"
						            color="textSecondary"/>
					</CardContent>
				</CardActionArea>
			</Link>
			{/*<CardActions disableSpacing className={classes.cardActions}>*/}
			{/*	<IconButton aria-label="Add to Cart" onClick={() => onAddToCart(product.id, 1)}>*/}
			{/*		<AddRoundedIcon /><LocalMallOutlined />*/}
			{/*	</IconButton>*/}
			{/*</CardActions>*/}
		</Card>
	)
}

export default Product
