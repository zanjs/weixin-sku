import api from '../../util/api.js';
import mod from './mod';

Page({
  data: {
    Price:0,
    Skus: [{
      "SkuId": "B00TSUGXKE",
      "Title": "Fire",
      "Price": 39.99,
      "ListPrice": 49.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:0", "2:0", "1:0"],
      "Selected": true
    }, {
      "SkuId": "B00ZDWGF7W",
      "Title": "Fire",
      "Price": 54.99,
      "ListPrice": 64.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:0", "2:1", "1:0"],

      "Selected": false
    }, {
      "SkuId": "B018Y227MY",
      "Title": "Fire",
      "Price": 39.99,
      "ListPrice": 49.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:0", "2:0", "1:1"],

      "Selected": false
    }, {
      "SkuId": "B018Y229OU",
      "Title": "Fire",
      "Price": 39.99,
      "ListPrice": 49.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:0", "2:0", "1:2"],

      "Selected": false
    }, {
      "SkuId": "B018Y23P7K",
      "Title": "Fire",
      "Price": 39.99,
      "ListPrice": 49.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:0", "2:0", "1:3"],

      "Selected": false
    }, {
      "SkuId": "B018Y22BI4",
      "Title": "Fire",
      "Price": 49.99,
      "ListPrice": 69.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:1", "2:0", "1:0"],

      "Selected": false
    }, {
      "SkuId": "B018Y229K4",
      "Title": "Fire",
      "Price": 64.99,
      "ListPrice": 84.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:1", "2:1", "1:0"],

      "Selected": false
    }, {
      "SkuId": "B018Y225IA",
      "Title": "Fire",
      "Price": 49.99,
      "ListPrice": 69.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:1", "2:0", "1:1"],

      "Selected": false
    }, {
      "SkuId": "B018Y224PY",
      "Title": "Fire",
      "Price": 49.99,
      "ListPrice": 69.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:1", "2:0", "1:2"],
      "Selected": false

    }, {
      "SkuId": "B018Y227A6",
      "Title": "Fire",
      "Price": 49.99,
      "ListPrice": 69.99,
      "Freight": 0.0,
      "Quantity": 30,
      "PropIds": ["0:1", "2:0", "1:3"],
      "Selected": false
    }],
    SkuClasses: [{
      "TypeName": "DigitalStorageCapacity",
      "SkuProperties": [{
        "PropId": "0:0",
        "PropertieName": "8 GB",
      }, {
        "PropId": "0:1",
        "PropertieName": "16 GB",
      }]
    }, {
      "TypeName": "Color",
      "SkuProperties": [{
        "PropId": "1:0",
        "PropertieName": "Black",
      }, {
        "PropId": "1:1",
        "PropertieName": "Blue",

      }, {
        "PropId": "1:2",
        "PropertieName": "Magenta",
      }, {
        "PropId": "1:3",
        "PropertieName": "Tangerine",
      }]
    }, {
      "TypeName": "Configuration",
      "SkuProperties": [{
        "PropId": "2:0",
        "PropertieName": "With Special Offers"
      }, {
        "PropId": "2:1",
        "PropertieName": "Without Special Offers"
      }]
    }],
    // 保存最后的组合结果信息
    SKUResult: {}
  },
  init() {
    let vm = this
    let data= vm.data
    let Skus = vm.data.Skus
    let SKUResult = mod.SKUResult(Skus)
    let SkuClasses = mod.processSkuClasses(data.SkuClasses)
    vm.setData({
      SKUResult: SKUResult,
      SkuClasses:SkuClasses
    })
  },
  /**
   * SKU 点击事件
   * 
   * @param {any} event
   */
  skuClick(event) {
    let vm = this
    let price = vm.data.Price
    let pindex = api.event(event, 'pindex')
    let index = api.event(event, 'index')


    let SkuClasses = vm.data.SkuClasses


    

    let newSkuClasses = mod.updateSkuClasses(SkuClasses, pindex, index)
    let selectedIds = mod.getSelect(newSkuClasses)

    // let priceCount = mod.updateSkuPriceCount(selectedIds, vm.data.SKUResult)

    
    let SKUResult = vm.data.SKUResult
    newSkuClasses = mod.clickJs(selectedIds, newSkuClasses, SKUResult)
    vm.setData({
      SkuClasses: newSkuClasses
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.init()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})