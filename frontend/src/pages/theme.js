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
    typography: {
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            variants: [
                {
                    props: { variant: 'primary' },
                    style: {
                        backgroundColor: '#D17A22',
                    },
                },
                {
                    props: { variant: 'secondary' },
                    style: {
                        backgroundColor: '#fff',
                        '&:hover': {
                            backgroundColor: '#d8d8d8',
                        },
                    },
                },
            ],
        },
    },
});

export default theme;
