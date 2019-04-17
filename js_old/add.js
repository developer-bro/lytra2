/* Open */
function openDataOverlay(f_str) {
	document.getElementById("contentDataOverlay").innerHTML = f_str;
    document.getElementById("dataOverlay").style.width = "100%";
}

/* Close */
function closeDataOverlay() {
    document.getElementById("dataOverlay").style.width = "0%";
}