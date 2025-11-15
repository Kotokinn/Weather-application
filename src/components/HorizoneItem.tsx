import { useLongPress } from '@/utils/CustomEvent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { getWeatherIcon } from 'libs/WeatherIcon'
import Image from 'next/image'
import { Fragment, useEffect, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Icon from '@/utils/icons'
import Tooltip from '@mui/material/Tooltip'
import Calendar from './Calendar'


const HorizoneItem = ({ weather, index }: any) => {
    let baseSrc = "/google-weather-icons/v4/"
    const date = new Date(weather.daily);

    const formatted = date.toLocaleDateString("vi-VN", {
        weekday: "long",  // Thứ hai, Thứ ba...
        day: "numeric",   // 20
        month: "long",    // tháng 10
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0)
    const isCurrentDate = date.getTime() === today.getTime();

    const [open, setOpen] = useState(false)
    const handleOpenCalendar = () => {
        setOpen(true)
    }

    return (
        <Fragment>
            <Grid className="p-3 w-full" alignItems={'center'} justifyContent={'space-evenly'} container spacing={0}>
                <Grid size={6}>
                    <Typography variant="body1" color="initial">{isCurrentDate ? "Hôm nay" : formatted}</Typography>
                </Grid>
                <Grid className="flex flex-row gap-2 items-center" size={'grow'}>
                    <Typography variant="body1" color="initial">{weather.rainy_percent}%</Typography>
                    <Image width={30} height={70} src={`${baseSrc}${getWeatherIcon(weather.weathercode, weather.isDay)}`} alt={''} />
                </Grid>
                <Grid size={'auto'}>
                    <Typography variant="body1" color="initial">{`${Math.round(weather.temp_max)}°/${Math.round(weather.temp_min)}°`}</Typography>
                </Grid>
                <Grid size={1}>
                    <Tooltip title="Thêm sự kiện">
                        <IconButton aria-label="add-event" onClick={handleOpenCalendar}>
                            <Icon name="add" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid >
            <Calendar open={open} setOpen={setOpen} item={weather} />
        </Fragment>


    )
}
export default HorizoneItem