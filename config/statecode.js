import Lang from './lang'

export default {
    DELIVERY_TYPE_EXPRESS : 1,    //快递配送（运费 10 元）
    DELIVERY_TYPE_EMS : 2,    //EMS（邮政）
    DELIVERY_TYPE_MAIL : 3,    //平邮
    DELIVERY_TYPE_AIR_FREIGHT : 4,    //货运（空运、水运、铁路运输、公路运输）
    DELIVERY_TYPE_SELF_PICK_UP : 5,    //自提（运费 0 元）
    DELIVERY_TYPE_EXP : 10,    //配送
    
    DELIVERY_TIME_NO_LIMIT: 1,    //不限送货时间：周一至周日
    DELIVERY_TIME_WORKING_DAY: 2,    //工作日送货：周一至周五
    DELIVERY_TIME_WEEKEND: 3,    //双休日、假日送货：周六至周日


    PRODUCT_STATE_ILLEGAL: 1000, //违规下架禁售
    PRODUCT_STATE_NORMAL: 1001, //正常
    PRODUCT_STATE_OFF_THE_SHELF: 1002, //下架


    ACTIVITY_TYPE_BARGAIN: 1101, //加价购
    ACTIVITY_TYPE_GIFT: 1102, //店铺满赠-小礼品
    ACTIVITY_TYPE_LIMITED_DISCOUNT: 1103, //限时折扣
    ACTIVITY_TYPE_DISCOUNT_PACKAGE: 1104, //优惠套装
    ACTIVITY_TYPE_VOUCHER: 1105, //店铺优惠券  coupon 优惠券
    ACTIVITY_TYPE_DIY_PACKAGE: 1106, //拼团
    ACTIVITY_TYPE_REDUCTION: 1107, //满减
    ACTIVITY_TYPE_REDUCTION_AGAIN: 1140, //折上折


    ACTIVITY_TYPE_MARKETING: 1131,//市场活动
    ACTIVITY_TYPE_GIFTBAG: 1132,//组合套餐
    ACTIVITY_TYPE_LOTTERY: 1121,//幸运大抽奖
    ACTIVITY_TYPE_FLASHSALE: 1122,//秒杀
    ACTIVITY_TYPE_GROUPBOOKING: 1123,//市场活动
    ACTIVITY_TYPE_CUTPRICE: 1124,//砍价
    ACTIVITY_TYPE_YIYUAN: 1125,//一元购
    ACTIVITY_TYPE_BATDISCOUNT: 1135, //阶梯价
    ACTIVITY_TYPE_MULTIPLEDISCOUNT: 1133, //多件折

    ACTIVITY_GROUPBOOKING_SALE_PRICE: 1, //以固定折扣购买
    ACTIVITY_GROUPBOOKING_FIXED_AMOUNT: 2, //以固定价格购买
    ACTIVITY_GROUPBOOKING_FIXED_DISCOUNT: 3, //优惠固定金额

    MARKRTING_ACTIVITY_JOIN: 1,//参加活动
    MARKRTING_ACTIVITY_JOIN_BY_QRCODE: 2,//通过二维码参加

    SOURCE_TYPE_OTHER: 2310, //来源于其它
    SOURCE_TYPE_PC: 2311, //来源于pc端
    SOURCE_TYPE_H5: 2312, //来源于H5端
    SOURCE_TYPE_APP: 2313, //来源于APP
    SOURCE_TYPE_MP: 2314, //来源于小程序

    SOURCE_FROM_OTHER: 2320, //来源于其它
    SOURCE_FROM_WECHAT: 2321, //来源于微信平台，包含公众号，小程序等等
    SOURCE_FROM_BAIDU: 2322, //来源于百度
    SOURCE_FROM_ALIPAY: 2323, //来源于支付宝
    SOURCE_FROM_TOUTIAO: 2324, //来源于头条

    VOUCHER_STATE_UNUSED: 1501, //未用
    VOUCHER_STATE_USED: 1502, //已用
    VOUCHER_STATE_TIMEOUT: 1503, //过期
    VOUCHER_STATE_DEL: 1504, //收回

    //商品标签
    PRODUCT_TAG_NEW: 1401, //新品上架
    PRODUCT_TAG_REC: 1402, //热卖推荐
    PRODUCT_TAG_BARGAIN: 1403, //清仓优惠
    PRODUCT_TAG_BARGAIN1: 1404, //清仓优惠
    PRODUCT_TAG_BARGAIN2: 1405, //清仓优惠

    //商品种类
    PRODUCT_KIND_ENTITY: 1201, //实体商品	实物商品 （物流发货）
    PRODUCT_KIND_FUWU: 1202, //虚拟商品	虚拟商品 （无需物流）
    PRODUCT_KIND_CARD: 1203, //电子卡券	电子卡券 （无需物流）


    PRODUCT_VERIFY_REFUSED: 3000, //审核未通过
    PRODUCT_VERIFY_PASSED: 3001, //审核通过
    PRODUCT_VERIFY_WAITING: 3002, //审核中

    ORDER_STATE_WAIT_PAY: 2010, //待付款 - 虚拟映射
    ORDER_STATE_WAIT_PAID: 2016, //已经付款 - 虚拟映射
    ORDER_STATE_WAIT_REVIEW: 2011, //待订单审核
    ORDER_STATE_WAIT_FINANCE_REVIEW: 2013, //待财务审核
    ORDER_STATE_PICKING: 2020, //待配货
    ORDER_STATE_WAIT_SHIPPING: 2030, //待发货
    ORDER_STATE_SHIPPED: 2040, //已发货
    ORDER_STATE_RECEIVED: 2050, //已签收
    ORDER_STATE_FINISH: 2060, //已完成
    ORDER_STATE_CANCEL: 2070, //已取消
    ORDER_STATE_SELF_PICKUP: 2080, //自提     交易关闭	         交易关闭


    ORDER_PAID_STATE_NO: 3010, //未付款
    ORDER_PAID_STATE_FINANCE_REVIEW: 3011, //待付款审核
    ORDER_PAID_STATE_PART: 3012, //部分付款
    ORDER_PAID_STATE_YES: 3013, //已付款

    ORDER_PICKING_STATE_NO: 3020, //未出库
    ORDER_PICKING_STATE_PART: 3021, //部分出库通过拆单解决这种问题
    ORDER_PICKING_STATE_YES: 3022, //已出库

    ORDER_SHIPPED_STATE_NO: 3030, //未发货
    ORDER_SHIPPED_STATE_PART: 3031, //部分发货
    ORDER_SHIPPED_STATE_YES: 3032, //已发货

    VIRTUAL_ORDER_USED: 2101, //虚拟订单已使用
    VIRTUAL_ORDER_UNUSE: 2100, //虚拟订单未使用
    VIRTUAL_ORDER_TIMEOUT: 2103, //虚拟订单过期

    ORDER_CANCEL_BY_BUYER: 2201, //买家取消订单
    ORDER_CANCEL_BY_SELLER: 2202, //卖家取消订单
    ORDER_CANCEL_BY_ADMIN: 2203, //平台取消


    //订单来源
    ORDER_FROM_PC: 2301, //来源于pc端
    ORDER_FROM_WAP: 2302, //来源于WAP手机端
    ORDER_FROM_WEBPOS: 2303, //来源于WEBPOS线下下单

    //状态
    SETTLEMENT_STATE_WAIT_OPERATE: 2401, //已出账
    SETTLEMENT_STATE_SELLER_COMFIRMED: 2402, //商家已确认
    SETTLEMENT_STATE_PLATFORM_COMFIRMED: 2403, //平台已审核
    SETTLEMENT_STATE_FINISH: 2404, //结算完成

    ORDER_RETURN_NO: 2500, //无退货
    ORDER_RETURN_ING: 2501, //退货中
    ORDER_RETURN_END: 2502, //退货完成

    ORDER_REFUND_STATE_NO: 2600, //无退款
    ORDER_REFUND_STATE_ING: 2601, //退款中
    ORDER_REFUND_STATE_END: 2602, //退款完成


    ORDER_TYPE_DD: 3061, //订单类型
    ORDER_TYPE_FX: 3062, //分销订单
    ORDER_TYPE_TH: 3066, //分销订单


    ACTIVITY_STATE_WAITING: 0, //活动状态:0-未开启
    ACTIVITY_STATE_NORMAL: 1, //活动状态:1-正常
    ACTIVITY_STATE_FINISHED: 2, //活动状态:2-已结束
    ACTIVITY_STATE_CLOSED: 3, //活动状态:3-管理员关闭

    GET_VOUCHER_FREE: 1, //活动状态:1-免费参与,
    GET_VOUCHER_BY_POINT: 2, //活动状态:2-积分参与,
    GET_VOUCHER_BY_PURCHASE: 3, //活动状态:3-购买参与


    CART_GET_TYPE_BUY: 1, //购买
    CART_GET_TYPE_POINT: 2, //积分兑换
    CART_GET_TYPE_GIFT: 3, //赠品
    CART_GET_TYPE_BARGAIN: 4, //活动促销

    /*
       BILL_TYPE_PO   : 4001,   //购货单
       BILL_TYPE_PORO : 4002,   //销货退货单
       BILL_TYPE_OI   : 4003,   //其他入库单
       BILL_TYPE_SO   : 4031,   //销货单
       BILL_TYPE_SORO : 4032,   //购货退货单
       BILL_TYPE_OO   : 4033,   //其他出库单
    */

    STOCK_IN_PURCHASE: 2701,   //采购入库
    STOCK_IN_RETURN: 2702,   //退货入库
    STOCK_IN_ALLOCATE: 2703,   //调库入库
    STOCK_IN_INVENTORY_P: 2704,   //盘盈入库
    STOCK_IN_INIT: 2705,   //期初入库
    STOCK_IN_OTHER: 2706,   //手工入库
    STOCK_OUT_SALE: 2751,   //销售出库
    STOCK_OUT_DAMAGED: 2752,   //损坏出库
    STOCK_OUT_ALLOCATE: 2753,   //调库出库
    STOCK_OUT_LOSSES: 2754,   //盘亏出库
    STOCK_OUT_OTHER: 2755,   //手工出库
    STOCK_OUT_PO_RETURN: 2756,   //损坏出库


    STOCK_OUT_ALL: 2700,   //出库单
    STOCK_IN_ALL: 2750,   //入库单

    BILL_TYPE_OUT: 2700,   //出库单
    BILL_TYPE_IN: 2750,   //入库单


    BILL_TYPE_SO: 2800,   //销售订单
    BILL_TYPE_PO: 2850,   //采购订单


    //修改掉，和订单状态对应。
    ORDER_PROCESS_SUBMIT: 3070, //【客户】提交订单1OrderOrder

    ORDER_PROCESS_PAY: 2010, //待支付Order
    ORDER_PROCESS_CHECK: 2011, //订单审核1OrderOrder
    ORDER_PROCESS_FINANCE_REVIEW: 2013, //财务审核0OrderOrder
    ORDER_PROCESS_OUT: 2020, //出库审核商品库存在“出库审核”节点完成后扣减，如需进行库存管理或核算销售成本毛利，需开启此节点。0OrderOrder
    ORDER_PROCESS_SHIPPED: 2030, //发货确认如需跟踪订单物流信息，需开启此节点0OrderOrder
    ORDER_PROCESS_RECEIVED: 2040, //【客户】收货确认0OrderOrder

    ORDER_PROCESS_FINISH: 3098, //完成1OrderOrder

    RETURN_PROCESS_SUBMIT: 3100, //【客户】提交退单1ReturnReturn
    RETURN_PROCESS_CHECK: 3105, //退单审核1ReturnReturn
    RETURN_PROCESS_RECEIVED: 3110, //收货确认0ReturnReturn
    RETURN_PROCESS_REFUND: 3115, //退款确认0ReturnReturn
    RETURN_PROCESS_RECEIPT_CONFIRMATION: 3120, //客户】收款确认0ReturnReturn
    RETURN_PROCESS_FINISH: 3125, //完成1ReturnReturn3130-商家拒绝退货
    RETURN_PROCESS_REFUSED: 3130, //-商家拒绝退货
    RETURN_PROCESS_CANCEL: 3135, //-买家取消


    PLANTFORM_RETURN_STATE_WAITING: 3180, //申请状态平台(ENUM):3180-处理中,
    PLANTFORM_RETURN_STATE_AGREE: 3181, //为待管理员处理卖家同意或者收货后,
    PLANTFORM_RETURN_PROCESS_FINISH: 3182, //-为已完成


    STORE_STATE_WAIT_PROFILE: 3210, //待完善资料
    STORE_STATE_WAIT_VERIFY: 3220, //等待审核
    STORE_STATE_NO: 3230, //审核资料没有通过
    STORE_STATE_YES: 3240, //审核资料通过,待付款

    TRADE_TYPE_SHOPPING: 1201,//购物
    TRADE_TYPE_TRANSFER: 1202,//转账
    TRADE_TYPE_DEPOSIT: 1203,//充值
    TRADE_TYPE_WITHDRAW: 1204,//提现
    TRADE_TYPE_SALES: 1205,//销售
    TRADE_TYPE_COMMISSION: 1206,//佣金
    TRADE_TYPE_REFUND_PAY: 1207,//退货付款
    TRADE_TYPE_REFUND_GATHERING: 1208,//退货收款


    PAYMENT_TYPE_DELIVER: 1301,//货到付款
    PAYMENT_TYPE_ONLINE: 1302,//在线支付
    //PAYMENT_TYPE_CREDIT  : 1303,//白条支付
    //PAYMENT_TYPE_CASH    : 1304,//现金支付
    PAYMENT_TYPE_OFFLINE: 1305,//线下支付

    ORDER_ITEM_EVALUATION_NO: 0,    //未评价
    ORDER_ITEM_EVALUATION_YES: 1,    //已评价
    ORDER_ITEM_EVALUATION_TIMEOUT: 2,    //失效评价

    ORDER_EVALUATION_NO: 0,    //未评价
    ORDER_EVALUATION_YES: 1,    //已评价
    ORDER_EVALUATION_TIMEOUT: 2,    //失效评价

    ORDER_NOT_NEED_RETURN_GOODS: 0,    //不用退货
    ORDER_NEED_RETURN_GOODS: 1,    //需要退货

    ORDER_REFUND: 1,    //1-退款申请, 2-退货申请, 3-虚拟退款
    ORDER_RETURN: 2,    //需要退货
    ORDER_VIRTUAL_REFUND: 3,    //需要退货


    TASK_STATE_TENDER: 1000, //匹配中
    TASK_STATE_WORKING: 1001, //工作中
    TASK_STATE_ACCEPTING_WAITING: 1002, //待验收-不使用
    TASK_STATE_FINISH: 1003, //已完成
    TASK_STATE_CANCEL: 1007, //已取消


    SERVICE_ORDER_STATE_CLOSED: 1100, //关闭
    SERVICE_ORDER_STATE_PUBLICATION_WAITING: 1000, //待发布
    SERVICE_ORDER_STATE_PAY_WAITING: 1010, //待支付
    SERVICE_ORDER_STATE_REVIEW_WAITING: 1020, //待审核
    SERVICE_ORDER_STATE_REGISTERING: 1030, //报名中
    SERVICE_ORDER_STATE_WORKING: 1040, //工作中
    SERVICE_ORDER_STATE_ACCEPTING_WAITING: 1050, //待验收
    SERVICE_ORDER_STATE_EXPIRED: 1060, //逾期
    SERVICE_ORDER_STATE_COMPLAINT: 1070, //申诉中
    SERVICE_ORDER_STATE_EVALUATION_WAITING: 1080, //待评价
    SERVICE_ORDER_STATE_FINISH: 1090, //已完成
    SERVICE_ORDER_STATE_DISTRIBUTE: 1110, //派发中


    POINTS_TYPE_REG: 1,    //会员注册
    POINTS_TYPE_LOGIN: 2,    //会员登录
    POINTS_TYPE_EVALUATE_PRODUCT: 3,    //商品评论
    POINTS_TYPE_EVALUATE_STORE: 6,    //店铺评论
    POINTS_TYPE_CONSUME: 4,    //购买商品
    POINTS_TYPE_OTHER: 5,    //管理员操作
    POINTS_TYPE_EXCHANGE_PRODUCT: 7,    //积分换购商品
    POINTS_TYPE_EXCHANGE_VOUCHER: 8,    //积分兑换优惠券
    POINTS_TYPE_EXCHANGE_SP: 9,    //积分兑换
    POINTS_TYPE_TRANSFER_MINUS: 10,    //积分转出
    POINTS_TYPE_TRANSFER_ADD: 11,    //积分转入
    POINTS_TYPE_CONSUME_RETRUN: 12,    //积分退还
    POINTS_TYPE_UP_SP: 13,    //升级服务商
    POINTS_TYPE_UP_SELLER: 14,    //升级商家
    POINTS_TYPE_FX_FANS: 15,    //发展粉丝赠送积分
    POINTS_TYPE_DEDUCTION: 21,    //购买商品抵扣积分

    POINTS_TYPE_EXCHANGE_MONEY_ADD: 16,    //余额换积分
    POINTS_TYPE_EXCHANGE_MONEY_MINUS: 17,    //积分换余额


    pointsMap: {
        1: Lang.__("会员注册"),
        2: Lang.__("会员登录"),
        3: Lang.__("商品评论"),
        6: Lang.__("店铺评论"),
        4: Lang.__("购买商品"),
        5: Lang.__("管理员操作"),
        7: Lang.__("积分换购商品"),
        8: Lang.__("积分兑换优惠券"),
        9: Lang.__("积分兑换"),
        10: Lang.__("积分转出"),
        11: Lang.__("积分转入"),
        12: Lang.__("积分退还"),
        13: Lang.__("升级服务商"),
        14: Lang.__("升级商家"),
        15: Lang.__("发展粉丝赠送积分"),
        21: Lang.__("购买商品抵扣积分"),
        16: Lang.__("余额换积分"),
        17: Lang.__("积分换余额")
    },

    tradeTypeMap: {
        1201: Lang.__("购物"),
        1202: Lang.__("转账"),
        1203: Lang.__("充值"),
        1204: Lang.__("提现"),
        1205: Lang.__("销售"),
        1206: Lang.__("佣金"),
        1207: Lang.__("退货付款"),
        1208: Lang.__("退货收款"),
        1209: Lang.__("转账收款"),
        1210: Lang.__("佣金付款"),
        1211: Lang.__("分红"),
        1212: Lang.__("购买SP"),
        1213: Lang.__("销售SP"),
        1214: Lang.__("线下买单"),
        1215: Lang.__("线下买单"),
        1216: Lang.__("升级为商家"),
        1217: Lang.__("销售升级为商家"),
        1218: Lang.__("提现驳回"),
        1219: Lang.__("拼团失败退款"),
        1220: Lang.__("转单分佣"),
        1221: Lang.__("跑腿运费"),
        1222: Lang.__("购物返利"),
        1223: Lang.__("购买积分"),
        1224: Lang.__("销售积分"),
        1225: Lang.__("店铺续费"),
        1226: Lang.__("购买广告"),
        1227: Lang.__("充值卡消费"),
        1228: Lang.__("充值卡充值"),
        1501: Lang.__("线下记账收入"),
        1502: Lang.__("线下记账支出"),
        1503: Lang.__("购物"),
        1504: Lang.__("销售"),
        1505: Lang.__("购物"),
        1506: Lang.__("销售"),
    }
}
