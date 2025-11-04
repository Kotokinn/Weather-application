import { Grid, Typography } from "@mui/material"

const TinhTrangHienTai = () => {
    return (
        <Grid spacing={3} container>
            <Grid className="bg-info rounded-xl h-40 p-4" size={6}>
                <Typography variant="body1" color="initial">Gio</Typography>
            </Grid>
            <Grid className="bg-info rounded-xl h-40 p-4" size={6}>
                <Typography variant="body1" color="initial">Do am</Typography>

            </Grid>
            <Grid className="bg-info rounded-xl h-40 p-4" size={6}>
                <Typography variant="body1" color="initial">Chi so tia cuc tim</Typography>

            </Grid>
            <Grid className="bg-info rounded-xl h-40 p-4" size={6}>
                <Typography variant="body1" color="initial">Ap xuat</Typography>

            </Grid>
            <Grid className="bg-info rounded-xl h-40 p-4" size={12}>
                <Typography variant="body1" color="initial">Mat troi moc va lan</Typography>

            </Grid>
        </Grid>
    )
}

export default TinhTrangHienTai