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
import ToggleButton from '@mui/material/ToggleButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';
import { map, isEmpty, concat } from 'lodash';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


import BucketButton from '../components/BucketButton';
import StationListTabel from '../components/stationLIst';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ScanerPage = () => {
    let [scannerCode, setScannerCode] = useState('');
    let [scannedCodes, setScannedCodes] = useState([]);
    let [isLoading, setIsLoading] = useState(false);
    let [bucketName, setBucketName] = useState('');
    let [envelopes, setEnvelops] = useState([]);
    let [station, setStation] = useState([]);

    let [b3Counts, setB3] = useState({});
    let [bpCounts, setBP] = useState({});
    let [rgCounts, setRG] = useState({});
    let [raCounts, setRA] = useState({});
    let [rbCounts, setRB] = useState({});
    let [rcCounts, setRC] = useState({});
    let [rhCounts, setRH] = useState({});
    let [rfCounts, setRF] = useState({});
    let [reCounts, setRE] = useState({});
    let [rdCounts, setRD] = useState({});
    let [lhCounts, setLH] = useState({});
    let [lfCounts, setLF] = useState({});
    let [leCounts, setLE] = useState({});
    let [ldCounts, setLD] = useState({});
    let [lgCounts, setLG] = useState({});
    let [laCounts, setLA] = useState({});
    let [lbCounts, setLB] = useState({});
    let [lcCounts, setLC] = useState({});
    let [isBucketButtonsEnabled, setIsBucketButtonsEnabled] = useState(false);

    const [rescanSelected, setRescanSelected] = React.useState(false);
    const [qualitySelected, setQualitySelected] = React.useState(false);

    const [open, setOpen] = React.useState(false);
    const [openModel, setOpenModel] = React.useState(false);
    const handleOpenModel = () => setOpenModel(true);
    const handleCloseModel = () => setOpenModel(false);

    const [stationModal, setStationModal] = React.useState(false);
    const handleOpenStationModal = () => setStationModal(true);
    const handleCloseStationModal = () => setStationModal(false);


    const [msg, setMsg] = React.useState('');
    const [isSuccess, setIsSuccess] = useState(true);

    let [currentBucket, setCurrentBucket] = useState('');


    const styleModel = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        // addEnvelop(true);
        handleOpenStationModal();
        getAvailableStations();
    }, []);
    

    const onSubmitScanerCode = (e) => {
        setScannerCode(e.target.value);
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
        let tempCodes = scannedCodes;
        if (e.key === 'Enter') {
            const token = localStorage.getItem("token");
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: "admin", scan_station: 1, code: scannerCode })
            };
            setIsLoading(true);

            // fetch('http://3.15.154.27:8125/add_code', requestOptions)
            // fetch('http://localhost:8125/api/add_code', requestOptions)
            fetch('https://adc.eyeota.ai/api/add_code', requestOptions)
                .then(checkStatus)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    tempCodes = concat(tempCodes, data);
                    setScannedCodes(tempCodes);
                    setIsLoading(false);
                    setScannerCode('');
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

    const addEnvelop = (isSetOnlyColors) => {
        const token = localStorage.getItem("token");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'admin', scan_station: 1, codes: scannedCodes, rescan: rescanSelected, quality: qualitySelected })
        };
        setIsLoading(true);
        //fetch('http://3.15.154.27:8125/add_envelope', requestOptions)
        //fetch('http://localhost:8125/api/add_envelope', requestOptions)
        fetch('https://adc.eyeota.ai/api/add_envelope', requestOptions)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                
                setBucketName(data.bucket);

                let tempCodes = concat(scannedCodes[0], envelopes);
                setEnvelops(tempCodes);

                setB3({ B3: data.B3 });
                setBP({ BP: data.BP });
                setRG({ RG: data.RG });
                setRA({ RA: data.RA });
                setRB({ RB: data.RB });
                setRC({ AR: data.RC });
                setRH({ BG: data.RH });
                setRF({ BR: data.RF });
                setRE({ AG: data.RE });
                setRD({ AR: data.RD });
                setLH({ BG: data.LH });
                setLF({ BR: data.LF });
                setLE({ AG: data.LE });
                setLD({ AR: data.LD });
                setLG({ BG: data.LG });
                setLA({ BR: data.LA });
                setLB({ BG: data.LB });
                setLC({ BR: data.LC });

                setScannedCodes([]);
                setOpen(true);
                setIsSuccess(true);
                setMsg('fetched successfully.');

                //}

                setIsLoading(false);

            })
            .catch(error => {
                setIsLoading(false);
                setOpen(true);
                setIsSuccess(false);
                setMsg(`There was an error!, ${error.toString()}`);
            });
    }
    
    const getAvailableStations = () => {
        const token = localStorage.getItem("token");
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
           
        };
        setIsLoading(true);
        //fetch('http://3.15.154.27:8125/add_envelope', requestOptions)
        //fetch('http://localhost:8125/api/add_envelope', requestOptions)
        fetch('https://adc.eyeota.ai/api/available_stations', requestOptions)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                setStation(data);
                console.log(data);
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

    const handleBucketClick = (code) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'admin', scan_station: 0, bucket: code })
        };
        setIsLoading(true);
        //fetch('http://3.15.154.27:8125/close_shipper', requestOptions)
        //fetch('http://3.18.104.218:8125/close_shipper', requestOptions)
        fetch('https://adc.eyeota.ai/api/close_shipper', requestOptions)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                setIsLoading(false);
                setIsBucketButtonsEnabled(false);

                setB3({ B3: data.B3 });
                setBP({ BP: data.BP });
                setRG({ RG: data.RG });
                setRA({ RA: data.RA });
                setRB({ RB: data.RB });
                setRC({ AR: data.RC });
                setRH({ BG: data.RH });
                setRF({ BR: data.RF });
                setRE({ AG: data.RE });
                setRD({ AR: data.RD });
                setLH({ BG: data.LH });
                setLF({ BR: data.LF });
                setLE({ AG: data.LE });
                setLD({ AR: data.LD });
                setLG({ BG: data.LG });
                setLA({ BR: data.LA });
                setLB({ BG: data.LB });
                setLC({ BR: data.LC });

                setOpen(true);
                setIsSuccess(true);
                setMsg('fetched successfully.');
            })
            .catch(error => {
                setIsLoading(false);
                setIsBucketButtonsEnabled(false);
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
                sx={{ flexGrow: 1, padding: '10px', marginTop: '100px' }}>
                {isLoading && <CircularProgress />}
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={isSuccess ? "success" : "error"} sx={{ width: '100%' }}>
                        {msg}
                    </Alert>
                </Snackbar>
                <Grid container spacing={2}>
                    <Grid style={{ margin: '10px', minHeight: '400px' }} item container direction="row" xs>
                        <Grid item xs={8}>

                            <TextField fullWidth style={{ paddingBottom: '10px' }}
                                id="scannerID" label="scanner ID" variant="outlined"
                                value={scannerCode}
                                autoFocus
                                placeholder="Enter scanner id"
                                onKeyUp={onEnterCode}
                                onChange={onSubmitScanerCode} />
                            <Divider ></Divider>
                            <div style={{ textAlign: "left" }}>Sensors in this pack</div>
                            <List dense style={{ marginTop: '10px', border: `solid 2px ${!isEmpty(scannedCodes) ? '#1565c0' : 'rgba(0,0,0,.12)'}`, minHeight: '300px', maxHeight: '300px', overflow: 'auto', borderRadius: '5px' }}>
                                {
                                    scannedCodes && scannedCodes.map((code, index) => (
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
                        <Grid item xs={4}>
                            <Button type="button" style={{ paddingBottom: '25px', marginBottom: '10px' }} disabled={isEmpty(scannedCodes)} onClick={addEnvelop} variant="contained">Next Envelope</Button>
                            {
                                bucketName !== '' &&
                                <div >
                                    <p style={{ color: 'green', fontSize: '100px' }}>{bucketName}</p>
                                </div>
                            }
                            <Divider ></Divider>

                        </Grid>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex' }}>
                                <button onClick={() => setRescanSelected(!rescanSelected)} style={{ height: '30px', width: '90px', margin: 'auto', borderWidth: '0px', borderRadius: '15px', backgroundColor: `${rescanSelected ? '#ff9901' : 'gray'}` }}></button>
                                <h2 style={{ paddingLeft: '15px' }}>Rescan</h2>
                            </div>

                            <div style={{ display: 'flex' }}>
                                <button onClick={() => setQualitySelected(!qualitySelected)} style={{ height: '30px', width: '90px', margin: 'auto', borderWidth: '0px', borderRadius: '15px', backgroundColor: `${qualitySelected ? '#ff9901' : 'gray'}` }}></button>
                                <h2 style={{ paddingLeft: '15px' }}>Quality</h2>
                            </div>
                        </div>

                    </Grid>
                    <Divider orientation="vertical" flexItem  ></Divider>
                    <Grid style={{ margin: '10px', minHeight: '400px' }} item xs>
                        <Grid item xs container direction="row" spacing={2}>
                            <Grid item style={{ marginTop: '45px' }} xs={6}>
                                <div style={{ textAlign: "left" }}>Envelopes in Shippers</div>
                                <List dense style={{ marginTop: '30px', border: `solid 2px ${!isEmpty(envelopes) ? '#1565c0' : 'rgba(0,0,0,.12)'}`, minHeight: '300px', maxHeight: '300px', overflow: 'auto', borderRadius: '5px' }}>
                                    {
                                        envelopes && envelopes.map((code, index) => (
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
                            <Grid item xs={6}>
                                <div>
                                    <Button disabled={isEmpty(envelopes)} onClick={() => setIsBucketButtonsEnabled(true)} variant="contained">Aggregate Shipper</Button>
                                    <br />
                                </div>
                                <Grid item container xs direction="column" style={{ flexDirection: "inherit", marginTop: "50px", height: '30px' }}>
                                    {/* 'B3', 'BP', 'RG', 'RA', 'RB', 'RC', 'RH', 'RF', 'RE', 'RD', 'LH', 'LF', 'LE', 'LD', 'LG', 'LA', 'LB', 'LC' */}
                                    <BucketButton brCounts={b3Counts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'#00008c'} abrcolor={"#0000ff"} />
                                    <BucketButton brCounts={bpCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'#00008c'} abrcolor={"#0000ff"} />

                                </Grid>
                                <Grid item container xs direction="column" style={{ flexDirection: "inherit", marginTop: "50px", height: '200px' }}>
                                    <Grid item container xs direction="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: '20px' }}>
                                        <BucketButton brCounts={lhCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'green'} abrcolor={"#00eD5A"} />
                                        <BucketButton brCounts={lfCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'green'} abrcolor={"#00eD5A"} />
                                        <BucketButton brCounts={leCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'green'} abrcolor={"#00eD5A"} />
                                        <BucketButton brCounts={ldCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'green'} abrcolor={"#00eD5A"} />
                                        <BucketButton brCounts={lgCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'green'} abrcolor={"#00eD5A"} />
                                        <BucketButton brCounts={laCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'green'} abrcolor={"#00eD5A"} />
                                        <BucketButton brCounts={lbCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'green'} abrcolor={"#00eD5A"} />
                                        <BucketButton brCounts={lcCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={'green'} abrcolor={"#00eD5A"} />


                                    </Grid>
                                    <Grid item container xs direction="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '20px' }}>
                                        <BucketButton brCounts={rgCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={"#dd0000"} abrcolor={"red"} />
                                        <BucketButton brCounts={raCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={"#dd0000"} abrcolor={"red"} />
                                        <BucketButton brCounts={rbCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={"#dd0000"} abrcolor={"red"} />
                                        <BucketButton brCounts={rcCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={"#dd0000"} abrcolor={"red"} />
                                        <BucketButton brCounts={rhCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={"#dd0000"} abrcolor={"red"} />
                                        <BucketButton brCounts={rfCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={"#dd0000"} abrcolor={"red"} />
                                        <BucketButton brCounts={reCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={"#dd0000"} abrcolor={"red"} />
                                        <BucketButton brCounts={rdCounts} handleOpenModel={handleOpenModel} setCurrentBucket={setCurrentBucket} isBucketButtonsEnabled={isBucketButtonsEnabled} brcolor={"#dd0000"} abrcolor={"red"} />


                                    </Grid>
                                </Grid>


                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>
            </Box>
            <Modal
                open={openModel}
                onClose={handleCloseModel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleModel}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure you wish to close this bucket
                    </Typography>
                    <Button onClick={() => {
                        handleBucketClick(currentBucket)
                        handleCloseModel();
                    }}>Yes</Button>
                    <Button onClick={handleCloseModel}>No</Button>
                </Box>
            </Modal>
            <Modal
                open={stationModal}
                onClose={handleCloseStationModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <Box sx={styleModel} style={{ minWidth: '700px' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Scan Station
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Please select a scan station to scan
                    </Typography>
                    <StationListTabel station = {station} closeModal = {handleCloseStationModal}/>
                    {/* <Button onClick={() => {

                        handleCloseStationModal();
                    }}>Yes</Button>
                    <Button onClick={handleCloseStationModal}>No</Button> */}
                </Box>
            </Modal>
        </>
    );
}

export default ScanerPage;

