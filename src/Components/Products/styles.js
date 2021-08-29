import {makeStyles} from '@material-ui/core/styles';
import banner from '../../assets/banner.JPG'

export default makeStyles((theme) => ({
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	root: {
		flexGrow: 1,
	},
}));
