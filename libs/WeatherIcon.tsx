export const getWeatherIcon = (code: number, isDay: boolean) => {

    switch (true) {
        case code === 0:
            return isDay ? "clear_day.svg" : "clear_night.svg"; // trời quang
        case [1, 2].includes(code):
            return isDay ? "mostly_clear_day.svg" : "mostly_clear_night.svg"; // mây nhẹ
        case code === 3:
            return "cloudy.svg"; // nhiều mây
        case [45, 48].includes(code):
            return "fog.svg"; // sương mù 
        case [51, 53, 55, 61, 63, 65].includes(code):
            return "heavy_rain.svg"; // mưa
        case [66, 67, 80, 81, 82].includes(code):
            return "isolated_thunderstorms.svg"; // mưa rào / dông
        case [71, 73, 75, 77].includes(code):
            return "heavy_snow.svg"; // tuyết
        case [95, 96, 99].includes(code):
            return "strong_thunderstorms.svg"; // dông mạnh
        default:
            return "❔";
    }
};
