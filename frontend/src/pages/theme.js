import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    palette: {
        primary: {
            main: '#D17A22',
        },
        secondary: {
            main: '#465362',
        },
        background: {
            default: '#465362',
            paper: '#FFFFFF',
        },
        error: {
            main: red.A400,
        },
    },
});

export default theme;
