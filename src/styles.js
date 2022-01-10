import {makeStyles} from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	root: {
		flexGrow: 1,
	},
	success: {
		backgroundColor: '#c1ffbd',
		color: 'black'
	},
	error: {
		backgroundColor: '#ff9ea3',
		color: 'black'
	},
	warning: { backgroundColor: 'green' },
	info: { backgroundColor: 'yellow' },
}));
