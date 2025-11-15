import { Grid, Stack, Typography } from "@mui/material"
import Image from "next/image"

const TinhTrangHienTai = ({ data }) => {
    if (data)
        return (
            <Grid container spacing={2}>
                {/* Gió */}
                <Grid size={6}>
                    <Grid container
                        className="bg-info rounded-xl h-40 p-4">
                        <Grid size={12}>
                            <Typography variant="body1">Gió</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="h5" noWrap>
                                {data.wind}
                                <br />
                                Km/h
                            </Typography>
                        </Grid>
                        <Grid size="grow">
                            <Image
                                src={"/wind@1x-1.0s-200px-200px.svg"}
                                alt="wind"
                                width={100}
                                height={100}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Độ ẩm */}
                <Grid size={6}>
                    <Grid container
                        className="bg-info rounded-xl h-40 p-4">
                        <Grid size={12}>
                            <Typography variant="body1">Độ ẩm</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="h5">{data.humidity}%</Typography>
                        </Grid>
                        <Grid size="grow">
                            <Image
                                src={"/water@1x-1.0s-200px-200px.svg"}
                                alt="humidity"
                                width={100}
                                height={100}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Chỉ số tia cực tím */}
                <Grid size={6}>
                    <Grid
                        container
                        className="bg-info rounded-xl h-40 p-4"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Grid size={12}>
                            <Typography variant="body1">Chỉ số tia cực tím</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="h5">
                                {((data.shortwave_radiation * 0.04) / 10).toFixed(1)}
                            </Typography>
                        </Grid>
                        <Grid size="grow">
                            <Image
                                src={"/sun@1x-1.0s-200px-200px.svg"}
                                alt="uv"
                                width={100}
                                height={100}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Áp suất */}
                <Grid size={6}>
                    <Grid
                        container
                        className="bg-info rounded-xl h-40 p-4"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Grid size={12}>
                            <Typography variant="body1">Áp suất</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="h5">{data.pressure_msl} Pa</Typography>
                        </Grid>
                        <Grid size="grow">
                            <Image
                                src={"/pressure_8833267.png"}
                                alt="pressure"
                                width={100}
                                height={100}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Mặt trời mọc / lặn */}
                <Grid size={12}>
                    <Grid
                        container
                        className="bg-info rounded-xl h-40 p-4"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Grid>
                            <Typography variant="body1">Mặt trời mọc và lặn</Typography>
                            <Typography variant="h5">
                                Mặt trời mọc{" "}
                                {data?.sunrise && data.sunrise.split("T")[1]}
                            </Typography>
                            <Typography variant="h5">
                                Mặt trời lặn{" "}
                                {data?.sunset && data.sunset.split("T")[1]}
                            </Typography>
                        </Grid>
                        <Grid>
                            <Image
                                src={"/sunset_1164990.png"}
                                alt="sunset"
                                width={100}
                                height={100}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
        )
}

export default TinhTrangHienTai