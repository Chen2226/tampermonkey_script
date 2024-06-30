// ==UserScript==
// @name         抖店自动操作
// @namespace    http://tampermonkey.net/
// @version      2024-06-29
// @description  try to take over the world!
// @author       Chen
// @match        *://fxg.jinritemai.com/*
// @icon         https://server.cutil.top/upload/20240110/436a0e934fb36bb06542d11cfe9cb1be.png
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isPaused = true;

    // 引入layui
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.13/layui.js";
    document.documentElement.appendChild(script);
    document.documentElement.appendChild(script);
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.13/css/layui.css";
    document.documentElement.appendChild(link);

    console.log('ojbk');

    // 添加批量删除商品按钮
    function addDelCommodityButton() {
        let button = document.createElement("button");
        button.id = "del-commodity";
        button.innerHTML = "开始自动删除商品";
        button.className = "layui-btn layui-bg-blue";
        button.style.position = "fixed";
        button.style.top = "80px";
        button.style.right = "20px";
        button.style.zIndex = 9999;
        button.onclick = delCommodityTogglePause;
        document.body.appendChild(button);
    }

    // 切换删除商品暂停状态
    function delCommodityTogglePause() {
        const button = document.getElementById("del-commodity");
        if (!isPaused) {
            isPaused = true;
            if (button) {
                button.innerHTML = "开启自动删除商品";
            }
            layer.msg("停止脚本！");
            return;
        }
        layer.prompt({title: '请输入要删除的商品ID', formType: 2}, function (value, index, elem) {
            if (value === '') {
                layer.msg('没有输入id');
                return elem.focus();
            }
            // 分割
            const ids = value.split(/[\n,，\s]+/);
            console.log(ids);
            // 去空
            const idsFiltered = ids.filter(id => id !== '');
            console.log(idsFiltered);
            // 提示用户本次删除商品的数量，然后给个确认按钮，确认后开始删除
            layer.confirm(`本次将删除${idsFiltered.length}个商品，是否继续？`, {
                btn: ['确定', '取消']
            }, function () {
                isPaused = false;
                if (button) {
                    button.innerHTML = "停止自动删除商品";
                }
                layer.msg("开启脚本！");
                processCurrentPage('del-commodity', idsFiltered)
                layer.close(index);
            }, function () {
                layer.msg('取消');
                layer.close(index);
            });
        });
    }


    // 开始执行删除商品
    async function DelCommodity(ids) {
        if (isPaused) return;

        //循环删除商品，每次二十个
        let idsGroup = [];
        for (let i = 0; i < ids.length; i += 20) {
            idsGroup.push(ids.slice(i, i + 20));
        }
        idsGroup.length = 1;

        // 开始循环
        for (let i = 0; i < idsGroup.length; i++) {
            // 不使用定时器，直接循环，因为删除商品的请求是异步的，不会阻塞
            let ids = idsGroup[i];
            layer.msg(`开始删除第 ${i + 1} 组商品`);
            let inputs = document.querySelectorAll('input.ecom-g-input-borderless[placeholder="请输入商品名称/商品ID/商家编码，多条可用逗号隔开"]');
            if (inputs.length === 0) {
                layer.msg('没有找到输入框');
                return;
            }
            console.log(inputs)

            inputs[0].click();
            // 触发鼠标移动到按钮上的事件
            Util.triggerMouseEvent(inputs[0], 'mouseover');
            Util.triggerMouseEvent(inputs[0], 'mousemove');

            // 触发按钮点击事件
            Util.triggerMouseEvent(inputs[0], 'mousedown');
            Util.triggerMouseEvent(inputs[0], 'mouseup');
            Util.triggerMouseEvent(inputs[0], 'click');

            // 强制停止100ms
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('输入')
            // 触发 123 键的事件
            // Util.triggerKeyboardEvent(inputs[0], '1', 49);
            // Util.triggerKeyboardEvent(inputs[0], '2', 50);
            // Util.triggerKeyboardEvent(inputs[0], '3', 51);

            let text = ids.join(',');
            // 将text复制到剪贴板
            const input = document.createElement('input');
            input.style.position = 'fixed';
            input.style.opacity = 0;
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            // 触发粘贴事件ctrl+v
            // Util.triggerKeyboardEvent(inputs[0], 'V', 86, true);




            // document.querySelectorAll('input.ecom-g-input-borderless[placeholder="请输入商品名称/商品ID/商家编码，多条可用逗号隔开"]')[0].value = ids.join(',');
            // inputs[0].value = ids.join(',');
            console.log(ids.join(','))

            return;
            let buttons = document.querySelectorAll('button.ecom-g-btn-dashed');
            if (buttons.length === 0) {
                layer.msg('没有找到查询按钮');
                return;
            }
            for (let j = 0; j < buttons.length; j++) {
                let span = buttons[j].querySelector('span');
                if (span && span.textContent === '查询') {
                    buttons[j].click();
                    break;
                }
            }

            var lodingId = setInterval(function () {
                if (!document.querySelector('span.ecom-g-spin-dot-spin')) {
                    clearInterval(lodingId);
                    // 触发全选
                    var thElements = document.querySelectorAll('th.ecom-g-table-cell');
                    thElements.forEach(function (thElement) {
                        if (thElement.textContent.trim() === "商品信息") {
                            var previousSibling = thElement.previousElementSibling;
                            if (previousSibling) {
                                var input = previousSibling.querySelector('input');
                                if (input) {
                                    input.click();

                                }
                            }
                        }
                    });
                }
            }, 200);

        }
    }


    // 监听 URL 变化
    function monitorUrlChanges() {
        let previousUrl = window.location.href;
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== previousUrl) {
                previousUrl = currentUrl;
                onUrlChange();
            }
        });

        const config = {subtree: true, childList: true};
        observer.observe(document, config);
    }

    // URL 变化时的处理
    function onUrlChange() {
        const Appraisalbutton = document.getElementById("close-assessment");
        const DelCommdityButton = document.getElementById("del-commodity");
        if (window.location.href.includes("fxg.jinritemai.com/ffa/g/material/talent-quiz")) {
            if (!Appraisalbutton) {
                addAppraisalButton();
            }
        } else {
            if (Appraisalbutton) {
                Appraisalbutton.remove();
            }
        }
        if (window.location.href.includes("fxg.jinritemai.com/ffa/g/list")) {
            if (!DelCommdityButton) {
                addDelCommodityButton();
            }
        } else {
            if (DelCommdityButton) {
                DelCommdityButton.remove();
            }
        }
    }

    // 批量关闭达人测评相关代码
    // 添加关闭测评按钮
    function addAppraisalButton() {
        let button = document.createElement("button");
        button.id = "close-assessment";
        button.innerHTML = "开始自动关闭测评";
        button.className = "layui-btn layui-bg-blue";
        button.style.position = "fixed";
        button.style.top = "80px";
        button.style.right = "20px";
        button.style.zIndex = 9999;
        button.onclick = AppraisaltogglePause;
        document.body.appendChild(button);
    }

    // 切换测评暂停状态
    function AppraisaltogglePause() {
        isPaused = !isPaused;
        var button = document.getElementById("close-assessment");
        if (button) {
            button.innerHTML = isPaused ? "开始自动关闭测评" : "停止自动关闭测评";
        }
        layer.msg(isPaused ? "停止脚本！" : "开启脚本！");
        if (!isPaused) {
            processCurrentPage('close-assessment')
        }
    }


    function processCurrentPage(type, value = null) {
        if (isPaused) return;
        switch (type) {
            case 'close-assessment':
                triggerSiblingInputClick();
                break;
            case 'del-commodity':
                console.log('leixing')
                DelCommodity(value);
                break;
            default:
                layer.msg('未知类型');
        }
    }

    function triggerPreviousPageClick() {
        if (isPaused) return;
        var liElement = document.querySelector('li[title="下一页"]');
        if (liElement) {
            var button = liElement.querySelector('button');
            if (button) {
                button.click();
                console.log('Next page button clicked.');
                var lodingId = setInterval(function () {
                    if (!document.querySelector('.ecom-g-spin-dot-spin')) {
                        clearInterval(lodingId);
                        setTimeout(processCurrentPage('close-assessment'), 500);
                    }
                }, 200);
            } else {
                console.log('Button not found within <li> element.');
            }
        } else {
            console.log('<li> element with title "下一页" not found.');
        }
    }

    function triggerSiblingInputClick() {
        if (isPaused) return;
        var thElements = document.querySelectorAll('th.ecom-g-table-cell');
        thElements.forEach(function (thElement) {
            if (thElement.textContent.trim() === "商品信息") {
                var previousSibling = thElement.previousElementSibling;
                if (previousSibling) {
                    var input = previousSibling.querySelector('input');
                    if (input) {
                        input.click();
                        console.log('Input in sibling element clicked.');
                        setTimeout(triggerBatchCloseButtonClick, 500);
                    } else {
                        console.log('Input not found within previous sibling.');
                    }
                } else {
                    console.log('Previous sibling not found.');
                }
            }
        });
    }

    function triggerBatchCloseButtonClick() {
        if (isPaused) return;

        var buttonElements = document.querySelectorAll('button.ecom-g-btn-sm');
        var batchCloseTriggered = false;

        buttonElements.forEach(function (buttonElement) {
            var span = buttonElement.querySelector('span');
            if (span && span.textContent.trim() === "批量关闭") {
                buttonElement.click();
                console.log('Batch close button clicked.');
                batchCloseTriggered = true;

                var lodingId = setInterval(function () {
                    if (!document.querySelector('.ecom-g-spin-dot-spin')) {
                        clearInterval(lodingId);
                        layer.msg('下一页');
                        setTimeout(triggerPreviousPageClick, 500);
                    }
                }, 200);
            }
        });

        if (!batchCloseTriggered) {
            console.log('No "批量关闭" button found.');
        }
    }

    window.onload = () => {
        onUrlChange();
        monitorUrlChanges();
        // interceptAllRequestsFor10Seconds();
    };

    function interceptAllRequestsFor10Seconds() {
        const originalFetch = window.fetch;
        const originalOpen = XMLHttpRequest.prototype.open;

        // 拦截 fetch 请求
        window.fetch = function (...args) {
            console.log(`Intercepted fetch request to: ${args[0]}`);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    layer.msg('请求被拦截了');
                    reject(new Error('Request blocked'));
                }, 10_000); // 10 秒
            });
        };

        // 拦截 XMLHttpRequest 请求
        XMLHttpRequest.prototype.open = function (...args) {
            console.log(`Intercepted XMLHttpRequest to: ${args[1]}`);
            layer.msg('请求被拦截了');
            this.abort(); // 立即中止请求
        };

        // 10秒后恢复请求
        // setTimeout(() => {
        //     window.fetch = originalFetch;
        //     XMLHttpRequest.prototype.open = originalOpen;
        //     console.log('恢复了所有网络请求');
        //     layer.msg('请求恢复');
        // }, 10_000); // 10 秒
    }


    class Util {

        // 创建并触发键盘事件的函数
        static triggerKeyboardEvent(el, key, keyCode, ctrlKey = false) {
            key = key.toUpperCase();

            // 创建 keydown 事件
            const keydownEvent = new KeyboardEvent('keydown', {
                key: key,
                code: 'Key' + key.toUpperCase(),
                keyCode: keyCode,
                charCode: keyCode,
                which: keyCode,
                bubbles: true,
                cancelable: true,
                composed: true,
                ctrlKey: ctrlKey,  // 设置 ctrlKey
                metaKey: false,
                shiftKey: false,
                altKey: false
            });

            // 创建 keypress 事件
            const keypressEvent = new KeyboardEvent('keypress', {
                key: key,
                code: 'Key' + key.toUpperCase(),
                keyCode: keyCode,
                charCode: keyCode,
                which: keyCode,
                bubbles: true,
                cancelable: true,
                composed: true,
                ctrlKey: ctrlKey,  // 设置 ctrlKey
                metaKey: false,
                shiftKey: false,
                altKey: false
            });

            // 创建 keyup 事件
            const keyupEvent = new KeyboardEvent('keyup', {
                key: key,
                code: 'Key' + key.toUpperCase(),
                keyCode: keyCode,
                charCode: keyCode,
                which: keyCode,
                bubbles: true,
                cancelable: true,
                composed: true,
                ctrlKey: ctrlKey,  // 设置 ctrlKey
                metaKey: false,
                shiftKey: false,
                altKey: false
            });

            // 确保目标元素有焦点
            el.focus();
            el.dispatchEvent(keydownEvent);
            el.dispatchEvent(keypressEvent);
            el.dispatchEvent(keyupEvent);
        }

        // 创建并触发鼠标事件的函数
        static triggerMouseEvent(el, eventType) {
            // 创建鼠标事件
            var mouseEvent = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true
            });

            // 触发事件
            el.dispatchEvent(mouseEvent);
        }
    }
})();
