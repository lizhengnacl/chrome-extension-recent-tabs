import im from './lib/im';
import keyboard from './lib/keyboard';
import tabs from './lib/tabs';
import win from './lib/windows';
import recentFiles from './lib/recentFiles';
import go from './lib/go';

// 接受来自content的请求

im.on(function(data, sender, sendResponse) {
    switch (data.type) {
        case 'activeTab':
            tabs.active(data.data);
            break;
        case 'activeWindow':
            win.active(data.data);
            break;
    }
    sendResponse('');
});

keyboard.on(function(command) {
    // 配合manifest中的commands
    if (command === 'toggle-recent-tabs') {
        win.getCurrent(function(window) {
            im.request({
                type: 'currentWindow',
                data: window,
            }, function(response) {});
        });

        tabs.list().then((list) => {
            // 发送请求到前台
            im.request({
                type: 'tabsList',
                data: recentFiles.sort(list),
            }, function(response) {});
        });
    }

    if (command === 'to-left') {
        go(-1);
    }

    if (command === 'to-right') {
        go(1);
    }
});

tabs.onActivated(function({tabId, windowId}) {
    recentFiles.add(tabId);
});

tabs.onRemoved(function(tabId, {windowId, isWindowClosing}) {
    recentFiles.remove(tabId);
});
