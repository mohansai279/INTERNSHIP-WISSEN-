function loadScript(url, callback) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js", () => {
        console.log("XLSX script loaded successfully.");
    });

    loadScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js", () => {
        console.log("FileSaver script loaded successfully.");
    });
});
