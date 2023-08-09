export interface Hospital {
    id: string,
    // 医院名称
    hospitalName: string,
    // 主任姓名
    directorName: string,
    // 主任电话
    directorPhone: string,
    //业务名称 
    serviceName: string,
    //设备型号/编号
    equipmentModel: string,
    // 省、市、区、详细地址
    receiverDetailAddress: string,
    receiverProvince: string,
    receiverCity: string,
    receiverRegion: string,
}