import type { FC } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HomeIcon from "@mui/icons-material/Home";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LinkIcon from "@mui/icons-material/Link";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PersonIcon from '@mui/icons-material/Person';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import SearchIcon from '@mui/icons-material/Search';

const icons = {
    menu: MenuIcon,
    home: HomeIcon,
    security: SecurityIcon,
    signal: SignalCellularAltIcon,
    userSetting: ManageAccountsIcon,
    link: LinkIcon,
    add: AddIcon,
    filter: FilterAltIcon,
    power: PowerSettingsNewIcon,
    arrowRight: KeyboardArrowRightIcon,
    arrowLeft: KeyboardArrowLeftIcon,
    temperature: DeviceThermostatIcon,
    close: CloseIcon,
    videoCam: VideocamIcon,
    minus: HorizontalRuleIcon,
    hmore: MoreHorizIcon,
    density: DensityMediumIcon,
    setting: SettingsIcon,
    backArrow: ArrowBackIosIcon,
    person: PersonIcon,
    remote: SettingsRemoteIcon,
    search: SearchIcon
};

type IconName = keyof typeof icons;

export interface IconProps {
    name: IconName;
    className?: string;
    size?: "small" | "medium" | "large";
}

const Icon: FC<IconProps> = ({ name, className, size }) => {
    const Component = icons[name];
    return <Component className={className} fontSize={size} />;
};

export default Icon;
