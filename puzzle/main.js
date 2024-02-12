/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
console.log("Hello world");
const order = [
    "puzzle-welcome",
    "puzzle-car",
    "puzzle-selfie",
    "puzzle-boba",
    "puzzle-starbird",
    "puzzle-apartment",
    "puzzle-waffle",
    "puzzle-rockos",
    "puzzle-costco",
    "puzzle-base",
    "puzzle-congrats",
    "puzzle-true-end",
];
const params = new URLSearchParams(window.location.search);
let index = 0;
if (params.has("v")) {
    index = Math.floor(Number(params.get("v")));
    if (index < 0) {
        index = 0;
    }
    if (index >= order.length) {
        index = order.length - 1;
    }
    if (index === order.length - 2) {
        index++;
    }
}
let current = null;
next();
let geoButton = document.getElementById("button-welcome");
geoButton.onclick = () => {
    geo(() => {
        next();
    });
};
let carButton = document.getElementById("button-car");
carButton.onclick = () => {
    next();
};
let selfieButton = document.getElementById("button-selfie");
selfieButton.onclick = () => {
    next();
};
let selfieGeo = document.getElementById("geo-selfie");
selfieGeo.onclick = () => {
    geo((position) => {
        const lat = 37.427997;
        const lon = -122.069500;
        const dist = calcCrow(lat, lon, position.coords.latitude, position.coords.longitude);
        selfieGeo.textContent = Math.floor(dist) + "m away!";
        if (dist <= 30 + position.coords.accuracy) {
            selfieButton.style.visibility = "visible";
        }
    });
};
let bobaButton = document.getElementById("button-boba");
bobaButton.onclick = () => {
    let bobaText = document.getElementById("text-boba");
    let bobaClue = document.getElementById("clue-boba");
    if (bobaText.value.toLowerCase() === "in2u") {
        bobaClue.textContent = "BOG!!!";
        next();
    }
    else {
        bobaClue.textContent = "Password not bog enough :(";
    }
};
let starbirdButton = document.getElementById("button-starbird");
starbirdButton.onclick = () => {
    next();
};
let boxes = document.getElementsByClassName("puzzle-box");
let selected = new Set();
let numSolved = 0;
const selectedClass = "puzzle-box-selected";
const solvedClass = "puzzle-box-solved";
for (let i = 0; i < boxes.length; ++i) {
    let box = boxes[i];
    box.onclick = () => {
        if (box.classList.contains(solvedClass)) {
            return;
        }
        if (selected.has(box)) {
            box.classList.remove(selectedClass);
            selected.delete(box);
            return;
        }
        if (selected.size >= 4) {
            return;
        }
        box.classList.add(selectedClass);
        selected.add(box);
        if (selected.size === 4) {
            let category = "";
            for (let elm of selected) {
                for (let j = 0; j < elm.classList.length; ++j) {
                    if (elm.classList[j].includes("cat")) {
                        category = elm.classList[j];
                        break;
                    }
                }
                break;
            }
            if (category.length > 0) {
                let wrong = false;
                for (let elm of selected) {
                    if (!elm.classList.contains(category)) {
                        wrong = true;
                        break;
                    }
                }
                if (!wrong) {
                    numSolved++;
                    selected.forEach((elm) => {
                        elm.classList.add(solvedClass);
                        elm.classList.remove(selectedClass);
                    });
                    selected.clear();
                    document.getElementById(category + "-name").style.visibility = "visible";
                }
            }
        }
        if (numSolved >= 4) {
            starbirdButton.style.visibility = "visible";
        }
    };
}
let apartmentButton = document.getElementById("button-apartment");
apartmentButton.onclick = () => {
    let apartmentText = document.getElementById("text-apartment");
    let apartmentClue = document.getElementById("clue-apartment");
    if (apartmentText.value.toLowerCase() === "magnolia") {
        apartmentClue.textContent = "oooh yeah";
        next();
    }
    else {
        apartmentClue.textContent = "not quite";
    }
};
let waffleButton = document.getElementById("button-waffle");
waffleButton.onclick = () => {
    next();
};
let geoWaffle = document.getElementById("geo-waffle");
geoWaffle.onclick = () => {
    geo((position) => {
        const lat = 37.353981;
        const lon = -121.954642;
        const dist = calcCrow(lat, lon, position.coords.latitude, position.coords.longitude);
        geoWaffle.textContent = Math.floor(dist) + "m away!";
        if (dist <= 30 + position.coords.accuracy) {
            waffleButton.style.visibility = "visible";
        }
    });
};
let rockosButton = document.getElementById("button-rockos");
rockosButton.onclick = () => {
    next();
};
let rockosGeo = document.getElementById("geo-rockos");
rockosGeo.onclick = () => {
    geo((position) => {
        const lat = 37.34561728311603;
        const lon = -121.93748772707056;
        const dist = calcCrow(lat, lon, position.coords.latitude, position.coords.longitude);
        rockosGeo.textContent = Math.floor(dist) + "m away!";
        if (dist <= 30 + position.coords.accuracy) {
            rockosButton.style.visibility = "visible";
        }
    });
};
let costcoButton = document.getElementById("button-costco");
costcoButton.onclick = () => {
    next();
};
let baseButton = document.getElementById("button-base");
baseButton.onclick = () => {
    next();
};
let baseGeo = document.getElementById("geo-base");
baseGeo.onclick = () => {
    geo((position) => {
        const lat = 37.415431853136795;
        const lon = -121.95672258207551;
        const dist = calcCrow(lat, lon, position.coords.latitude, position.coords.longitude);
        baseGeo.textContent = Math.floor(dist) + "m away!";
        if (dist <= 100 + position.coords.accuracy) {
            baseButton.style.visibility = "visible";
        }
    });
};
let trueEndClue = document.getElementById("clue-true-end");
let yesButton = document.getElementById("button-yes");
let noButton = document.getElementById("button-no");
yesButton.onclick = () => {
    yesButton.style.display = "none";
    noButton.style.display = "none";
    trueEndClue.textContent = "WAHOO";
    setInterval(() => {
        trueEndClue.textContent += "O";
    }, 333);
};
noButton.onclick = () => {
    yesButton.style.display = "none";
    noButton.style.display = "none";
    trueEndClue.textContent = "sad bog...";
};
function next() {
    console.log("Loading...");
    if (current !== null && index < order.length - 1) {
        current.style.height = "0%";
        current.style.opacity = "0";
        index++;
        window.history.replaceState(null, null, "?v=" + index);
    }
    if (index >= 0 && index < order.length) {
        current = document.getElementById(order[index]);
        if (current === null) {
            console.error("Null for", order[index], index);
            return;
        }
        current.style.display = "block";
        current.style.height = "100%";
    }
}
function geo(cb) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            cb(position);
        }, () => { console.error("GPS error"); }, { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
    }
}
function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000;
    return d;
}
function toRad(deg) {
    return deg * Math.PI / 180;
}

/******/ })()
;
//# sourceMappingURL=main.js.map