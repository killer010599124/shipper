import { map, isEmpty, concat } from 'lodash';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const BucketButton = (props) => {

    const { brCounts, isBucketButtonsEnabled, setCurrentBucket, handleOpenModel, brcolor,abrcolor } = props;

    return <Grid item xs = {6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <List dense style={{ marginTop: '0px' }}>
            {
                map(brCounts, (value, key) => (
                    <ListItem key={key}>
                        <Button style={{ background: !isBucketButtonsEnabled ? brcolor : abrcolor, color: 'white',fontSize: '15px', padding: '6px' }} onClick={() => {
                            setCurrentBucket(key);
                            handleOpenModel();
                        }} disabled={!isBucketButtonsEnabled} variant="contained">{`${value}  ${key.slice(0)}`}</Button>
                    </ListItem>
                ))
            }
        </List>
    </Grid>

}

export default BucketButton;