import { dateFormated } from "@/utils/YearMonthDateFormate";
import { Grid, Typography } from "@mui/material"
import { getWeatherIcon } from "libs/WeatherIcon";
import Image from "next/image";

const VerticalItem = ({ weather }: any) => {
    let baseSrc = "/google-weather-icons/v4/"


    return (
        <Grid className="w-15" justifyContent={'center'} container>
            <Grid size={12}>
                <Typography variant="body1" textAlign={'center'} color="initial">{Math.round(weather.temperature)}°</Typography>
            </Grid>
            <Grid size={12}>
                <Typography variant="body2" textAlign={'center'} color="initial">{weather.humidity}%</Typography>
            </Grid>
            <Grid className="flex flex-clo items-center justify-center" size={12}>
                <Image width={40} height={70} src={`${baseSrc}${getWeatherIcon(weather.weathercode, weather.isDay)}`} alt={''} />
            </Grid>

            <Grid size={12}>
                <Typography variant="body2" textAlign={'center'} color="initial">{weather.isNow ? "Lúc này" : weather.time.split("T")[1]}</Typography>
            </Grid>
        </Grid >
    )
}

export default VerticalItem;