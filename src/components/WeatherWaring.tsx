import Icon from "@/utils/icons"
import { Box, Grid, Typography } from "@mui/material"

const WeatherWarning = ({ temp }: { temp: number }) => {

    const warning = (temp: number) => {
        if (temp <= 37 && temp >= 35) return "hot";
        else if (temp > 37 && temp <= 39) return "extra_hot";
        else if (temp >= 13 && temp <= 15) return "cool";
        else if (temp > 15 && temp < 35) return "nomie"
    }

    const result = (warning) => {
        switch (warning) {
            case 'hot':
                return {
                    warn: 'error',
                    mess: 'Nóng',
                    col: 'red-700'
                }
            case 'extra_hot':
                return {
                    warn: 'error',
                    mess: 'Nóng gay gắt',
                    col: 'red-800'
                }
            case 'cool':
                return {
                    warn: 'nomie',
                    mess: 'Lạnh',
                    col: 'blue'
                }
            case 'extra_cool':
                return {
                    warn: 'nomie',
                    mess: 'Lạnh buốc',
                    col: 'blue'
                }
            default:
                return {
                    warn: 'nomie',
                    mess: 'Dễ chịu',
                    col: 'white'
                }
        }
    }

    const data = result(warning(temp));

    const colorBoxIcon = data.col === 'red-700' ? 'bg-red-700' :
        data.col === 'red-800' ? 'bg-red-800' :
            data.col === 'blue' ? 'bg-blue-500' :
                'bg-white';
    const colorBoxWarn = data.col === 'red-700' ? 'bg-red-200' :
        data.col === 'red-800' ? 'bg-red-200' :
            data.col === 'blue' ? 'bg-blue-200' :
                'bg-white';
    const colorIcon = data.col === 'red-700' ? 'text-white' :
        data.col === 'red-800' ? 'text-white' :
            data.col === 'blue' ? 'text-white' :
                'text-black';
    return (
        <Grid className={``} size={12}>
            <Box className={`${colorBoxWarn} h-30 rounded-xl flex items-center p-3 gap-2`}>
                <Box className={`${colorBoxIcon} rounded-sm p-4`}>
                    <Icon name='temperature' className={`${colorIcon} text-3xl`} />
                </Box>
                <Typography variant="body1" color={data.warn}>{data.mess}</Typography>
            </Box>
        </Grid >
    )
}
export default WeatherWarning