type UserTypeWithRoom = {
  id:string;
  firstname?:string;
  lastname?:string;
  email?:string;
  password?:string;
  activities?:string;
  dailytask?:string;
  dashboardwidget?:string;
  day?:string;
  notification?:string;
  objective?:string;
  song?:string;
  todaytask?:string;
  widgettask?:string;
  links?:string;
  rooms?:string;
}

type UserInfo = {
  id:string;
  firstname?:string;
  lastname?:string;
  email?:string;
  password?:string;
  activities?:string;
  dailytask?:string;
  dashboardwidget?:string;
  day?:string;
  notification?:string;
  objective?:string;
  song?:string;
  todaytask?:string;
  widgettask?:string;
  links?:string;
}

export type { UserTypeWithRoom,UserInfo };
