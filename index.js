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

    let isPaused = true;  // 用于标记脚本是否处于暂停状态

    // 引入 layui 脚本
    const addScript = (src, type = 'text/javascript') => {
        const script = document.createElement("script");
        script.setAttribute("type", type);
        script.src = src;
        document.documentElement.appendChild(script);
    };

    // 引入 layui 样式
    const addLink = (href, rel = 'stylesheet') => {
        const link = document.createElement("link");
        link.setAttribute("rel", rel);
        link.href = href;
        document.documentElement.appendChild(link);
    };

    addScript("https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.13/layui.js");
    addLink("https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.13/css/layui.css");

    console.log('ojbk');

    // 监听 URL 变化
    const monitorUrlChanges = () => {
        let previousUrl = window.location.href;  // 记录之前的 URL
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;  // 获取当前的 URL
            if (currentUrl !== previousUrl) {  // 如果 URL 发生变化
                previousUrl = currentUrl;  // 更新之前的 URL
                onUrlChange();  // 调用 URL 变化时的处理函数
            }
        });

        // 监听整个文档的 DOM 变化
        observer.observe(document, {subtree: true, childList: true});
    };

    // URL 变化时的处理
    const onUrlChange = () => {
        const AppraisalButton = document.getElementById("close-assessment");  // 查找关闭测评按钮
        const DelGoodButton = document.getElementById("del-good");  // 查找关闭测评按钮
        if (window.location.href.includes("fxg.jinritemai.com/ffa/g/material/talent-quiz")) {  // 如果 URL 包含测评页面的路径
            if (!AppraisalButton) addAppraisalButton();  // 如果按钮不存在，则添加按钮
        } else {
            if (AppraisalButton) AppraisalButton.remove();  // 如果不在测评页面且按钮存在，则移除按钮
        }
        if (window.location.href.includes("fxg.jinritemai.com/ffa/g/recycle")) {  // 回收站
            if (!DelGoodButton) addDelGoodButton();  // 如果按钮不存在，则添加按钮
        } else {
            if (DelGoodButton) DelGoodButton.remove();  // 如果不在测评页面且按钮存在，则移除按钮
        }
    };

    // 添加关闭测评按钮
    const addAppraisalButton = () => {
        const button = document.createElement("button");
        button.id = "close-assessment";  // 设置按钮的 ID
        button.innerHTML = "开始自动关闭测评";  // 设置按钮的文本
        button.className = "layui-btn layui-bg-blue";  // 设置按钮的样式
        button.style.cssText = "position: fixed; top: 80px; right: 20px; z-index: 9999;";  // 设置按钮的位置和层级
        button.onclick = AppraisaltogglePause;  // 绑定按钮的点击事件
        document.body.appendChild(button);  // 将按钮添加到页面中
    };

    // 添加删除回收站按钮
    const addDelGoodButton = () => {
        const button = document.createElement("button");
        button.id = "del-good";  // 设置按钮的 ID
        button.innerHTML = "开始自动彻底删除";  // 设置按钮的文本
        button.className = "layui-btn layui-bg-blue";  // 设置按钮的样式
        button.style.cssText = "position: fixed; top: 80px; right: 20px; z-index: 9999;";  // 设置按钮的位置和层级
        button.onclick = DelGoodTogglePause;  // 绑定按钮的点击事件
        document.body.appendChild(button);  // 将按钮添加到页面中
    };

    // 切换测评暂停状态
    const AppraisaltogglePause = () => {
        isPaused = !isPaused;  // 切换暂停状态
        const button = document.getElementById("close-assessment");
        if (button) button.innerHTML = isPaused ? "开始自动关闭测评" : "停止自动关闭测评";  // 更新按钮文本
        layer.msg(isPaused ? "停止脚本！" : "开启脚本！");  // 显示提示消息
        if (!isPaused) processCurrentPage('close-assessment');  // 如果没有暂停，则处理当前页面
    };

    // 彻底删除暂停状态
    const DelGoodTogglePause = () => {
        isPaused = !isPaused;  // 切换暂停状态
        const button = document.getElementById("del-good");
        if (button) button.innerHTML = isPaused ? "开始自动彻底删除" : "停止自动彻底删除";  // 更新按钮文本
        layer.msg(isPaused ? "停止脚本！" : "开启脚本！");  // 显示提示消息
        if (!isPaused) processCurrentPage('del-good');  // 如果没有暂停，则处理当前页面
    };

    // 处理当前页面的任务
    const processCurrentPage = (type, value = null) => {
        if (isPaused) return;  // 如果处于暂停状态，则不执行任何操作
        switch (type) {
            case 'close-assessment':  // 处理关闭测评的任务
                triggerSiblingInputClick(() => {
                    setTimeout(() => {
                        triggerBatchCloseButtonClick();
                    }, 500);
                });
                break;
            case 'del-good':  // 彻底删除回收站的任务
                triggerSiblingInputClick(() => {
                    setTimeout(() => {
                        triggerBatchDelButtonClick();
                    }, 500);
                });
                break;

            default:
                layer.msg('未知类型');  // 显示未知类型的提示消息
        }
    };

    // 触发“下一页”按钮的点击事件
    const triggerPreviousPageClick = (fun) => {
        if (isPaused) return;  // 如果处于暂停状态，则不执行任何操作
        const liElement = document.querySelector('li[title="下一页"]');  // 查找“下一页”按钮所在的 <li> 元素
        if (liElement) {
            const button = liElement.querySelector('button');  // 查找 <li> 元素中的按钮
            if (button) {
                button.click();  // 点击按钮
                console.log('Next page button clicked.');
                const lodingId = setInterval(() => {
                    if (!document.querySelector('.ecom-g-spin-dot-spin')) {  // 等待页面加载完成
                        clearInterval(lodingId);  // 清除定时器
                        fun()
                    }
                }, 500);
            } else {
                console.log('Button not found within <li> element.');  // 未找到按钮的提示
            }
        } else {
            console.log('<li> element with title "下一页" not found.');  // 未找到“下一页”按钮的提示
        }
    };

    // 触发全选的点击事件
    const triggerSiblingInputClick = (fun) => {
        if (isPaused) return;  // 如果处于暂停状态，则不执行任何操作
        document.querySelectorAll('th.ecom-g-table-cell').forEach(thElement => {
            if (thElement.textContent.trim() === "商品信息") {  // 查找包含“商品信息”文本的 <th> 元素
                const previousSibling = thElement.previousElementSibling;  // 获取前一个兄弟元素
                if (previousSibling) {
                    const input = previousSibling.querySelector('input');  // 查找兄弟元素中的 input 元素
                    if (input) {
                        input.click();  // 点击 input 元素
                        console.log('Input in sibling element clicked.');
                        // setTimeout(triggerBatchCloseButtonClick, 500);  // 处理批量关闭按钮
                        if (fun) {
                            fun()
                        }
                    } else {
                        console.log('Input not found within previous sibling.');  // 未找到 input 元素的提示
                    }
                } else {
                    console.log('Previous sibling not found.');  // 未找到兄弟元素的提示
                }
            }
        });
    };

    // 触发“批量关闭”按钮的点击事件
    const triggerBatchCloseButtonClick = () => {
        if (isPaused) return;  // 如果处于暂停状态，则不执行任何操作
        let batchCloseTriggered = false;

        document.querySelectorAll('button.ecom-g-btn-sm').forEach(buttonElement => {
            const span = buttonElement.querySelector('span');  // 查找按钮中的 span 元素
            if (span && span.textContent.trim() === "批量关闭") {  // 查找包含“批量关闭”文本的按钮
                buttonElement.click();  // 点击按钮
                console.log('Batch close button clicked.');
                batchCloseTriggered = true;

                const lodingId = setInterval(() => {
                    if (!document.querySelector('.ecom-g-spin-dot-spin')) {  // 等待页面加载完成
                        clearInterval(lodingId);  // 清除定时器
                        layer.msg('下一页');  // 显示提示消息
                        // setTimeout(triggerPreviousPageClick, 500);  // 触发“下一页”按钮点击事件
                        triggerPreviousPageClick(() => {
                            setTimeout(() => processCurrentPage('close-assessment'), 500);
                        })
                    }
                }, 500);
            }
        });

        if (!batchCloseTriggered) {
            console.log('No "批量关闭" button found.');  // 未找到“批量关闭”按钮的提示
        }
    };

    // 触发“彻底删除”按钮的点击事件
    const triggerBatchDelButtonClick = () => {
        if (isPaused) return;  // 如果处于暂停状态，则不执行任何操作
        let batchCloseTriggered = false;

        document.querySelectorAll('button.ecom-g-btn-sm').forEach(buttonElement => {
            const span = buttonElement.querySelector('span');
            if (span && span.textContent.trim() === "彻底删除") {
                buttonElement.click();  // 点击按钮
                console.log('Batch close button clicked.');
                batchCloseTriggered = true;

                let isYes = false;

                // 等待.ecom-g-modal-confirm-btns确认框出现，获取里面的button，button里面的span的文本是“确认”
                const qrId = setInterval(() => {
                    if (document.querySelector('.ecom-g-modal-confirm-btns')) {  // 等待页面加载完成
                        clearInterval(qrId);  // 清除定时器
                        document.querySelectorAll('.ecom-g-modal-confirm-btns button').forEach(buttonElement => {
                            const span = buttonElement.querySelector('span');
                            if (span && span.textContent.trim() === "确认") {
                                buttonElement.click();  // 点击按钮
                                console.log('Batch close button clicked.');
                                isYes = true;
                            }
                        });
                    }
                }, 500);

                // 等待isYes为true
                const YesId = setInterval(() => {
                    if (isYes) {  // 等待页面加载完成
                        clearInterval(YesId);  // 清除定时器

                        // 检测.ecom-g-message-notice-content是否存在
                        const messageId = setInterval(() => {
                            if (document.querySelector('.ecom-g-message-notice-content')) {  // 等待提示删除成功
                                console.log(document.querySelector('.ecom-g-message-notice-content'))
                                clearInterval(messageId);  // 清除定时器

                                // setTimeout(() => processCurrentPage('del-good'), 500);
                                // 触发查询按钮，class=ecom-g-btn-dashed ecom-g-btn-s，button里面span文本是查询
                                document.querySelectorAll('button.ecom-g-btn-dashed').forEach(buttonElement => {
                                    const span = buttonElement.querySelector('span');
                                    if (span && span.textContent.trim() === "查询") {
                                        span.click();  // 点击按钮
                                        console.log('Batch close button clicked.');
                                        const lodingId = setInterval(() => {
                                            if (!document.querySelector('.ecom-g-spin-dot-spin')) {  // 等待页面加载完成
                                                clearInterval(lodingId);  // 清除定时器
                                                setTimeout(() => processCurrentPage('del-good'), 1000);
                                            }
                                        }, 500);
                                    }
                                });
                            }
                        }, 300);
                    }
                }, 100);
            }
        });

        if (!batchCloseTriggered) {
            console.log('No "彻底删除" button found.');  // 未找到“批量关闭”按钮的提示
        }
    };

    window.onload = () => {
        onUrlChange();  // 页面加载时检查 URL 变化
        monitorUrlChanges();  // 监听 URL 变化
        // interceptAllRequestsFor10Seconds();  // 可选择拦截请求的代码
    };

    // 可选择拦截请求的代码
    const interceptAllRequestsFor10Seconds = () => {
        const originalFetch = window.fetch;  // 保存原始的 fetch 函数
        const originalOpen = XMLHttpRequest.prototype.open;  // 保存原始的 XMLHttpRequest.open 函数

        // 拦截 fetch 请求
        window.fetch = (...args) => {
            console.log(`Intercepted fetch request to: ${args[0]}`);  // 打印请求的 URL
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    layer.msg('请求被拦截了');  // 显示请求被拦截的提示
                    reject(new Error('Request blocked'));  // 拒绝请求
                }, 10_000);  // 10 秒
            });
        };

        // 拦截 XMLHttpRequest 请求
        XMLHttpRequest.prototype.open = function (...args) {
            console.log(`Intercepted XMLHttpRequest to: ${args[1]}`);  // 打印请求的 URL
            layer.msg('请求被拦截了');  // 显示请求被拦截的提示
            this.abort();  // 立即中止请求
        };

        // 10秒后恢复请求
        // setTimeout(() => {
        //     window.fetch = originalFetch;  // 恢复原始的 fetch 函数
        //     XMLHttpRequest.prototype.open = originalOpen;  // 恢复原始的 XMLHttpRequest.open 函数
        //     console.log('恢复了所有网络请求');  // 打印恢复请求的消息
        //     layer.msg('请求恢复');  // 显示请求恢复的提示
        // }, 10_000);  // 10 秒
    };

    class Util {
        // 这里可以添加公共工具方法
    }
})();