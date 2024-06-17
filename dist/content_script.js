"use strict";
let mutedSections;
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
        if (!start || !end) {
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
function isMuted(currentTime) {
    const currentPosition = currentTime;
    if (!mutedSections) {
        return false;
    }
    for (const section of mutedSections) {
        if (section.start <= currentPosition && currentPosition <= section.end) {
            console.log(`twitch-mute-skip: muted. currentTime = ${currentTime}. currentPosition = ${currentPosition}`);
            return true;
        }
    }
    return false;
}
function nextUnmutedTime(currentTime) {
    const currentPosition = currentTime;
    if (!mutedSections) {
        return 0;
    }
    for (const section of mutedSections) {
        if (currentPosition < section.end) {
            console.log(`twitch-mute-skip: next position = ${section.end}`);
            return section.end;
        }
    }
    return 0;
}
function main() {
    const video = document.querySelector("video");
    if (!video) {
        return;
    }
    const currentTime = video.currentTime;
    const duration = video.duration;
    if (!mutedSections) {
        mutedSections = getMutedSection(duration);
        if (!mutedSections) {
            return;
        }
        console.log(`twitch-mute-skip: mutedSections = ${JSON.stringify(mutedSections)}`);
    }
    if (isMuted(currentTime)) {
        video.currentTime = nextUnmutedTime(currentTime);
    }
}
setInterval(main, 1000);
