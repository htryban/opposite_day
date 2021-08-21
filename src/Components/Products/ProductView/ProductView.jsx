import {
    Button,
    Container,
    FormControl,
    FormControlLabel,
    Grid, Radio,
    RadioGroup,
    Typography
} from "@material-ui/core";
import {LocalMallOutlined} from '@material-ui/icons'
import {commerce} from '../../../lib/commerce';
import {useEffect, useState} from "react";
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
        setSize(sizes[Number(event.target.value)]);
    };

    const SizeSection = () => (
        <div className="center">
            <FormControl component="fieldset">
                <RadioGroup row aria-label="size" value={size} onClick={handleChangeSize}>
                    {sizes.map(function (lSize, index) {
                        if (lSize.inventory == null || lSize.inventory > 0) {
                            return <FormControlLabel checked={size === sizes[index]} key={'radiobutton' + index} control={<Radio/>} label={lSize.sku} value={index} labelPlacement="bottom"/>;
                        } else {
                            return <FormControlLabel disabled={true} control={<Radio/>}
                                                     label={"Sold Out"} key={'radiobutton' + index} value={lSize.sku} labelPlacement="bottom"/>;
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
                    <Grid container spacing={4} style={{paddingTop: '20px'}}>
                        <Grid item xs={12} className="right-align">
                            <Button
                                size="large"
                                className="custom-button"
                                fullWidth={true}
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
