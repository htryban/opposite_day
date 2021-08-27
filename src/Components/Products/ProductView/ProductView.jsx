import {
	Button,
	Container,
	FormControl,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	Slide,
	Typography
} from "@material-ui/core";
import {LocalMallOutlined} from '@material-ui/icons'
import {commerce} from '../../../lib/commerce';
import React, {useEffect, useState} from "react";
import Spinner from "../../Spinner/Spinner";
import ImageGallery from 'react-image-gallery';
import {withSnackbar} from "notistack";

import "./style.css";

const createMarkup = (text) => {
	return {__html: text};
};

const ProductView = ({addProduct, cart, enqueueSnackbar}) => {
	const [product, setProduct] = useState({});
	const [sizes, setSizes] = useState([]);
	const [size, setSize] = useState('');
	const [loading, setLoading] = useState(true);
	const [productImages, setProductImages] = useState([])
	const [cartSizes, setCartSizes] = useState([])


	const fetchProduct = async (permalink) => {
		const response = await commerce.products.retrieve(permalink, {type: 'permalink'}).then();
		const {id, name, price, media, description, assets} = response;
		await fetchProductImages(assets)
		await fetchSizes(id)
		setProduct({
			id,
			name,
			description,
			src: media.source,
			price: price.formatted_with_symbol,
		});
 // open a ticket for this and abandon for now, its not worth it.
	};

	const fetchProductImages = async (assets) => {
		const images = []
		assets.forEach(element => (
			images.push({
				original: element.url, thumbnail: element.url, thumbnailHeight: 75, thumbnailWidth: 75,
				originalHeight: 400, originalWidth: 400
			})
		))
		setProductImages(images)
	}


	const fetchSizes = async (id) => {
		await commerce.products.getVariants(id).then((variants) => setSizes(variants.data));
	}

	useEffect(() => {
		const inCart = []
		const id = product.id
			if (cart.line_items) {
				for (let i = 0; i < cart.line_items.length; i++) {
					console.log("id", id, " prodID", cart.line_items[i].product_id)
					if (id === cart.line_items[i].product_id) { //if this product is the same as the one in cart
						console.log("ids match")
						console.log("sizes array", sizes)
							sizes.forEach((option) => {
								console.log("size", option)
								console.log("cartsize", cart.line_items[i].variant)
								if (option.id === cart.line_items[i].variant.id) { //if the size is the same.
									inCart.push(cart.line_items[i].quantity); //push the number of that item in cart onto array.
								} else {
									inCart.push(0); //push that there are none of that size in cart.
								}
							})
					}
				} // empty array if this product doesnt exist in cart
			}
			setSize('');
			setCartSizes(inCart);
	}, [cart, product, sizes])

	useEffect(() => {
		const link = window.location.pathname.split("/");
		fetchProduct(link[2]).then();
		// eslint-disable-next-line
	}, []);

	const handleChangeSize = (event) => {
		setSize(sizes[Number(event.target.value)]);
	};

	const SizeSection = () => (
		<div className="center">
			<FormControl component="fieldset">
				<RadioGroup row aria-label="size" value={size} onClick={handleChangeSize}>
					{sizes.map(function (lSize, index) {
							console.log("cartsizes", cartSizes)
							if (lSize.inventory == null || ((!cartSizes || cartSizes.length === 0) && lSize.inventory > 0)) {
								return <FormControlLabel checked={size === sizes[index]} key={'radiobutton' + index}
								                         control={<Radio/>} label={lSize.sku} value={index}
								                         labelPlacement="bottom"/>;
							} else if (cartSizes && cartSizes.length > 0) {
								console.log("cartsize ", cartSizes[index], index)
								if (cartSizes[index] < lSize.inventory) {
									return <FormControlLabel checked={size === sizes[index]} key={'radiobutton' + index}
									                         control={<Radio/>} label={lSize.sku} value={index}
									                         labelPlacement="bottom"/>;
								} else {
									return <FormControlLabel disabled={true} control={<Radio/>}
									                         label={"Sold Out"} key={'radiobutton' + index}
									                         value={lSize.sku}
									                         labelPlacement="bottom"/>;
								}
							} else {
								return <FormControlLabel disabled={true} control={<Radio/>}
								                         label={"Sold Out"} key={'radiobutton' + index}
								                         value={lSize.sku}
								                         labelPlacement="bottom"/>;
							}
						})
					}
				</RadioGroup>
			</FormControl>
		</div>
	);

	return (
		<Container className="product-view" justify="center">
			<Grid className="asdfd">
				<Grid className="backdrop">
					<Grid container spacing={4} className="image-wrapper" onLoad={() => {
						setLoading(false);
					}}>
						<Grid item xs={12} md={9}>
							<br/>
							<ImageGallery items={productImages} showPlayButton={false}/>
						</Grid>
						<Grid item xs={12} md={3} className="text">
							<Typography variant="h2" className="right-align">{product.name}</Typography>
							<Typography variant="h3" className="right-align">{product.price}</Typography>
							<hr/>
							<br/>
							{sizes ? <SizeSection/> : ''}
							<Grid container spacing={4} style={{paddingTop: '20px'}}>
								<Grid item xs={12} className="right-align">
									<Button
										size="large"
										className={sizes && (size === '' || size === undefined) ? "custom-button-disabled" : "custom-button"}
										disabled={sizes && (size === '' || size === undefined)}
										fullWidth={true}
										onClick={() => {
											console.log("bag product: ", product, "bag size", size)
											sizes ? addProduct(product.id, 1, size.id) : addProduct(product.id, 1);
											enqueueSnackbar('Added', {
												variant: "success",
												autoHideDuration: 1500,
												TransitionComponent: Slide,
												preventDuplicate: true,
												anchorOrigin: { vertical: 'top', horizontal:'right'}
											})
										}}>
										<LocalMallOutlined/> {sizes && (size === '' || size === undefined) ? 'Choose Size' : 'Add to Bag'}
									</Button>
								</Grid>
							</Grid>
						</Grid>
						<div className="notes-section">
							<br/><br/>
							<Typography variant="h5">Notes</Typography>
							<hr/>
							<Typography
								variant="subtitle1"
								dangerouslySetInnerHTML={createMarkup(product.description)}
							/>
						</div>
					</Grid>
				</Grid>
				<Grid className="spacer-class">
					<Typography style={{padding: "5px"}}>&nbsp;</Typography>
				</Grid>
			</Grid>
			{loading && <Spinner/>}
		</Container>
	);
};

export default withSnackbar(ProductView);
