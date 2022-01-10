import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {makeStyles} from "@material-ui/core/styles";

ReactDOM.render(<App/>, document.getElementById('root'));

export default makeStyles((theme) => ({
	success: {
		backgroundColor: '#c1ffbd',
		color: 'black'
	},
	error: {
		backgroundColor: '#ff9ea3',
		color: 'black'
	}
}));
