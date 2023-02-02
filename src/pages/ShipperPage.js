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


const ShipperPage = () => {
    let [scannerCode, setScannerCode] = useState('');
    let [scannedCodes, setScannedCodes] = useState([]);
    let [isLoading, setIsLoading] = useState(false);

    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = React.useState('');
    const [isSuccess, setIsSuccess] = useState(true);

    const [bucketName, setBucketName] = React.useState('');
    const [packageCount, setPackageCount] = React.useState('');
    const [batchNumber, setBatchNumber] = React.useState('');
    const [message, setMessage] = React.useState('');
    
    let [code, setCode] = useState('');

    useEffect(() => {
       
    }, []);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const onSubmitPalletCode = (e) => {
        setCode(e.target.value);
    }
    
    //status function used above
    const checkStatus = (response) => {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }
   
    const getAggShipper = (isSetOnlyColors) => {
        const token = localStorage.getItem("token");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({ user: "user", scan_station: '99', code: code , token:token})
        };
        //fetch('http://3.15.154.27:8125/add_envelope', requestOptions)
            fetch('http://localhost:8125/api/agg_shipper', requestOptions)
        //fetch('https://adc.eyeota.ai/api/agg_shipper', requestOptions)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
               
                console.log(data);

                setBucketName(data.bucket);
                setMessage(data.msg);
                setBatchNumber(data.batch);
                setPackageCount(data.count);

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
                <Grid container  spacing={2}>
                    <Grid style={{ margin: '10px',marginTop:"17vh", minHeight: '400px' }} item container direction="row" xs = {6}> 
                        <Grid item xs>
                            <TextField fullWidth style={{ paddingBottom: '10px' }}
                                    id="scannerID" label="Aggregate shippers" variant="outlined"
                                    value={code}
                                    autoFocus
                                    placeholder="Aggregate shippers"
                                    // onKeyUp={onEnterCode}
                                    onChange={onSubmitPalletCode}
                                    />
                            <Divider ></Divider>
                            <Button style={{height:"80px",marginTop:"12vh"}} variant="contained" component="label" onClick = {() => getAggShipper()}>
                                 Agreegate Shipper
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider orientation="vertical" flexItem  ></Divider>
                    <Grid style={{ margin: '10px', minHeight: '400px' }} item xs = {5}>
                        <Grid item xs container direction="row" >
                            <div style={{marginTop:'12vh', display: "flex", flexDirection : "row", width:"100%"}}>
                                <div style ={{width:"35%",textAlign:"end"}} >
                                    <h2>Bucket:</h2>
                                    <div><h2>Scan Station:</h2></div> 
                                    <h2>Package Count:</h2>
                                    <h2>Batch Number:</h2>
                                    <h2>Message:</h2>
                                </div>
                                <div style ={{textAlign:"start"}} >
                                    <div><h2 style ={{height : "1.5em",fontWeight : "5"}}>{bucketName}</h2></div>
                                    <div><h2 style ={{height : "1.3em",fontWeight : "5"}}>99</h2></div> 
                                    <div><h2 style ={{height : "1.3em",fontWeight : "5"}}>{packageCount}</h2></div>
                                    <div><h2 style ={{height : "1.3em",fontWeight : "5"}}>{batchNumber}</h2></div>
                                    <div><h2 style ={{height : "1.3em",fontWeight : "5"}}>{message}</h2></div>
                                </div> 
                            </div>
                                 
                        </Grid>

                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default ShipperPage;

