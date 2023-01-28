import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
//import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { map, isEmpty, concat } from 'lodash';

// import SelectShippers from "./SelectShippers";

const AdminPage = () => {
    let [shipperScan, setShipperScan] = useState('');
    let [shipperScans, setShipperScans] = useState([]);
    let [palletScan, setPalletScan] = useState('');
    let [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [isSuccess, setIsSuccess] = useState(true);


    const onSubmitScanerCode = (e) => {
        setShipperScan(e.target.value);
    }
    const onSubmitPalletScan = (e) => {
        setPalletScan(e.target.value);
    }
    //status function used above
    const checkStatus = (response) => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }


    const onEnterCode = (e) => {
        e.preventDefault();
        let tempCodes = shipperScans;
        if (e.key === 'Enter') {

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: "admin", codes: shipperScan })
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
                    tempCodes = concat(tempCodes, data);
                    setShipperScans(tempCodes);
                    setIsLoading(false);
                    setShipperScan('');
                    setOpen(true);
                    setIsSuccess(true);
                    setMsg('Fetched successfully.');
                })
                .catch(error => {
                    console.log('There was an error!', error, error.toString());
                    setIsLoading(false);
                    setOpen(true);
                    setIsSuccess(false);
                    setMsg(`There was an error!, ${error.toString()}`);
                });
        }
    }

    const finalizePallet = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'admin', pallet_id: palletScan, shippers: shipperScans })
        };
        setIsLoading(true);
        //fetch('http://3.15.154.27:8125/add_envelope', requestOptions)
        //fetch('http://3.18.104.218:8125/add_envelope', requestOptions)
        fetch('https://adc.eyeota.ai/api/finalize_pallet', requestOptions)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                // Clear all lists/text boxes
                setIsLoading(false);
                setOpen(true);
                setIsSuccess(true);
                setMsg('fetched successfully.');  // TODO show message from response
            })
            .catch(error => {
                setIsLoading(false);
                setOpen(true);
                setIsSuccess(false);
                setMsg(`There was an error!, ${error.toString()}`);
            });
    }


    return (
        <>

            <Box
                sx={{
                    '& > :not(style)': { m: 1, width: '100ch' },
                }}
                noValidate
                sx={{ flexGrow: 1, padding: '10px', marginTop: '100px' }}>
                {isLoading && <CircularProgress />}
                <Grid container spacing={2}>
                    <Grid style={{ margin: '10px', marginTop:0, minHeight: '400px' }} item container direction="row" xs>
                        <Grid item xs>

                            <TextField fullWidth style={{ paddingBottom: '10px' }}
                                id="scannerID" label="scanner ID" variant="outlined"
                                value={shipperScan}
                                autoFocus
                                placeholder="Enter scanner id"
                                onKeyUp={onEnterCode}
                                onChange={onSubmitScanerCode} />
                            <Divider ></Divider>
                            <List dense style={{ marginTop: '10px', border: `solid 2px ${!isEmpty(shipperScans) ? '#1565c0' : 'rgba(0,0,0,.12)'}`, minHeight: '300px', maxHeight: '300px', overflow: 'auto', borderRadius: '5px' }}>
                                {
                                    shipperScans && shipperScans.map((code, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={code}
                                                style={{ fontSize: '1rem' }}
                                            />
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Grid>
                    </Grid>
                    <Divider orientation="vertical" flexItem  ></Divider>
                    <Grid style={{ margin: '10px', marginTop:'15px', minHeight: '400px' }} item xs>
                        <Grid item xs container direction="row" spacing={2}>
                            <TextField fullWidth style={{ paddingBottom: '10px' }}
                                id="palletID" label="Pallet" variant="outlined"
                                value={palletScan}
                                autoFocus
                                placeholder="Enter Pallet Id"
                                onChange={onSubmitPalletScan} />
                            <Divider></Divider>
                            <Button style={{ marginTop: '10px'}} type="button" disabled={isEmpty(palletScan)} onClick={finalizePallet} variant="contained">Finalize Pallet</Button>

                        </Grid>

                    </Grid>

                </Grid>
            </Box>
        </>
    );
}

export default AdminPage;
