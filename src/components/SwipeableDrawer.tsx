"use client";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import { Box, TextField, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDataBase } from "@/hooks/database";
import { useForm, Controller } from "react-hook-form"
import type { Event } from "@/hooks/database/models/event";

type FormDataType = {
  id: number | null,
  title: string,
  date: string,
  description: string
}

const drawerBleeding = 56;

const Puller = styled("div")(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: grey[400],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 20px)",
}));

export default function SwipeableEdgeDrawer({ open, setOpen, data, setReload }: { setReload: (value: string) => void, data: any, open: boolean; setOpen: (v: boolean) => void; }) {
  const { reset, control, handleSubmit, watch } = useForm<Event>({
    defaultValues: {
      id: null,
      title: "",
      date: "",
      description: "",
    }
  });

  // console.log(data.daily)
  const { insertData, delDataByDate, getDataByDate } = useDataBase()
  const [drawerHeight, setDrawerHeight] = useState(0.4);

  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchY = e.touches[0].clientY;
    const windowHeight = window.innerHeight;
    const newHeight = Math.min(Math.max((windowHeight - touchY) / windowHeight, 0.4), 0.95);
    setDrawerHeight(newHeight);
  };

  const handleTouchEnd = () => {
    if (drawerHeight > 0.5) setDrawerHeight(0.95);
    else setDrawerHeight(0.4);
  };

  const onSubmit = async (data: FormDataType, e: React.FormEvent<HTMLFormElement>) => {
    // const form = e.target as HTMLFormElement
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    const action = submitter?.value

    // console.log(action)
    try {
      if (action === "reg") {
        await insertData('event', [data]);
        setReload(new Date() + "")
        console.log("dcm reg")
        setOpen(false)
      } if (action === "del") {
        const date = watch("date")
        await delDataByDate('event', date)
        setReload(new Date() + "")
        console.log("dcm del")
        setOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // const handleDelete = async () => {
  //   delDataByDate()
  // }

  useEffect(() => {
    reset({
      id: null,
      title: "",
      date: data || "",
      description: "",
    })
  }, [])

  useEffect(() => {
    const load = async () => {
      const res = await getDataByDate('event', data)
      reset(res[0])
    }
    load()
  }, [data])
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      swipeAreaWidth={drawerBleeding}
      disableSwipeToOpen={false}
      keepMounted
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          height: `${drawerHeight * 94}vh`,
          transition: "height 0.25s ease",
          overflow: "visible",
        },
      }}
    >
      {/* Header + Puller */}
      <Box
        sx={{
          position: "absolute",
          top: -drawerBleeding,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          right: 0,
          left: 0,
          height: drawerBleeding,
          backgroundColor: "background.paper",
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Puller />
        <Typography sx={{ p: 2, color: "text.secondary", textAlign: "center" }}>
          Kéo lên để xem thêm
        </Typography>
      </Box>

      {/* Form nội dung */}
      <Box sx={{ p: 2, overflow: "auto", height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Đăng ký sự kiện
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên"
                variant="outlined"
                fullWidth
                value={field.value}
                sx={{ mb: 2 }}
                required
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mô tả"
                variant="outlined"
                fullWidth
                multiline
                value={field.value}
                rows={3}
                sx={{ mb: 2 }}
              />
            )} />

          <Stack direction={'row'} gap={2}>
            <Button type="submit" name="action" value="reg" variant="contained" fullWidth>
              Đăng ký
            </Button>
            <Button type="submit" name="action" value="del" variant="contained" color="error">
              Xóa
            </Button>
          </Stack>
        </form>

        {submittedData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Dữ liệu đã gửi:</Typography>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </Box>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
