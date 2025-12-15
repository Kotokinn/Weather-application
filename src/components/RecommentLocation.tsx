import { Box, Typography, Card } from "@mui/material"
import MapEmbed from "./MapEmbed"
import { FlatLocation } from "./AutoCompleteLocation"

function suggestByWeather(weather: string, temp: number) {
    if (weather.includes("mưa")) {
        return "Trời mưa, nên đi cafe trong nhà, xem phim hoặc trung tâm thương mại."
    }

    if (weather.includes("nắng") && temp > 33) {
        return "Trời nắng nóng, nên đi uống nước, đi bơi hoặc vào nơi có máy lạnh."
    }

    if (weather.includes("nắng")) {
        return "Thời tiết đẹp, thích hợp đi dạo, chụp ảnh hoặc đi chơi ngoài trời."
    }

    return "Thời tiết ổn, bạn có thể đi chơi tùy thích."
}

function weatherCodeToText(code: number): string {
    if (code === 0) return "trời quang"
    if (code <= 3) return "ít mây"
    if (code <= 48) return "sương mù"
    if (code <= 67) return "mưa"
    if (code <= 77) return "tuyết"
    if (code <= 82) return "mưa rào"
    if (code <= 99) return "dông"
    return "thời tiết không xác định"
}

const RecommentLocation = ({
    address,
    weather,
    temp
}: {
    address: any
    weather: number
    temp: number
}) => {
    const suggestion = suggestByWeather(weatherCodeToText(weather), temp)

    return (
        <Box className="bg-white p-3 rounded-xl">
            <Typography fontWeight={600}>📍 Gợi ý đi chơi</Typography>

            <Typography variant="body2" color="text.secondary">
                Địa điểm: {address}
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={1}>
                Thời tiết: {weatherCodeToText(weather)}, {temp}°C
            </Typography>

            <Card sx={{ overflow: "hidden", borderRadius: 2, mb: 1 }}>
                <MapEmbed address={address} />
            </Card>

            <Typography>
                💡 {suggestion}
            </Typography>
        </Box>
    )
}

export default RecommentLocation