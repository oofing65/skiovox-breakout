let extensionPrefix = document.querySelector("input").value;
let payload = document.querySelector("textarea").value;
let status = document.querySelector("#status");
let [cancel, start] = document.querySelectorAll("button");  
function sections() {
    return document.querySelectorAll('body>div');
}
function changeStatusMessage(message) {
    status.textContent = ([message] || [""]).join();
}
function checkIfValid() {
    return new Promise((resolve, reject) => {
        resolve(Boolean(document.querySelector("input").value.length > 0));
    });
}
start.addEventListener("click", async function () {
    let valid = await checkIfValid();
    if (!valid) return;
    payload = document.querySelector("textarea").value;
    extensionPrefix = document.querySelector("input").value;
    const { status } = await chrome.runtime.sendMessage({ type: "start-inspect", prefix: extensionPrefix, payload: payload === '' ? undefined : payload });
    if (!status) return changeStatusMessage("failed!");
    return changeStatusMessage(status);
});

cancel.addEventListener("click", async function () {
    let msg = await chrome.runtime.sendMessage({ type: "cancel-inspect" });
    if (!msg) return changeStatusMessage("failed!");
    return changeStatusMessage("canceled");
});
sections().forEach(function (element) {
    element.style.display = 'none';
});
sections()[0].style.display = 'block';
var currentIndex = 0;
function switchToNextSlide(offset) {
    sections()[currentIndex].style.display = 'none';
    currentIndex = currentIndex + offset;
    if (currentIndex >= sections().length) {
        currentIndex = 0;
    }
    if (currentIndex < 0) {
        currentIndex = sections().length - 1;
    }
    var newIndex = currentIndex;

    sections()[newIndex].style.display = 'block';
    newIndex = currentIndex;

}

document.onkeydown = async function (ev) {
    if (ev.repeat) return;
    console.log()
    if (!([document.body, document].includes(ev.target))) {
        return false;
    }
    if (ev.key === 'ArrowLeft') {
        switchToNextSlide(-1)
    } else if (ev.key === 'ArrowRight') {
        switchToNextSlide(1);
    }
}
