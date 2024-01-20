import {BigNumber as BNumber} from "bignumber.js";

export function setTime(func) {
    setInterval(() => {
        func()
    }, 5000)
}

// 时间格式化
export function nsToText(ns) {
    let date = new Date(ns)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    let minute = date.getMinutes()
    let second = date.getSeconds()
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

// 隐藏手机号
export function geTel(tel) {
    return tel.substring(0, 3) + "****" + tel.substr(tel.length - 4)
}

// 隐藏邮箱
export function regEmail(email) {
    if (String(email).indexOf('@') > 0) {
        var str = email.split('@'),
            _s = ''
        if (str[0].length > 3) {
            for (var i = 0; i < str[0].length - 3; i++) {
                _s += '*'
            }
        }
        var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
    }
    return new_email
}

export function gasMargin(gasEstimated, radio) {
    return new BNumber(gasEstimated).multipliedBy(radio);
}

// Param 说明
// num : 需要转化的数字
// dec : 保留小数位数
export function number_e2c(num, dec) {
    var str = new String(num)
    var e_pos = str.indexOf('e+')
    var p_pos = str.indexOf('.')
    // For Firefox 科学计数法
    if (e_pos > 0) {
        var bit = 0
        if (p_pos > 0)
            bit = e_pos - p_pos - 1
        var tim = str.substr(e_pos + 2)
        str = str.substr(0, e_pos).replace('.', '')
        var mov = tim - bit
        while (mov > 0) {
            str += '0'
            mov--
        }
        if (dec > 0) str += '.'
        while (dec > 0) {
            str += '0'
            dec--
        }
        return str
    }
    return num + ""
}

export function plusXing(str, frontLen, endLen, xingLen) {
    var xing = ''
    for (var i = 0; i < xingLen; i++) {
        xing += '*'
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
}

export function plusDian(str, frontLen, endLen, dianLen) {
    if (str != null && str.length > 0) {
        var dian = ''
        for (var i = 0; i < dianLen; i++) {
            dian += '.'
        }
        return str.substring(0, frontLen) + dian + str.substring(str.length - endLen)
    } else {
        return ""
    }
}

// 数字转换为货币，每三位加逗号
export function num2Currency(num) {
    let suffix = ''
    let numStr = ''
    let splitStr = []

    //是否是有效的数字类型
    function isNumber(num) {
        return typeof num == 'number' && !isNaN(num)
    }

    // 判断是否是任意大的整数
    function isBigInt(num) {
        return typeof num == 'bigint'
    }

    // 判断是否为有效的数字字符串
    function isNumberString(str) {
        return typeof str == 'string' && !isNaN(Number(str))
    }

    if (isNumber(num) || isNumberString(num) || isBigInt(num)) {
        // 判断是否为负数,大数超过MAX_SAFE_INTEGER,
        if (Number(num) < 0) return 0
        if (isBigInt(num)) return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        numStr = String(num)
        // 判断小数
        if (String(num).indexOf('.') > 0) {
            numStr = Number(num).toFixed(2)
            splitStr = numStr.split('.')
            numStr = splitStr[0]
            suffix = `.${splitStr[1]}`
        }
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix
    }
    return '-'
}
