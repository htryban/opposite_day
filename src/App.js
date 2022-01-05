import React, {useEffect, useState} from 'react'
import {commerce} from './lib/commerce'
import {Cart, Checkout, Navbar, Products, NotFound} from './Components'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import ProductView from './Components/Products/ProductView/ProductView';
import Spinner from "./Components/Spinner/Spinner";
import {SnackbarProvider} from 'notistack';
import {initializeApp} from 'firebase/app'
import {getAnalytics, logEvent} from 'firebase/analytics'

const theme = createTheme({
	palette: {
		primary: {
			light: '#f5fff0',
			main: '#c1ffbd',
			dark: '#8fcc8d',
			contrastText: '#000000',
		},
		secondary: {
			light: '#ffd0d4',
			main: '#ff9ea3',
			dark: '#ca6e74',
			contrastText: '#000000',
		},
		error: {
			light: 'red',
			main: 'red',
			dark: 'red',
			contrastText: '#000000',
		},
	},
	typography: {
		fontFamily: 'Signika Negative',
		fontWeightLight: 400,
		fontWeightRegular: 500,
		fontWeightMedium: 600,
		fontWeightBold: 700,
	}
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyD4xpcuO88Ol8E6QV9LI7iywQNYu-0xg_o",
	authDomain: "opposite-day.firebaseapp.com",
	projectId: "opposite-day",
	storageBucket: "opposite-day.appspot.com",
	messagingSenderId: "197540795751",
	appId: "1:197540795751:web:97e7e03091e55afac98bc2",
	measurementId: "G-JNS87VD7CP"
};

const App = () => {
	const [products, setProducts] = useState();
	const [cart, setCart] = useState({});
	const [order, setOrder] = useState({});
	const [errorMessage, setErrorMessage] = useState('');

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);

	const fetchProducts = async () => {
		const {data} = await commerce.products.list();
		logEvent(analytics, "homepage loaded")
		setProducts(data);
	}

	const fetchCart = async () => {
		setCart(await commerce.cart.retrieve());
	}

	const handleAddToCart = async (productId, quantity, variantId) => {
		const {cart} = variantId ? await commerce.cart.add(productId, quantity, variantId)
			: await commerce.cart.add(productId, quantity);
		setCart(cart);
		logEvent(analytics, "item added to cart", productId)
	}

	const handleUpdateCartQuantity = async (productId, quantity) => {
		const {cart} = await commerce.cart.update(productId, {quantity});
		setCart(cart);
	}

	const handleRemoveFromCart = async (productId) => {
		const {cart} = await commerce.cart.remove(productId);
		setCart(cart);
	}

	const handleEmptyCart = async () => {
		const {cart} = await commerce.cart.empty();
		setCart(cart);
	}

	useEffect(() => {
		fetchProducts().then();
		fetchCart().then();
	}, []);

	const refreshCart = async () => {
		const newCart = await commerce.cart.refresh();
		setCart(newCart);
	};

	const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
		try {
			const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
			setOrder(incomingOrder);
			await refreshCart();
		} catch (error) {
			setErrorMessage(error.data.error.message);
		}
	};

	if (!products) return <Spinner/>

	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider maxSnack={3}>
				<Router>
					<div style={{display: 'flex', justifyContent: 'center', alignContent: 'center', height: '100vh - 24px', width: '100vw - 24px'}}>
						<Navbar totalItems={cart.total_items}/>
						<Switch>
							<Route exact path="/">
								<Products products={products} onAddToCart={handleAddToCart}/>
							</Route>
							<Route exact path="/bag">
								<Cart
									cart={cart}
									handleUpdateCartQuantity={handleUpdateCartQuantity}
									handleRemoveFromCart={handleRemoveFromCart}
									handleEmptyCart={handleEmptyCart}
									snack={SnackbarProvider}/>
							</Route>
							<Route exact path="/checkout">
								<Checkout
									cart={cart}
									order={order}
									onCaptureCheckout={handleCaptureCheckout}
									error={errorMessage}/>
							</Route>
							<Route exact path="/product/:permalink">
								<ProductView
									addProduct={handleAddToCart}
									cart={cart}/>
							</Route>
							<Route>
								<NotFound />
							</Route>
						</Switch>
					</div>
				</Router>
			</SnackbarProvider>
		</ThemeProvider>
	)
}

export default App;
