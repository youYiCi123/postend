export interface addDep {
  depName: string;
  leadName: string;
  leadPhone: string;
  note: string;
}

export interface DepInfo {
  id: string;
  depName: string;
  leadName: string;
  leadPhone: string;
  note: string;
  createTime: Date;
}

export interface DepTableInfo {
  id: string;
  depName: string;
  leadName: string;
  leadPhone: string;
  note: string;
}

export interface DepIdAndName {
   id:string;
   depName:string;
}

export interface UserOfDep{
    nickName:string;
    phoneNumber:string;
    address:string;
    duty:string;
}
