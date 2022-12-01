window.onload = function() {
    const timer = document.getElementById("timer");   // 获取计时器元素
    const countDown = document.getElementById("countDown");   // 获取番茄时钟元素
    const windowTime = document.getElementById("windowTime");     // 获取页面中显示时间的元素
    const windowDate = document.getElementById("windowDate");     // 获取页面中显示日期的元素
    var toolTimer;  // 存储工具类中计时器的循环事件
    var toolCountDown;      // 存储工具类中番茄时钟的循环事件
    var alertColor;     // 存储屏幕闪烁的循环事件
    var timerFlag = false;  // 计时器的工作状态
    var countDownFlag = false;      // 番茄时钟的工作状态
    var alertFlag = false;  // 提示函数的状态
    var timerCount = 0;     // 计时器计数，以秒为单位
    var countDownCount;     // 番茄时钟计数
    var countH = 0, countM = 20, countS = 0;     // 番茄时钟时、分、秒设定值
    var refDate;    // 存储参考时间的变量

    window.addEventListener("selectstart", function(e) {e.preventDefault();})  // 整个页面禁止选中，提升使用体验
    windowTime.addEventListener("click", clearTimer)    // 单击日期重置计时器
    windowDate.addEventListener("click", clearCountDown)    // 单击日期重置番茄时钟
    timer.addEventListener("click", setTimer);          // 给计时器添加鼠标点击事件监听器
    countDown.addEventListener("click", startCountDown);     // 给番茄时钟添加鼠标点击事件监听器
    controlMouseWheel(true);    // 调用函数为番茄时钟的时、分、秒span添加事件监听器

    // 设定页面中显示时间的元素
    function setTime() {
        refDate = new Date();
        windowTime.innerText = fullTime(refDate.getHours()) + ":" + fullTime(refDate.getMinutes()) + ":" + fullTime(refDate.getSeconds());
        setDate();
    }

    // 设定页面中显示日期的元素
    function setDate() {
        refDate = new Date();
        windowDate.innerText = refDate.getFullYear() + "年" + (refDate.getMonth() + 1) + "月"+ refDate.getDate() + "日";
    }

    // 计时器的函数：开始和暂停
    function setTimer() {
        timerFlag = !timerFlag;     // 改变计时器状态
        var h = 0, m = 0, s = 0;
        if (timerFlag) {
            toolTimer = setInterval(() => {
                timerCount += 1;    // 以秒为单位
                h = fullTime(Math.floor(timerCount / 3600));
                if (h == 100) {     // 超过计时范围，计时器归零
                    timerCount = 0;
                    alert("超出计时器的范围了！！！");
                }
                m = fullTime(Math.floor((timerCount - (h * 3600)) / 60));
                s = fullTime(Math.floor(timerCount - (h * 3600) - (m * 60)));
                timer.innerHTML = h + ":" + m + ":" + s;
            }, 1000);
        } else {
            clearInterval(toolTimer);
        }
    }

    // 计时器的函数：清空
    function clearTimer() {
        timerFlag = false;
        clearInterval(toolTimer);
        timerCount = 0;     // 清空计时器计数
        timer.innerHTML = "00:00:00";
    }

    // 设定番茄时钟的“时”
    function setCountH() {
        countH = parseInt(setCountDown(countH));    // 将其转换为数字
        document.getElementById("countH").innerText = fullTime(countH);     // 格式化之后替换到界面中
    }

    // 设定番茄时钟的“分”
    function setCountM() {
        countM = parseInt(setCountDown(countM));    // 将其转换为数字
        document.getElementById("countM").innerText = fullTime(countM);     // 格式化之后替换到界面中
    }

    // 设定番茄时钟的“秒”
    function setCountS() {
        countS = parseInt(setCountDown(countS));    // 将其转换为数字
        document.getElementById("countS").innerText = fullTime(countS);     // 格式化之后替换到界面中
    }

    // 设定番茄时钟的三个参数（时、分、秒）
    function setCountDown(data) {
        var e = e || window.event;
        if (e.detail > 0 || e.wheelDelta < 0) {     // 鼠标滚轮向下滚动，减少
            --data;
            if (data < 0) {     // 低于0时
                data = 59;
            }
        }
        if (e.detail < 0 || e.wheelDelta > 0) {     // 鼠标滚轮向上滚动，增加
            ++data;
            if (data > 59) {     // 超过59时
                data = 0;
            }
        }
        return data;
    }

    // 番茄时钟的函数：开始与暂停
    function startCountDown() {
        countDownFlag = !countDownFlag;     // 改变番茄时钟的状态
        countDownCount = countH * 3600 + countM * 60 + countS;     // 以秒为单位，计算总的秒数
        if (countDownCount == 0) {  // 当设定的时、分、秒都等于0时，退出函数
            return 0;
        }
        controlMouseWheel(false);   // 当番茄时钟启动后，移除番茄时钟时、分、秒span的事件监听器，禁止在此期间修改番茄时钟的时、分、秒
        if (countDownFlag) {
            toolCountDown = setInterval(() => {
                countDownCount -= 1;
                if (countDownCount == 0) {
                    alertFlag = true;
                    clearCountDown();
                }
                countH = fullTime(Math.floor(countDownCount / 3600));
                countM = fullTime(Math.floor((countDownCount - (countH * 3600)) / 60));
                countS = fullTime(Math.floor(countDownCount - (countH * 3600) - (countM * 60)));
                document.getElementById("countH").innerText = countH;
                document.getElementById("countM").innerText = countM;
                document.getElementById("countS").innerText = countS;
            }, 1000);
        } else {
            clearInterval(toolCountDown);
        }
    }

    // 番茄时钟的函数：清空
    function clearCountDown() {
        countDownFlag = false;  // 修改番茄时钟的工作状态
        clearInterval(toolCountDown);
        alertCountDown();   // 调用计时结束后闪烁屏幕的函数
        controlMouseWheel(true);   // 调用函数为番茄时钟的时、分、秒span添加事件监听器
        // 恢复默认值
        countH = 0, countM = 20, countS = 0;
        document.getElementById("countH").innerText = "00";     // 页面中的“时”
        document.getElementById("countM").innerText = "20";     // 页面中的“分”
        document.getElementById("countS").innerText = "00";     // 页面中的“秒”
    }

    // 当番茄时钟计时结束，闪烁屏幕以提示
    function alertCountDown() {
        var count = 0;
        if (alertFlag) {
            alertColor = setInterval(() => {
                count += 1;
                if (count % 2 == 0) {
                    document.body.style.background = "black";   // 设置背景颜色
                    document.body.style.setProperty("--font-color", "red");     // windowDate的hover字体颜色
                    document.body.style.setProperty("--window-color", "black");   // 其他元素的字体颜色
                    windowDate.style.color = "red";     // windowDate的字体颜色
                    countDown.style.color = "red";  // countDown的字体颜色
                } else {
                    document.body.style.background = "red";   // 设置背景颜色
                    document.body.style.setProperty("--font-color", "black");     // windowDate的hover字体颜色
                    document.body.style.setProperty("--window-color", "red");   // 其他元素的字体颜色
                    windowDate.style.color = "black";     // windowDate的字体颜色
                    countDown.style.color = "black";    // countDown的字体颜色
                }
            }, 500);
        } else {
            clearInterval(alertColor);  // 点击windowDate时，停止闪烁
            document.body.style.background = "black";   // 设置背景颜色
            document.body.style.setProperty("--font-color", "red");     // windowDate的hover字体颜色
            document.body.style.setProperty("--window-color", "white");   // 其他元素的字体颜色
            windowDate.style.color = "white";     // windowDate的字体颜色
            countDown.style.color = "white";    // countDown的字体颜色
        }
        alertFlag = false;      // 恢复提示函数的状态
    }

    // 补全（格式化）时、分、秒
    function fullTime(data) {
        if (data / 10 < 1) {    // 为一位数时
            return "0" + data;
        } else {    // 为两位数时
            return data;
        }
    }

    // 补全（格式化）毫秒：三位数
    function fullMs(data) {
        if (data == 0) {    // 毫秒为0时
            return data + "00";
        } else if (data / 100 < 1) {    // 毫秒为两位数时
            return data + "0";
        } else {    // 毫秒为三位数时
            return data;
        }
    }

    function controlMouseWheel(flag) {
        if (flag) {
            // 给番茄时钟添加鼠标滚轮事件监听器，火狐比较特殊
            document.getElementById("countH").addEventListener("mousewheel", setCountH);         // 非火狐
            document.getElementById("countH").addEventListener("DOMMouseScroll", setCountH);     // 火狐
            document.getElementById("countM").addEventListener("mousewheel", setCountM);         // 非火狐
            document.getElementById("countM").addEventListener("DOMMouseScroll", setCountM);     // 火狐
            document.getElementById("countS").addEventListener("mousewheel", setCountS);         // 非火狐
            document.getElementById("countS").addEventListener("DOMMouseScroll", setCountS);     // 火狐
        } else {
            // 给番茄时钟添加鼠标滚轮事件监听器，火狐比较特殊
            document.getElementById("countH").removeEventListener("mousewheel", setCountH);         // 非火狐
            document.getElementById("countH").removeEventListener("DOMMouseScroll", setCountH);     // 火狐
            document.getElementById("countM").removeEventListener("mousewheel", setCountM);         // 非火狐
            document.getElementById("countM").removeEventListener("DOMMouseScroll", setCountM);     // 火狐
            document.getElementById("countS").removeEventListener("mousewheel", setCountS);         // 非火狐
            document.getElementById("countS").removeEventListener("DOMMouseScroll", setCountS);     // 火狐
        }
    }

    // 刚进入界面时刷新日期
    setDate();

    setInterval(setTime, 100);  // 设定自动刷新时间
}