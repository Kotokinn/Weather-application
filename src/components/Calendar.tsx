"use client"
import { Divider, Drawer, Grid, IconButton } from "@mui/material"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useState } from "react";
import Icon from "@/utils/icons";
import SwipeableEdgeDrawer from "./SwipeableDrawer";
import { useDataBase } from "@/hooks/database";


const Calendar = ({ open, setOpen, item }) => {

    const { getData } = useDataBase()
    const [date, setDate] = useState(item.daily)
    const [events, setEvents] = useState([]);
    const [openSwipeable, setOpenSwipeable] = useState(false)
    const [reload, setReload] = useState("")

    const handleDateClick = (arg) => {
        setOpenSwipeable(true)
        setDate(arg.dateStr)
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setOpenSwipeable(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const data = async () => {
            const res = await getData('event') //array data
            // console.log(res)
            setEvents(res)
        }
        data();
    }, [open, reload])
    return (
        <Fragment>
            <Drawer anchor="right" open={open} onClose={setOpen}>
                <Grid className="p-3 pt-9" container spacing={2}>
                    <Grid size={12}>
                        <IconButton aria-label="" onClick={() => setOpen(false)}>
                            <Icon name="arrowLeft" className="!text-3xl" />
                        </IconButton>
                    </Grid>
                    <Grid size={12}><Divider /></Grid>
                    <Grid size={12}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            dateClick={handleDateClick}
                            editable={true}
                            selectable={true}
                            height="auto"
                            dayCellClassNames={(arg) => {
                                const localDateStr = arg.date.toLocaleDateString("sv"); //! Local time
                                if (item?.daily === localDateStr) {
                                    return "bg-blue-200";
                                }
                                return [];
                            }}
                        />
                    </Grid>
                </Grid>
                <SwipeableEdgeDrawer setReload={setReload} data={date} open={openSwipeable} setOpen={setOpenSwipeable} />
            </Drawer>
        </Fragment>
    )
}
export default Calendar