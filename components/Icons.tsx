
import React from 'react';
import { 
  User, MapPin, Shield, Search, Phone, Bell, 
  Navigation, Home, FileText, Users, MessageCircle, 
  Mic, X, PhoneOff, AlertTriangle, Radio, Menu, Check, Car, Clock, Sun
} from 'lucide-react';

// We wrap icons to ensure consistent stroke width of 1.5 or 1 for that "thin line" look
const iconProps = { strokeWidth: 1.25, className: "w-6 h-6 text-black" };

export const IconUser = (props: any) => <User {...iconProps} {...props} />;
export const IconMapPin = (props: any) => <MapPin {...iconProps} {...props} />;
export const IconShield = (props: any) => <Shield {...iconProps} {...props} />;
export const IconSearch = (props: any) => <Search {...iconProps} {...props} />;
export const IconPhone = (props: any) => <Phone {...iconProps} {...props} />;
export const IconPhoneOff = (props: any) => <PhoneOff {...iconProps} {...props} />;
export const IconBell = (props: any) => <Bell {...iconProps} {...props} />;
export const IconNavigation = (props: any) => <Navigation {...iconProps} {...props} />;
export const IconHome = (props: any) => <Home {...iconProps} {...props} />;
export const IconFileText = (props: any) => <FileText {...iconProps} {...props} />;
export const IconUsers = (props: any) => <Users {...iconProps} {...props} />;
export const IconMessage = (props: any) => <MessageCircle {...iconProps} {...props} />;
export const IconMic = (props: any) => <Mic {...iconProps} {...props} />;
export const IconX = (props: any) => <X {...iconProps} {...props} />;
export const IconAlert = (props: any) => <AlertTriangle {...iconProps} {...props} />;
export const IconRadio = (props: any) => <Radio {...iconProps} {...props} />;
export const IconMenu = (props: any) => <Menu {...iconProps} {...props} />;
export const IconCheck = (props: any) => <Check {...iconProps} {...props} />;
export const IconCar = (props: any) => <Car {...iconProps} {...props} />;
export const IconClock = (props: any) => <Clock {...iconProps} {...props} />;
export const IconSun = (props: any) => <Sun {...iconProps} {...props} />;
