import {
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid, Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {AddShoppingCart, LocalMallOutlined} from '@material-ui/icons'
import {commerce} from '../../../lib/commerce';
import {useEffect, useState} from "react";
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
    const [loading, setLoading] = useState(true);
    const [productImages, setProductImages] = useState([])


    const fetchProduct = async (permalink) => {
        const response = await commerce.products.retrieve(permalink, {type: 'permalink'});
        const {id, name, price, media, description, assets} = response;
        await fetchProductImages(assets)
        await fetchSizes(id);
        setProduct({
            id,
            name,
            description,
            src: media.source,
            price: price.formatted_with_symbol,
        });
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
        await commerce.products.getVariants(id).then((variants) => setSizes(variants.data))
    }

    useEffect(() => {
        const link = window.location.pathname.split("/");
        fetchProduct(link[2]).then();
        // eslint-disable-next-line
    }, []);

    const handleChangeSize = (event) => {
        const i = event.target.value;
        setSize(sizes[i]);
    };

    const SizeSection = () => (
        <div className="center">
            <FormControl component="fieldset">
                <RadioGroup row aria-label="size" value={size} onClick={handleChangeSize}>
                    {sizes.map(function (size, index) {
                        if (size.inventory == null || size.inventory > 0) {
                            return <FormControlLabel control={<Radio/>} label={size.sku} value={size.sku} labelPlacement="bottom"/>;
                        } else {
                            return <FormControlLabel disabled={true} control={<Radio/>}
                                                     label={"Sold Out"} value={size.sku} labelPlacement="bottom"/>;
                        }
                    })}
                </RadioGroup>
            </FormControl>
        </div>

    );

    return (
        <Container className="product-view">
            <Grid container spacing={4} onLoad={() => {
                setLoading(false);
            }}>
                <Grid item xs={12} md={9} className="image-wrapper">
                    <br/>
                    <ImageGallery items={productImages} showPlayButton={false}/>
                </Grid>
                <Grid item xs={12} md={3} className="text">
                    <Typography variant="h2" className="right-align">{product.name}</Typography>
                    <Typography variant="h3" className="right-align">{product.price}</Typography>
                    <br/>
                    {sizes ? <SizeSection/> : ''}
                    <Grid container spacing={4} add style={{paddingTop: '20px'}}>
                        <Grid item xs={12} className="right-align">
                            <Button
                                size="large"
                                className="custom-button"
                                fullWidth="true"
                                onClick={() => {
                                    console.log("bag product: ", product, "bag size", size)
                                    sizes ? addProduct(product.id, 1, size.id) : addProduct(product.id, 1);
                                }}>
                                <LocalMallOutlined/> Add to Bag
                            </Button>
                        </Grid>
                    </Grid>
                    <br/><br/>
                    <Typography variant="subtitle1" className="right-align">Notes</Typography>
                    <Typography
                        variant="subtitle1"
                        dangerouslySetInnerHTML={createMarkup(product.description)}
                    />
                </Grid>
            </Grid>
            {loading && <Spinner/>}
        </Container>
    );
};

export default ProductView;
