'use strict';


export default {
    SkusObj(arr) {
        var skus = arr;
        var leng = skus.length;
        var newObj = {};
        for (var i = 0; i < leng; i++) {
            var item = skus[i];
            var key = item.PropIds.join(";");
            newObj[key] = {};
            newObj[key].SkuId = item.SkuId;
            newObj[key].Price = item.Price;
            newObj[key].ListPrice = item.ListPrice;
            newObj[key].Quantity = item.Quantity;
            newObj[key].Selected = item.Selected;

        }
        console.log(newObj);
        return newObj
    },
    //获得对象的key
    getObjKeys(obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj)
            if (Object.prototype.hasOwnProperty.call(obj, key))
                keys[keys.length] = key;
        return keys;
    },
    /**
     * 从数组中生成指定长度的组合
     * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
     */
    combInArray(aData) {
        let vm = this
        if (!aData || !aData.length) {
            return [];
        }

        var len = aData.length;
        var aResult = [];

        for (var n = 1; n < len; n++) {
            var aaFlags = vm.getCombFlags(len, n);
            while (aaFlags.length) {
                var aFlag = aaFlags.shift();
                var aComb = [];
                for (var i = 0; i < len; i++) {
                    aFlag[i] && aComb.push(aData[i]);
                }
                aResult.push(aComb);
            }
        }

        return aResult;
    },
    /**
     * 得到从 m 元素中取 n 元素的所有组合
     * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
     */
    getCombFlags(m, n) {
        if (!n || n < 1) {
            return [];
        }

        var aResult = [];
        var aFlag = [];
        var bNext = true;
        var i, j, iCnt1;

        for (i = 0; i < m; i++) {
            aFlag[i] = i < n ? 1 : 0;
        }

        aResult.push(aFlag.concat());

        while (bNext) {
            iCnt1 = 0;
            for (i = 0; i < m - 1; i++) {
                if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
                    for (j = 0; j < i; j++) {
                        aFlag[j] = j < iCnt1 ? 1 : 0;
                    }
                    aFlag[i] = 0;
                    aFlag[i + 1] = 1;
                    var aTmp = aFlag.concat();
                    aResult.push(aTmp);
                    if (aTmp.slice(-n).join("").indexOf('0') == -1) {
                        bNext = false;
                    }
                    break;
                }
                aFlag[i] == 1 && iCnt1++;
            }
        }
        return aResult;
    },
    //把组合的key放入结果集SKUResult
    add2SKUResult(newSKUResult, combArrItem, sku) {
        let _SKUResult = JSON.parse(JSON.stringify(newSKUResult))
        var key = combArrItem.join(";");
        if (_SKUResult[key]) { //SKU信息key属性·
            _SKUResult[key].count += sku.Quantity;
            _SKUResult[key].prices.push(sku.Price);
        } else {
            _SKUResult[key] = {
                count: sku.Quantity,
                prices: [sku.Price]
            };
        }

        newSKUResult = _SKUResult

        return _SKUResult
    },
    //初始化得到结果集
    initSKU(result, data) {
        let vm = this
        let i, j, skuKeys = vm.getObjKeys(data);
        let newSKUResult = result
        for (i = 0; i < skuKeys.length; i++) {
            var skuKey = skuKeys[i]; //一条SKU信息key
            var sku = data[skuKey]; //一条SKU信息value
            var skuKeyAttrs = skuKey.split(";"); //SKU信息key属性值数组
            skuKeyAttrs.sort(function (value1, value2) {
                return parseInt(value1) - parseInt(value2);
            });

            //对每个SKU信息key属性值进行拆分组合
            var combArr = vm.combInArray(skuKeyAttrs);
            for (j = 0; j < combArr.length; j++) {
                newSKUResult = vm.add2SKUResult(newSKUResult, combArr[j], sku);
            }

            //结果集接放入SKUResult
            newSKUResult[skuKeyAttrs.join(";")] = {
                count: sku.Quantity,
                prices: [sku.Price]
            }
        }

        console.log('newSKUResult')
        console.log(newSKUResult)
        return newSKUResult
    },
    event(event, key) {
        return event.currentTarget.dataset[key]
    }
}