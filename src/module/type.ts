
type Activities = {
    color:string;
    displayName:string;
    subTaskList:object;
}


type Dashboardwidget = {
    type:string;
    objName:string;
    name:string;
    description:string;
    areaX:number;
}

type Todaynote = {
    value:string;
}

type Day = {
    time:Record<string,any>;
    todayNote:Todaynote;
    objective:Record<string,string>;
}

type Notif = {
    title:string;
    description:string;
    link:string;
}

type Objective = {
    type:string;
    amount:string;
    category:Array<string>;
}

type dailytask = Record<string,string>;

type song = {
    title:string;
    artist:string;
    url:string;
    cover:string;
}

type Todaytask = {
    displayName:string;
    type:string;
    icon:string;
    after:string;
}

type Widgettask = {
    type:string;
    name:string;
    description:string;
    areaX:number;
    graphStatDisplay:Array<string>;
}

// export type User = {
//     id:string;
//     firstname:string;
//     lastname:string;
//     email:string;
//     password:string;
//     activities:Record<string,Activities>;
//     dailytask:Record<string,dailytask>;
//     dashboardwidget:Array<Dashboardwidget>;
//     day:Record<string,Day>;
//     notification:Array<Notif>;
//     objective:Record<string,Objective>;
//     song:Array<song>;
//     todaytask:Record<string,Todaytask>;
//     widgettask:Array<Widgettask>;
// }

export type User = {
    id:string;
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    activities:string;
    dailytask:string;
    dashboardwidget:string;
    day:string;
    notification:string;
    objective:string;
    song:string;
    todaytask:string;
    widgettask:string;
}