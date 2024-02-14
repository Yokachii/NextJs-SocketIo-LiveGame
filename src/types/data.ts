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
  rooms?:string;
  user1Friends?:Array<Friends1>;
  user2Friends?:Array<Friends1>;
  studys?:string;
}

type Friends1 = {
  email:string;
  firstname:string;
  friendships:FriendShip;
  id:string;
  lastname:string;
}

type FriendShip = {
  id:string;
  user1Id:string;
  user2Id:string;
}

type PlayerSqlType = {
  color:string;
  name:string;
  elo:string;
  id:string;
}

type ChatItemType = {
  message:string;
  name:string;
  roomid:string;
  id:string;
}

type MoveInfo = {

  from:string;
  to:string;
  promotion?:string;

}

type Session = {
  id:string;
  name?:string|null|undefined;
  email?:string|null|undefined;
  image?:string|null|undefined;
}

export type { Session,UserTypeWithRoom,UserInfo,PlayerSqlType,ChatItemType,MoveInfo };
