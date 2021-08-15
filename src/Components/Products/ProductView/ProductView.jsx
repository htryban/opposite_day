import {Grid, Button, Container, Typography} from "@material-ui/core";
import {AddShoppingCart} from '@material-ui/icons'
import {commerce} from '../../../lib/commerce';
import {useState, useEffect} from "react";
import {Col, Row} from "react-bootstrap";
import Spinner from "../../Spinner/Spinner";
import ImageGallery from 'react-image-gallery';

import "./style.css";

const createMarkup = (text) => {
	return {__html: text};
};

const ProductView = ({addProduct}) => {
	const [product, setProduct] = useState({});
	const [sizes, setSizes] = useState();
	const [size, setSize] = useState('');
	console.log(size);
	const [loading, setLoading] = useState(true);
	const [productImages, setProductImages] = useState([])


	const fetchProduct = async (permalink) => {
		const response = await commerce.products.retrieve(permalink, {type: 'permalink'});
		console.log("product", response)
		const {id, name, price, media, description, assets} = response;
		await fetchProductImages(assets)
		setProduct({
			id,
			name,
			description,
			src: media.source,
			price: price.formatted_with_symbol,
		});
		await fetchSizes(id);
	};

	const fetchProductImages = async (assets) => {
		const images = []
		assets.forEach(element => (
			images.push({original: element.url, thumbnail: element.url, thumbnailHeight: 75, thumbnailWidth: 75,
				originalHeight: 400, originalWidth: 400})
		))
		console.log(images)
		setProductImages(images)
	}


	const fetchSizes = async (id) => {
		await commerce.products.getVariants(id).then((variants) => setSizes(variants.data))
		console.log("sizes", sizes)
	}

	useEffect(() => {
		const link = window.location.pathname.split("/");
		fetchProduct(link[2]);
	}, []);

	const handleChangeSize = (event) => {
		setSize(event.target.value);
		console.log("selected size", size)
	};

	const SizeSection = () => (
		<Row className="buttonRow">
			<Col>
				<Typography variant="h3">Size: {size.sku}</Typography>
				<Button id="blue" onClick={() => setSize(sizes[0])}>S</Button>
				<Button id="flax" onClick={() => setSize(sizes[1])}>M</Button>
				<Button id="red" onClick={() => setSize(sizes[2])}>L</Button>
			</Col>
		</Row>
	);

	return (
		<Container className="product-view">
			<Grid container spacing={4} onLoad={() => {
				setLoading(false);
			}}>
				<Grid item xs={12} md={8} className="image-wrapper">
					{/*<img*/}
					{/*	onLoad={() => {*/}
					{/*		setLoading(false);*/}
					{/*	}}*/}
					{/*	src={product.src}*/}
					{/*	alt={product.name}*/}
					{/*/>*/}
					<ImageGallery items={productImages} />
				</Grid>
				<Grid item xs={12} md={4} className="text">
					<Typography variant="h2">{product.name}</Typography>
					<Typography
						variant="subtitle1"
						dangerouslySetInnerHTML={createMarkup(product.description)}
					/>
					<Typography variant="h3">Price: {product.price}</Typography>
					<br />
					{sizes ? <SizeSection /> : ''}
					<Grid container spacing={4} add style={{paddingTop: '20px'}}>
						<Grid item xs={12}>
							<Button
								size="large"
								className="custom-button"
								onClick={() => {
									size ? addProduct(product.id, 1, size.id) : addProduct(product.id, 1);
								}}>
								<AddShoppingCart /> Add to Cart
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{loading && <Spinner />}
		</Container>
	);
};

export default ProductView;
