// التحقق من دعم الإشعارات
export const isNotificationSupported = () => {
    return "Notification" in window;
};

// طلب إذن الإشعارات من المستخدم
export const requestNotificationPermission = () => {
    if (isNotificationSupported() && Notification.permission === "default") {
        return Notification.requestPermission();
    }
    return Promise.resolve(Notification.permission);
};

// عرض إشعار
export const showNotification = (title, body) => {
    if (isNotificationSupported() && Notification.permission === "granted") {
        new Notification(title, { body });
    }
};

// جدولة إشعار تذكير
export const scheduleReminder = (message, delay) => {
    if (isNotificationSupported()) {
        requestNotificationPermission().then(permission => {
            if (permission === "granted") {
                setTimeout(() => {
                    showNotification("تذكير", message);
                }, delay);
            }
        });
    }
};
