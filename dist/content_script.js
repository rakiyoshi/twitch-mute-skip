"use strict";
function getMutedSection(duration) {
    const videoRef = document.querySelector(".video-ref");
    if (!videoRef) {
        return undefined;
    }
    const segments = videoRef.querySelectorAll(".seekbar-segment");
    if (segments.length === 0) {
        return undefined;
    }
    let res = [];
    for (const segment of segments) {
        if (segment.style.backgroundColor !== "rgba(212, 73, 73, 0.5)") {
            continue;
        }
        const start = (parseFloat(segment.style.left) * duration) / 100;
        const end = start + (parseFloat(segment.style.width) * duration) / 100;
        if (isNaN(start) || isNaN(end) || !isFinite(start) || !isFinite(end)) {
            continue;
        }
        res.push({ start: start, end: end });
    }
    if (res.length === 0) {
        return undefined;
    }
    return res.sort(function (a, b) {
        return a.start < b.start ? -1 : 1;
    });
}
function isMuted(currentTime, mutedSections) {
    const currentPosition = currentTime;
    for (const section of mutedSections) {
        if (section.start <= currentPosition && currentPosition <= section.end) {
            console.log(`twitch-mute-skip: muted. currentTime = ${currentTime}. currentPosition = ${currentPosition}`);
            return true;
        }
    }
    return false;
}
function nextUnmutedTime(currentTime, mutedSections) {
    const currentPosition = currentTime;
    for (const section of mutedSections) {
        if (currentPosition < section.end) {
            console.log(`twitch-mute-skip: next position = ${section.end}`);
            return section.end;
        }
    }
    return 0;
}
function hideMutedSegmentsAlert() {
    const mutedSegmentsAlert = document.querySelector(".muted-segments-alert__scroll-wrapper");
    if (!mutedSegmentsAlert) {
        return;
    }
    if (!mutedSegmentsAlert.getElementsByTagName("button").length) {
        return;
    }
    const button = mutedSegmentsAlert.getElementsByTagName("button")[0];
    button.click();
}
function main() {
    const video = document.querySelector("video");
    if (!video) {
        return;
    }
    const currentTime = video.currentTime;
    const duration = video.duration;
    const mutedSections = getMutedSection(duration);
    if (!mutedSections) {
        return;
    }
    hideMutedSegmentsAlert();
    if (isMuted(currentTime, mutedSections)) {
        video.currentTime = nextUnmutedTime(currentTime, mutedSections);
    }
}
setInterval(main, 1000);
