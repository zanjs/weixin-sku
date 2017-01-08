'use strict';


export default {
    /**
     * 抓取商品所有信息组合处理
     * 
     * @param {any} data
     * @returns
     */
    processBody(data) {
        let vm = this
        let SkuClasses = data.SkuClasses
        let Skus = data.Skus

        // Skus = Skus ? Skus : []
        Skus = Skus ? vm.processSku(Skus, SkuClasses) : []
        SkuClasses = SkuClasses ? vm.processSkuClasses(SkuClasses) : []

        let body = {
            Skus: Skus,
            SkuClasses: SkuClasses,
            product: data
        }

        return body
    },
    /**
     * sku 保存
     * 
     * @param {any} skus
     * @param {any} SkuClasses
     * @returns
     */
    processSku(skus, SkuClasses) {
        let vm = this
        let list = skus
        let leng = list.length
        console.log('processSku')
        console.log(SkuClasses)

        for (var i = 0; i < leng; i++) {
            let item = list[i]
            let PropIds = item.PropIds
            let pleng = PropIds.length

            item.skutxt = vm.processSkuPropIds(PropIds, SkuClasses)

        }

        return list
    },
    processSkuPropIds(PropIds, SkuClasses) {
        let vm = this

        let leng = PropIds.length

        PropIds.sort(function (value1, value2) {
            return parseInt(value1) - parseInt(value2);
        })

        let str = ''

        for (var i = 0; i < leng; i++) {
            let itemPropId = PropIds[i]
            let arr = itemPropId.split(':')
            let pid = arr[0]
            let id = arr[1]
            let item = SkuClasses[pid]
            let typeName = item.TypeName
            let PropertieName = item.SkuProperties[id].PropertieName

            str += `${typeName}:${PropertieName}`

            i < (leng - 1) ? str += ',' : ''

        }

        return str

    },
    /**
     * 处理 sku循环组合状态
     * 
     * @param {any} SkuClasses
     * @returns
     */
    processSkuClasses(SkuClasses) {
        let vm = this
        let list = SkuClasses
        let leng = list.length

        for (var i = 0; i < leng; i++) {
            let item = list[i]
            item.SkuProperties = vm.processSkuTags(item.SkuProperties)
        }

        return list
    },
    processSkuTags(tags) {
        let list = tags
        let leng = list.length

        for (var i = 0; i < leng; i++) {
            let item = list[i]
            item.status = 1
        }
        return list
    },
    isClick(SkuClasses) {
        let vm = this
        let list = SkuClasses
        let leng = list.length

        for (var i = 0; i < length; i++) {
            let item = list[i]
            item = vm.isClickTags(item)
        }

        return list
    },
    isClickTags(tags) {

        let list = tags
        let leng = list.length

        for (var i = 0; i < leng; i++) {
            let item = list[i]
            item.isClick = true
        }

        return list
    },

    /**
     * 更新 SKU 选择状态
     * status = 2 选中: 1 可选 ：0 不可选
     * 
     * @param {any} SkuClasses
     * @param {any} x
     * @param {any} y
     * @returns
     */
    updateSkuClasses(SkuClasses, x, y) {
        let vm = this
        let arr = SkuClasses
        let tags = arr[x].SkuProperties
        let len = tags.length
        let tag = tags[y]

        for (var i = 0; i < len; i++) {

            let item = tags[i]

            if (i == y && item.status == 1) {
                    item.status = 2
            }else{
                item.status = 1
            }

        }

        return arr
    },
    /**
     * 获取 SkuiID
     * 
     * @param {any} skus
     * @param {any} selectedIds
     * @returns
     */
    getSkuId(skus, selectedIds) {
        let vm = this
        let list = skus
        let leng = list.length
        let ids = selectedIds.join(';')
        let obj = {}
        for (var i = 0; i < leng; i++) {
            let item = list[i]
            let PropIds = item.PropIds

            PropIds.sort(function (value1, value2) {
                return parseInt(value1) - parseInt(value2);
            })

            let key = PropIds.join(';')
            if (ids == key) {
                console.log('getSkuId')
                console.log(item)


                return item
            }

        }

        return false

    },
    /**
     * 获取选中节点
     * 
     * @param {any} SkuClasses
     * @returns
     */
    getSelect(SkuClasses) {
        let vm = this
        let arr = SkuClasses
        let newArr = []
        let leng = arr.length

        for (var i = 0; i < leng; i++) {
            let item = arr[i].SkuProperties
            let newItem = vm.getSelectTag(item)
            if (newItem.length) {
                newArr.push(newItem)
            }

        }

        newArr.sort(function (value1, value2) {
            return parseInt(value1) - parseInt(value2);
        })

        return newArr

    },
    getSelectTag(tags) {
        let arr = tags
        let leng = arr.length
        let id = ''
        for (var i = 0; i < leng; i++) {
            let item = arr[i]

            if (item.status == 2) {

                id = item.PropId
            }

        }
        return id
    },
    /**
     * 获取未选中的节点
     * 
     * @param {any} SkuClasses
     * @returns
     */
    getSelectNo(SkuClasses) {
        let vm = this
        let arr = SkuClasses
        let newArr = []
        let leng = arr.length

        for (var i = 0; i < leng; i++) {
            let item = arr[i].SkuProperties
            let newItem = vm.getSelectTagsNo(item)
            if (newItem.length) {
                newArr = newArr.concat(newItem)
            }

        }

        newArr.sort(function (value1, value2) {
            return parseInt(value1) - parseInt(value2);
        })

        return newArr

    },
    getSelectTagsNo(tags) {
        let arr = tags
        let leng = arr.length
        let id = []
        for (var i = 0; i < leng; i++) {
            let item = arr[i]

            if (item.status != 2) {

                id.push(item.PropId)
            }

        }
        return id
    },
    /**
     * 计算SKU 所有 的可能性组合
     * 
     * @param {any} skus
     * @returns
     */
    SKUResult(skus) {
        let vm = this
        let indata = vm.SkusObj(skus)
        let SKUResult = {}
        return vm.initSKU(SKUResult, indata)
    },
    /**
     * 重新初始化skuis 状态数据
     * 
     * @param {any} arr
     * @returns
     */
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
    /**
     * 把组合的key放入结果集SKUResult
     * 
     * @param {any} newSKUResult
     * @param {any} combArrItem
     * @param {any} sku
     * @returns
     */
    add2SKUResult(newSKUResult, combArrItem, sku) {
        let _SKUResult = JSON.parse(JSON.stringify(newSKUResult))
        var key = combArrItem.join(";");
        if (_SKUResult[key]) { //SKU信息key属性·
            _SKUResult[key].count += sku.Quantity;
            _SKUResult[key].prices.push(sku.Price);
            _SKUResult[key].SkuId = sku.SkuId;
        } else {
            _SKUResult[key] = {
                count: sku.Quantity,
                prices: [sku.Price],
                SkuId: sku.SkuId
            };
        }

        newSKUResult = _SKUResult

        return _SKUResult
    },
    /**
     * 初始化得到结果集
     * 
     * @param {any} result
     * @param {any} data
     * @returns
     */
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
    /**
     * 获得对象的key
     * 
     * @param {any} obj
     * @returns
     */
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
     * 
     * @param {any} aData
     * @returns
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
     * 
     * @param {any} m
     * @param {any} n
     * @returns
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
    /**
     * SKU 价格 和 数量
     * 
     * @param {any} selectedIds
     * @param {any} SKUResult
     * @returns
     */
    updateSkuPriceCount(selectedIds, SKUResult) {
        let vm = this
        let len = selectedIds.length
        if (!len) {
            return false
        }
        let joval = selectedIds.join(';')
        let prices = SKUResult[joval] ? SKUResult[joval].prices : [0.00]
        let count = SKUResult[joval].count
        let maxPrice = Math.max.apply(Math, prices)
        let minPrice = Math.min.apply(Math, prices)
        prices = maxPrice > minPrice ? false : maxPrice
        return {
            price: prices,
            count: count
        }
    },
    /**
     * 所有同胞元素
     * 
     * @param {any} tags
     * @param {any} index
     * @returns
     */
    siblings(tags, index) {
        let list = tags
        let leng = list.lengt
        let newList = []

        for (var i = 0; i < leng; i++) {
            let item = list[i]
            if (i != index) {
                newList.push(item)
            }
        }
        return list
    },
    /**
     * 产品组合信息
     * 
     * @param {any} skus
     * @param {any} data
     * @param {any} input 用户输入的信息
     * @returns
     */
    GrabAttr(skus, data) {
        let product = data.product
        let catelog = data.catelog
        let obj = {
            Cover: product.Picture,
            CountryId: catelog.CountryId,
            ExpressFee: 0,
            Height: 0,
            Length: 0,
            Name: product.Title,
            Note: data.Note,
            OriginalCurrencyCode: catelog.CurrencyCode,
            OriginalCurrencySign: catelog.CurrencySign,
            OriginalPrice: product.Price,
            Pictures: product.Picture,
            Quantity: data.Quantity,
            Sku: skus.skutxt,
            SkuId: skus.SkuId,
            StoreLogo: product.Shop.Logo,
            StoreName: product.Shop.Name,
            StoreUrl: product.Shop.Url,
            UnitPrice: product.Price,
            Url: product.Url,
            WebSiteId: catelog.WebSiteId,
            CId: "",
            OriginalUrl: "",
            RebateUrl: "",
            Weight: product.Weight,
            Width: product.Width,
            IsBuy: data.IsBuy,
            Coupon: data.Coupon
        }

        return obj
    },
    /**
     * 点击后计算出新的 SKU 
     * 
     * @param {any} selectedIds
     * @param {any} SkuClasses
     * @param {any} SKUResult
     * @returns
     */
    clickJs(selectedIds, SkuClasses, SKUResult) {
        let vm = this
        let list = SkuClasses
        let leng = list.length

        for (var i = 0; i < leng; i++) {
            let item = list[i]

            let tags = item.SkuProperties
            let tagsLeng = tags.length

            for (var y = 0; y < tagsLeng; y++) {
                let yitem = tags[y]

                if (!yitem.ison) {

                    let idsLen = selectedIds.length;
                    let siblingsSelectedObj = vm.siblings(yitem, y)
                    let testAttrIds = []; //从选中节点中去掉选中的兄弟节点
                    if (siblingsSelectedObj.length) {

                        let siblingsSelectedObjId = siblingsSelectedObj.PropId;
                        for (var z = 0; z < idsLen; z++) {

                            if (selectedIds[z] != siblingsSelectedObjId) {
                                testAttrIds.push(selectedIds[z]);
                            }
                            // (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i]);
                        }
                    } else {
                        testAttrIds = selectedIds.concat();
                    }

                    let attId = yitem.PropId;

                    testAttrIds = testAttrIds.concat(attId);

                    testAttrIds.sort(function (value1, value2) {
                        return parseInt(value1) - parseInt(value2);
                    });

                    let testJoin = testAttrIds.join(';')
                    if (!SKUResult[testJoin]) {
                        yitem.status = 0
                    } else {
                        yitem.status = 1
                    }
                }
            }

        }
        return list
    },
    /**
     * 点击后计算出新的 SKU 
     * 
     * @param {any} selectedIds
     * @param {any} SkuClasses
     * @param {any} SKUResult
     * @returns
     */
    clickJs2(clickPoid, SkuClasses, SKUResult) {
        let vm = this
        let list = SkuClasses
        let leng = list.length

        let noSelectIds = vm.getSelectNo(SkuClasses)
        let selectedIds = vm.getSelect(SkuClasses)
        let selectedIdsLeng = selectedIds.length

        

        for (var i = 0; i < noSelectIds.length; i++) {

            let item = noSelectIds[i]

            let itemSplit = item.split(':')

            let Pindex = itemSplit[0]
            let index = itemSplit[1]

            let SkuClassesItem = SkuClasses[Pindex].SkuProperties[index]

            let getSelPoid = SkuClassesItem.PropId


            let siblingsSelectedObj = vm.isxSelect(list[Pindex].SkuProperties)

            let combinationAttrIds = []

            if (siblingsSelectedObj) {

                let siblingsSelectedObjId = siblingsSelectedObj.PropId

                for (var y = 0; y < selectedIdsLeng; y++) {

                    if (selectedIds[i] != siblingsSelectedObjId) {
                        combinationAttrIds.push(selectedIds[y])
                    }

                }


            } else {
                combinationAttrIds = selectedIds.concat()
            }

            combinationAttrIds = combinationAttrIds.concat(getSelPoid)

            combinationAttrIds.sort(function (value1, value2) {
                return parseInt(value1) - parseInt(value2)
            })

            console.log(combinationAttrIds)

            if (!SKUResult[combinationAttrIds.join(';')]) {
                SkuClassesItem.status = 0
            } else {
                SkuClassesItem.status = 1
            }


        }


        console.log(SkuClasses)


        return list
    },
    /**
     * 获取当前sku 选中
     * 
     * @param {any} skuarr
     * @returns
     */
    isxSelect(skuarr) {
        let leng = skuarr.length

        let obj = false
        for (var i = 0; i < leng; i++) {
            let item = skuarr[i]
            console.log(leng)
            if (item.status == 2) {
                obj = item
            }

        }

        return obj
    },
    // /**
    //  * 是否是同级
    //  */
    // getPindex(arr) {
    //     let Pindex = false
    //     let leng = arr.length

    //     for (var i = 0; i < leng; i++) {
    //         var item = arr[i]
    //         Pindex = item.split(':')[0]
    //     }
    //     return Pindex
    // },
    getClickSelectPoId(SkuClasses, pindex, index) {
        let item = SkuClasses[pindex]
        return item.SkuProperties[index]
    },
    /**
     * 获取用户操作输入的信息
     * 
     * @param {any} data
     * @returns
     */
    UserEnter(data) {
        return {
            Note: data.Note,
            Quantity: data.Quantity,
            Coupon: data.Coupon,
            IsBuy: data.IsBuy
        }
    }
}