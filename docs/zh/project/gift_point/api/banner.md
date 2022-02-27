---
sidebar: false
prev: /zh/project/gift_point/gift-point-api
---

> REQUEST:
```json
{
    "app_id": "2021001169664470"
}
```

> RESPONSE:
```json
{
    "code": 200,
    "msg": "ok",
    "status": true,
    "data": [
        {
            "id": 3,
            "image": "https://a.com/a.jpeg",
            "type": "TASK", //  枚举:TASK|NORMAL
            "target_type": "", // 枚举:小程序|生活号|生活号文章|H5|二级页面|其他
            "target": "", // 跳转地址
            "status": "10", // 枚举:10上架;20:下架;30:删除
            "sort": 10, // 排序数值
            "task_id": 1, // 当 type 为NORMAL时,为0
            "remark": "轮播中完成任务的banner", // 备注
            "create_time": "2022-01-19 20:47:23",
            "modify_time": "2022-01-20 14:36:00",
            "task_info": { // 当 type 为TASK时有值,详情见任务接口
                "id": 1,
                "icon": "https://a.com/a.jpeg",
                "name": "华夏银行信用卡",
                "flag": "浏览类任务",
                "remark": "1",
                "reward_desc": "10个集分宝",
                "reward_type": "集分宝",
                "amount": 10,
                "btn_desc": [
                    "立即领取",
                    "浏览10S"
                ],
                "target_type": "小程序",
                "target": "2021002194625253",
                "repeat": 1,
                "sort": 1,
                "status": "10",
                "create_time": "2022-01-18 11:05:55",
                "modify_time": "2022-01-18 11:06:52"
            }
        }
    ]
}
```