import {makeStyles} from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	toolbar: theme.mixins.toolbar,
	title: {
		marginTop: '5%',
		display: "flex",
		justifyContent: "center"
	},
	root: {
		border: '5px white solid',
		borderRadius: '10px'
	},
	emptyButton: {
		minWidth: '110px',
		[theme.breakpoints.down('xs')]: {
			marginBottom: '5px',
		},
		[theme.breakpoints.up('xs')]: {
			marginRight: '20px',
		},
	},
	buttons: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: "center"
	},
	checkoutButton: {
		minWidth: '110px',
	},
	link: {
		textDecoration: 'none',
	},
	cardDetails: {
		display: 'flex',
		width: '100%',
		justifyContent: 'flex-end',
	},
	checkoutButtons: {
		display: 'flex',
		marginTop: '5%',
		width: '100%',
		justifyContent: 'flex-end',
	},
	containGrid: {
		display: "flex",
		justifyContent: "center",
		margin: "auto",
		padding: "24px",
		marginTop: "10px"
	}
}));
