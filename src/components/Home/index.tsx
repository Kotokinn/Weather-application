"use client"
import Icon from '@/utils/icons';
import { Grid, TextField, Stack, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import VerticalItem from '../VerticalItems';
import HorizoneItem from '../HorizoneItem';
import TinhTrangHienTai from '../TinhTrangHienTai';
import { useEffect, useState } from 'react';
import { time } from 'console';
import { dateFormated } from '@/utils/YearMonthDateFormate';
import { getWeatherIcon } from 'libs/WeatherIcon';
import WeatherWarning from '../WeatherWaring';

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


    const nextDate = `${year}-${month}-${parseInt(day) + 7}`;

    let configLoc = "&format=json&addressdetails=1";
    const [locationStr, setLocationStr] = useState("Hồ Chí Minh");
    const [config, setConfig] = useState<ConfigurationProps>({
        latitude: "10.7755254",
        longitude: "106.7021047",
        current: "temperature_2m_max,temperature_2m_min,temperature_2m,wind_speed_10m,weathercode",
        hourly: "temperature_2m,relative_humidity_2m,weathercode,precipitation_probability",
        daily: "temperature_2m_max,temperature_2m_min,weathercode",
        timezone: "auto",
        start_date: dateFormated(currDate),
        end_date: dateFormated(nextDate)
    })
    const handleClick = async () => {
        let replaceStr = locationStr.replaceAll(" ", "+");
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
            setWeather(data);

            currDate.setMinutes(0, 0, 0);
            const hoursMerged = data.hourly.time.map((t: string, i: number) => ({
                time: t,
                temperature: data.hourly.temperature_2m[i],
                humidity: data.hourly.relative_humidity_2m[i],
                weathercode: data.hourly.weathercode[i],
                rainy_percent: data.hourly.precipitation_probability[i]
            }));

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
                rainy_percent: dailyRainyPercent[index]
            }))
            setDailyData(dailyMerged);


            const currentTempMaxMin = dailyMerged.filter(item => item.daily === `${year}-${month}-${parseInt(day)}`);
            const currentMerged = {
                ...
                data.current,
                temperature_2m_max: currentTempMaxMin[0].temp_max,
                temperature_2m_min: currentTempMaxMin[0].temp_min

            }
            setCurrentData(currentMerged)
        };

        fetchWeather();
    }, [config]);


    let baseSrc = "/google-weather-icons/v4/"

    const isDay = currDate.getHours() >= 6 && currDate.getHours() < 18;

    console.log(currentData)
    return (
        <Grid container spacing={2} alignContent={'start'} className="px-3 min-h-screen">
            <Grid className="flex flex-row gap-2 px-2" size={12}>
                <TextField fullWidth
                    // id=""
                    variant='standard'
                    label=""
                    placeholder='Vi tri'
                    value={locationStr}
                    onChange={(e) => setLocationStr(e.target.value)}

                />
                <Button onClick={handleClick} variant="text" color="primary">
                    Search
                </Button>
            </Grid>
            <Grid size={6}>
                <Stack>
                    <Typography variant="body1" color="initial">Lúc này</Typography>
                    <Stack direction={'row'} alignItems={'center'}>
                        <Typography className='relative t-0' variant="h1" color="initial">{Math.round(currentData?.temperature_2m)}°</Typography>
                        <Image width={60} height={70} src={`${baseSrc}${getWeatherIcon(currentData.weathercode, isDay)}`} alt={''} />
                    </Stack>
                    <Typography variant="body1" color="initial">{`Cao nhất ${currentData.temperature_2m_max}° • Thấp nhất ${currentData.temperature_2m_min}°`}</Typography>
                </Stack>
            </Grid>

            <Grid size={6}>
                <Stack className='h-full' direction={'column'} alignItems={'end'} justifyContent={'center'}>
                    <Typography variant="body1" color="initial">mua nho</Typography>
                    <Typography variant="body1" color="initial">cam giac nhu 36</Typography>
                </Stack>
            </Grid>

            <WeatherWarning temp={Math.round(currentData?.temperature_2m)} />

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
                            <HorizoneItem weather={item} />
                        </Box>
                    ))}
                </Stack>
            </Grid>

            <Grid size={12}>
                <Typography variant="body1" color="initial">Tinh trang hien tai</Typography>

                <TinhTrangHienTai />
            </Grid>
        </Grid>
    )
}

export default Homepage
