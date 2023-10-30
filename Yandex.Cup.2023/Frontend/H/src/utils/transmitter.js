function setCSS(element, styles, unit = "px") {
    for (const key in styles) {
        element.style.setProperty(key, `${styles[key]}${unit}`);
    }
}

const app = document.getElementById("app");

export class Transmitter {
    raysContainer = null;
    raysContainerStyles = {};

    constructor() {

        this.buildTransmitter();
    }

    buildTransmitter() {
        const transmittersContainer = document.querySelector(
            ".transmitters-container"
        );
        const transmitter = document.createElement("div");

        transmitter.classList.add("transmitter");
        transmittersContainer.appendChild(transmitter);
        this.transmitter = transmitter;

        window.requestAnimationFrame(() => {
            this.marsRect = document.querySelector(".mars").getBoundingClientRect();
            this.transmitterBoundRect =
                this.transmitter.getBoundingClientRect();
            this.buildRaysContainer();
        });
    }

    buildRaysContainer() {
        const raysContainer = document.createElement("div");

        raysContainer.classList.add("transmitter-rays-container");
        app.appendChild(raysContainer);
        this.raysContainer = raysContainer;

        this.buildRaysContainerStyles();
    }

    buildRaysContainerStyles() {
        const top =
            Math.min(this.marsRect.top, this.transmitterBoundRect.top) +
            this.transmitterBoundRect.height / 2;
        const left =
            Math.min(this.marsRect.left, this.transmitterBoundRect.left) +
            this.marsRect.width / 2;
        const right =
            window.innerWidth -
            Math.max(this.marsRect.right, this.transmitterBoundRect.right) +
            this.transmitterBoundRect.width / 2;
        const bottom =
            window.innerHeight -
            Math.max(this.marsRect.bottom, this.transmitterBoundRect.bottom) +
            this.marsRect.height / 2;
        const height = window.innerHeight - (top + bottom);
        const width = window.innerWidth - (left + right);

        this.raysContainerStyles = {
            top,
            left,
            height,
            width,
        };

        setCSS(this.raysContainer, this.raysContainerStyles);
    }

    sendRay(rayType = "long") {
        const ray = document.createElement("div");

        ray.classList.add("ray", rayType);
        ray.style.setProperty(
            "transform",
            `rotate(atan(-${this.raysContainerStyles.height} / ${this.raysContainerStyles.width}))`
        );

        this.raysContainer.appendChild(ray);
    }
}
