import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { map, isEmpty, concat } from 'lodash';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PalletPage = () => {
    let [scannerCode, setScannerCode] = useState('');
    let [scannedCodes, setScannedCodes] = useState([]);
    let [isLoading, setIsLoading] = useState(false);

    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [isSuccess, setIsSuccess] = useState(true);
    
    let [pallet, setPallet] = useState('');
    let [shippers, setShippers] = useState([]);
    let [currentShipper, setCurrentShipper] = useState([]);

    useEffect(() => {
       getShippers();
    }, []);

    const onSubmitPalletCode = (e) => {
        setPallet(e.target.value);
    }
    //status function used above
    const checkStatus = (response) => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }
    const addPallet = () => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: "admin",pallet_id : pallet , shippers: 'shippers' })
            };
            setIsLoading(true);
            //fetch('http://3.15.154.27:8125/add_code', requestOptions)
            //fetch('http://3.18.104.218:8125/add_code', requestOptions)
            fetch('https://adc.eyeota.ai/api/add_to_pallet', requestOptions)
                .then(checkStatus)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    // TODO: if valid then add else display message
                   console.log(data);
                    setIsLoading(false);
                    setOpen(true);
                    setIsSuccess(true);
                    setMsg('Fetched successfully.');
                })
                .catch(error => {
                 
                    setIsLoading(false);
                    setOpen(true);
                    setIsSuccess(false);
                    setMsg(`There was an error!, ${error.toString()}`);
                });
        
    }
    const getShippers = (isSetOnlyColors) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        //fetch('http://3.15.154.27:8125/add_envelope', requestOptions)
            //fetch('http://3.18.104.218:8125/add_envelope', requestOptions)
        fetch('https://adc.eyeota.ai/api/get_shippers', requestOptions)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
               
                console.log(data);
                setShippers(data.shippers);
                setOpen(true);
                setIsSuccess(true);
                setMsg('fetched successfully.');
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                setOpen(true);
                setIsSuccess(false);
                setMsg(`There was an error!, ${error.toString()}`);
            });
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    return (
        <>

            <Box
                sx={{
                    '& > :not(style)': { m: 1, width: '100ch' },
                }}
                noValidate
                sx ={{ flexGrow: 1, padding: '10px', marginTop: '100px' }}>
                {isLoading && <CircularProgress />}
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={isSuccess ? "success" : "error"} sx={{ width: '100%' }}>
                        {msg}
                    </Alert>
                </Snackbar>
                <Grid container spacing={2}>
                    <Grid style={{ margin: '10px', minHeight: '400px' }} item container direction="row" xs = {4}>
                        
                        <Grid item xs>
                        <Typography 
                            style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}
                            variant="h6"
                            sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            minWidth: 100 }}                  
                            >Shippers
                        </Typography>
                        <Divider ></Divider>
                        <List dense style={{ marginTop: '10px', border: `solid 2px `, minHeight: '300px', maxHeight: '300px', overflow: 'auto', borderRadius: '5px', width: '80%' , marginLeft: 'auto', marginRight: 'auto'}}>
                            {
                                
                                shippers.map((value) => (
                                    <ListItem
                                      key={value}
                                      disableGutters
                                      onDoubleClick = {(e) => {
                                        if (!currentShipper.includes(value)) {
                                            setCurrentShipper([...currentShipper, value]);
                                          }
                                        
                                      }}
                                    >
                                      <ListItemText primary={`${value}`} />
                                    </ListItem>
                                  ))
                                
                            }
                        </List>
                        </Grid>

                    </Grid>
                    <Divider orientation="vertical" flexItem  ></Divider>
                    <Grid style={{ margin: '10px',paddingLeft : 0 , minHeight: '400px' }} item container direction="row" xs = {4}>
                       
                            <TextField fullWidth style={{ paddingBottom: '10px' }}
                                id="scannerID" label="Add pallet" variant="outlined"
                                value={pallet}
                                autoFocus
                                placeholder="Add pallet"
                                // onKeyUp={onEnterCode}
                                onChange={onSubmitPalletCode}
                                 />
                            <Divider ></Divider>
                            <List dense style={{ marginTop: '10px', border: `solid 2px ${!isEmpty(scannedCodes) ? '#1565c0' : 'rgba(0,0,0,.12)'}`,width : '100%' , minHeight: '300px', maxHeight: '300px', overflow: 'auto', borderRadius: '5px' }}>
                                {
                                   

                                  currentShipper.map((value) => (
                                    <ListItem
                                      key={value}
                                      disableGutters
                                      
                                    >
                                      <ListItemText primary={`${value}`} />
                                    </ListItem>
                                  ))
                                }


                            </List>
                    
                    </Grid>
                    <Divider orientation="vertical" flexItem  ></Divider>
                    <Grid style={{ margin: '10px', minHeight: '400px' }} item xs = {2}>
                    <Button variant="contained" component="label" onClick = {() => addPallet()}>
                        Finilize Pallet
                        
                    </Button>

                    </Grid>

                </Grid>
            </Box>
        </>
    );
}

export default PalletPage;

