"use client"
import Icon from '@/utils/icons';
import { Grid, Stack, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import VerticalItem from '../VerticalItems';
import HorizoneItem from '../HorizoneItem';
import TinhTrangHienTai from '../TinhTrangHienTai';
import { useEffect, useState } from 'react';
import { dateFormated } from '@/utils/YearMonthDateFormate';
import { getWeatherIcon } from 'libs/WeatherIcon';
import WeatherWarning from '../WeatherWaring';
import LocationAutocomplete, { FlatLocation } from '../AutoCompleteLocation';
import RecommentLocation from '../RecommentLocation';

type ConfigurationProps = {
    latitude: string,
    longitude: string,
    current: string,
    hourly: string,
    daily: string,
    timezone: string,
    start_date: string,
    end_date: string,
}
// hourly=&daily=&timezone=auto&=2025-10-20&end_date=2025-10-27
// current 
const Homepage = () => {
    const currDate = new Date();

    const year = currDate.getFullYear();
    const month = String(currDate.getMonth() + 1).padStart(2, '0');
    const day = String(currDate.getDate()).padStart(2, '0');

    const next = new Date(currDate);
    next.setDate(currDate.getDate() + 7);

    const nextyear = next.getFullYear();
    const nextmonth = String(next.getMonth() + 1).padStart(2, '0');
    const nextday = String(next.getDate()).padStart(2, '0');

    const nextDate = `${nextyear}-${nextmonth}-${nextday}`;

    let configLoc = "&format=json&addressdetails=1";
    const [loc, setLoc] = useState<FlatLocation | String>("");

    const [config, setConfig] = useState<ConfigurationProps>({
        latitude: "10.7755254",
        longitude: "106.7021047",
        current: "temperature_2m_max,temperature_2m_min,temperature_2m,wind_speed_10m,weathercode",
        hourly: "temperature_2m,relative_humidity_2m,weathercode,precipitation_probability,pressure_msl,shortwave_radiation",
        daily: "temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset",
        timezone: "auto",
        start_date: dateFormated(currDate),
        end_date: dateFormated(nextDate)
    })
    const handleClick = async () => {
        let replaceStr = loc.label.replace(/\s+/g, '+');
        await fetch(process.env.NEXT_PUBLIC_ADDRESS_URL + replaceStr + configLoc)
            .then((res) => res.json())
            .then((data) => {
                setConfig((prev) => ({
                    ...prev,
                    latitude: data[0].lat.toString(),
                    longitude: data[0].lon.toString(),
                }));
            })
            .catch((err) => console.error("Lỗi fetch:", err));
    }

    const [weather, setWeather] = useState<any>({});
    const [currentData, setCurrentData] = useState<any>({})
    const [hourData, setHourData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    useEffect(() => {
        const fetchWeather = async () => {
            const weaConf = new URLSearchParams(config).toString();
            const res = await fetch(process.env.NEXT_PUBLIC_WEATHER_URL + weaConf);
            const data = await res.json();
            // console.log(data)
            setWeather(data);
            setCurrentData(data.current)


            currDate.setMinutes(0, 0, 0);
            const hoursMerged = data?.hourly.time.map((t: string, i: number) => ({
                time: t,
                temperature: data.hourly.temperature_2m[i],
                humidity: data.hourly.relative_humidity_2m[i],
                weathercode: data.hourly.weathercode[i],
                rainy_percent: data.hourly.precipitation_probability[i],
                pressure_msl: data.hourly.pressure_msl[i],
                shortwave_radiation: data.hourly.shortwave_radiation[i]

            }));

            const currentData = hoursMerged.reduce((prev, curr) => {
                const prevDiff = Math.abs(new Date(prev.time).getTime() - currDate.getTime());
                const currDiff = Math.abs(new Date(curr.time).getTime() - currDate.getTime());
                return currDiff < prevDiff ? curr : prev;
            });

            // console.log(currentData);
            const nextDate = new Date(currDate);
            nextDate.setDate(currDate.getDate() + 1);
            const filtered = hoursMerged
                .map((item, index) => {
                    const dateTime = new Date(item.time);

                    const isNow =
                        dateTime.getFullYear() === currDate.getFullYear() &&
                        dateTime.getMonth() === currDate.getMonth() &&
                        dateTime.getDate() === currDate.getDate() &&
                        dateTime.getHours() === new Date().getHours();
                    const isDay = dateTime.getHours() >= 6 && dateTime.getHours() < 18;
                    return {
                        ...item,
                        dateTime,
                        isNow,
                        isDay
                    };
                })
                .filter((item) => item.dateTime >= currDate && item.dateTime <= nextDate);

            setHourData(filtered);
            // DailyData

            const dailyRainyPercent: string[] = Object.values(
                data.hourly.time.reduce((acc: Record<string, number[]>, t: string, i: number) => {
                    const day = t.split("T")[0];
                    if (!acc[day]) acc[day] = [];
                    acc[day].push(data.hourly.precipitation_probability[i]);
                    return acc;
                }, {})
            ).map((values: any) => Math.round(values.reduce((a, b) => a + b, 0) / values.length).toString());


            const dailyMerged = data.daily.time.map((daily: any, index: number) => ({
                daily: daily,
                temp_max: data.daily.temperature_2m_max[index],
                temp_min: data.daily.temperature_2m_min[index],
                weathercode: data.daily.weathercode[index],
                rainy_percent: dailyRainyPercent[index],
                sunrise: data.daily.sunrise[index],
                sunset: data.daily.sunset[index],

            }))
            let today = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const currentTempMaxMin = dailyMerged.filter(item => item.daily === today);
            setCurrentData((prev) => ({
                ...prev,
                temperature_2m_max: currentTempMaxMin[0]?.temp_max,
                temperature_2m_min: currentTempMaxMin[0]?.temp_min,
                rainy_percent: currentData?.rainy_percent,
                sunrise: currentTempMaxMin[0]?.sunrise,
                sunset: currentTempMaxMin[0]?.sunset,
                wind: data.current.wind_speed_10m,
                humidity: currentData?.humidity,
                pressure_msl: currentData.pressure_msl,
                shortwave_radiation: currentData.shortwave_radiation || 0,
            }))

            setDailyData(dailyMerged);


        };



        fetchWeather();
    }, [config]);


    let baseSrc = "/google-weather-icons/v4/"

    const isDay = currDate.getHours() >= 6 && currDate.getHours() < 18;

    console.log(weather)

    return (
        <Grid container spacing={2} alignContent={'start'} className="px-3 min-h-screen">
            <Grid className="flex flex-row gap-2 px-2" size={12}>
                <LocationAutocomplete onSelect={setLoc} value={loc} />
                <Button
                    onClick={handleClick}
                    variant="contained"
                    color="primary"
                    sx={{
                        minWidth: 48,
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        padding: 4,
                    }}
                >
                    <Icon name='search' />
                </Button>

            </Grid>


            <Grid size={7}>
                <Stack>
                    <Typography variant="body1" color="initial">Lúc này</Typography>
                    <Stack direction={'row'} alignItems={'center'}>
                        <Typography className='relative t-0' variant="h1" color="initial">{Math.round(currentData?.temperature_2m)}°</Typography>
                        <Image width={60} height={70} src={`${baseSrc}${getWeatherIcon(currentData.weathercode, isDay)}`} alt={''} />
                    </Stack>
                    <Typography variant="body1" color="initial">{`Cao nhất ${currentData.temperature_2m_max}° • Thấp nhất ${currentData.temperature_2m_min}°`}</Typography>
                </Stack>
            </Grid>

            <Grid size={5}>
                <Stack className='h-full' direction={'column'} alignItems={'end'} justifyContent={'center'}>
                    <Typography variant="body1" color="initial">Khả năng mưa</Typography>
                    <Typography variant="body1" color="initial">{parseInt(currentData.rainy_percent)}%</Typography>
                </Stack>
            </Grid>

            <WeatherWarning temp={Math.round(currentData?.temperature_2m)} />

            <Grid size={12}>
                <RecommentLocation address={loc.label} weather={weather.current.weathercode} temp={Math.round(currentData?.temperature_2m)} />
            </Grid>
            
            <Grid size={12}>
                <Typography variant="body1" color="initial">{'Dự báo hàng giờ'}</Typography>
                <Box className="bg-info flex flex-row gap-8 max-w-full overflow-auto h-auto rounded-xl p-5">
                    {hourData.map((item, index) => (
                        <Box key={index} className="w-20">
                            <VerticalItem weather={item} />
                        </Box>
                    ))}
                </Box>
            </Grid>

            <Grid size={12}>
                <Typography variant="body1" color="initial">{'Dự báo thời tiết trong 7 ngày'}</Typography>
                <Stack gap={1} className="h-auto">
                    {dailyData.map((item, index) => (
                        <Box key={index} className="bg-info first:!rounded-t-lg last:!rounded-b-lg">
                            <HorizoneItem index={index} weather={item} />
                        </Box>
                    ))}
                </Stack>
            </Grid>

            <Grid size={12}>
                <Typography variant="body1" color="initial">Tình trạng hiện tại</Typography>
                <TinhTrangHienTai data={currentData} />
            </Grid>
        </Grid>
    )
}

export default Homepage
