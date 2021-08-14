import { Grid, Button, Container, Typography } from "@material-ui/core";
import { AddShoppingCart } from '@material-ui/icons'
import { commerce } from '../../../lib/commerce';
import { useState, useEffect } from "react";
import Spinner from "../../Spinner/Spinner";

import "./style.css";

const createMarkup = (text) => {
  return { __html: text };
};

const ProductView = ({ addProduct }) => {
  const [product, setProduct] = useState({});
  const [sizes, setSizes] = useState(true);
  const [loading, setLoading] = useState(true);



  const fetchProduct = async (permalink) => {
    const response = await commerce.products.retrieve(permalink, { type: 'permalink' });
    console.log("product", response)
    const { id, name, price, media, description } = response;
    setProduct({
      id,
      name,
      description,
      src: media.source,
      price: price.formatted_with_symbol,
    });
    await fetchSizes(id);
  };

  const fetchSizes = async (id) => {
    const response = await commerce.products.getVariants(id).then((variants) => setSizes(variants.data))
    console.log(sizes)
  }

  useEffect(() => {
    const link = window.location.pathname.split("/");
    fetchProduct(link[2]);
  }, []);

  return (
    <Container className="product-view">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} className="image-wrapper">
          <img
            onLoad={() => {
              setLoading(false);
            }}
            src={product.src}
            alt={product.name}
          />
        </Grid>
        <Grid item xs={12} md={4} className="text">
          <Typography variant="h2">{product.name}</Typography>
          <Typography
            variant="subtitle1"
            dangerouslySetInnerHTML={createMarkup(product.description)}
          />
          <Typography variant="h3">Price: {product.price}</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Button
                size="large"
                className="custom-button"
                onClick={() => {
                  addProduct(product.id, 1);
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