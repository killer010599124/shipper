import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const StationListTabel = (pros) => {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell style= {{width : '10%'}}>Scan Station</StyledTableCell>
                        <StyledTableCell align="center" style= {{width : '10%'}}>User</StyledTableCell>
                        <StyledTableCell align="center">Last Activity</StyledTableCell>
                        <StyledTableCell align="center">Status</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row" style = {{borderLeft :"1px solid rgba(0, 0, 0, 1)",borderRight:"1px solid rgba(0, 0, 0, 1)"}}>
                                {row.name}
                            </StyledTableCell>
                            <StyledTableCell align="center" style = {{borderRight:"1px solid rgba(0, 0, 0, 1)"}}>{row.calories}</StyledTableCell>
                            <StyledTableCell align="center" style = {{borderRight:"1px solid rgba(0, 0, 0, 1)"}}>{row.fat}</StyledTableCell>
                            <StyledTableCell align="center" style = {{borderRight:"1px solid rgba(0, 0, 0, 1)"}}>{row.carbs}</StyledTableCell>
                            <StyledTableCell align="center" style = {{borderRight:"1px solid rgba(0, 0, 0, 1)"}}>{row.protein}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default StationListTabel; 