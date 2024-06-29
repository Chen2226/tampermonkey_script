// ==UserScript==
// @name         抖店自动操作
// @namespace    http://tampermonkey.net/
// @version      2024-06-06
// @description  try to take over the world!
// @author       Chen
// @match        *://fxg.jinritemai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 引入layui
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.13/layui.js";
    document.documentElement.appendChild(script);
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/layui/2.9.13/css/layui.css";
    document.documentElement.appendChild(link);

    console.log('ojbk');

    function addButton() {
        let button = document.createElement("button");
        button.id = "close-assessment";
        button.innerHTML = "开启脚本";
        button.className = "layui-btn layui-bg-blue";
        button.style.position = "fixed";
        button.style.top = "80px";
        button.style.right = "20px";
        button.style.zIndex = 9999;
        button.onclick = togglePause;
        document.body.appendChild(button);
    }

    function monitorUrlChanges() {
        let previousUrl = window.location.href;
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== previousUrl) {
                previousUrl = currentUrl;
                onUrlChange();
            }
        });

        const config = { subtree: true, childList: true };
        observer.observe(document, config);
    }

    function onUrlChange() {
        const button = document.getElementById("close-assessment");
        if (window.location.href.includes("fxg.jinritemai.com/ffa/g/material/talent-quiz")) {
            if (!button) {
                addButton();
            }
        } else {
            if (button) {
                button.remove();
            }
        }
    }

    function togglePause() {
        isPaused = !isPaused;
        var message = isPaused ? "停止脚本！" : "开启脚本！";
        layer.msg(message);
        var button = document.getElementById("close-assessment");
        if (button) {
            button.innerHTML = isPaused ? "开启脚本" : "停止脚本";
        }
        if (!isPaused) {
            processCurrentPage()
        }
    }

    // 批量关闭达人测评相关代码
    var intervalId = null;
    var isPaused = true;

    function processCurrentPage() {
        if (isPaused) return;
        triggerSiblingInputClick();
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
                        setTimeout(processCurrentPage, 500);
                    }
                }, 500);
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
                }, 500);
            }
        });

        if (!batchCloseTriggered) {
            console.log('No "批量关闭" button found.');
        }
    }



    // intervalId = setInterval(processCurrentPage, 20000);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'k' || event.key === 'K') {
            togglePause();
        }
    });

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

})();
