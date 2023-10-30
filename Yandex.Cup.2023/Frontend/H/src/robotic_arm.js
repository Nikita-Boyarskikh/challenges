import { Transmitter } from "./utils/transmitter";

const STATUSES = {
    off: "OFF",
    inited: "INITED",
    activated: "ACTIVATED",
    working: "WORKING",
    grabed: "GRABED",
    moving: "MOVING",
};

export class RoboticArm {
    constructor(id, percent = 100) {
        this.resultContainer = document.querySelector("#result");
        this.percent = percent;
        const el = document.createElement("div");
        el.textContent = `Передатчик ${id}: `;
        el.id = `id_result_${id}`;
        this.resultContainer.appendChild(el);
        this.result = el;
        this.id = id;
        this.status = STATUSES.off;
        this.isTaskRunning = false;
        this.logs = "";
        this.date = null;
        this.date1 = null;
        this.transmitter = new Transmitter();
    }

    async logger(move) {
        if (move === this.logs[this.logs.length - 1]) {
            throw new Error("Oшибка повторения действия");
        }
        this.logs += move;
        const last = this.logs.slice(-2);

        if (move === 'S') {
            this.result.textContent += " ";
        }

        if (last === "FD" || last === "DF") {
            if (this.logs.slice(-3, -2) !== 'T') {
                throw new Error('TaskRunner может запускать только два действия одновременно')
            }
            this.date = new Date();
        } else if (last === "UB" || last === "BU") {
            if (this.logs.slice(-3, -2) !== 'T') {
                throw new Error('TaskRunner может запускать только два действия одновременно')
            }
            this.date1 = new Date();
            if (this.date) {
                const dif = new Date() - this.date;
                if (dif > 500 && dif < 600) {
                    this.result.textContent += ".";
                    this.transmitter.sendRay("short");
                } else if (dif > 1000 && dif < 1100) {
                    this.result.textContent += "-";
                    this.transmitter.sendRay("long");
                }
            }
        }
    }

    getRandomResult(callback, timeout = 10, percent = this.percent) {
        return new Promise((res, rej) =>
            setTimeout(() => {
                if (Math.random() * 100 < percent) {
                    res();
                } else {
                    this.status = STATUSES.inited;
                    this.isTaskRunning = false
                    rej(
                        "Произошла ошибка, рука вернулась в исходное положение"
                    );
                    this.logger('E')


                    this.result.textContent = this.result.textContent.slice(
                        0,
                        this.result.textContent.lastIndexOf(" ") + 1
                    );
                }
            }, timeout)
        ).then(callback);
    }

    async init() {
        return this.getRandomResult(() => {
            this.logger('I')
            this.status = STATUSES.inited;
        });
    }

    taskRunner(task) {
        if (this.status === STATUSES.moving) {
            throw new Error("Метод не может использоваться, рука находится в движении");
        }
        if (this.status !== STATUSES.grabed) {
            throw new Error("Рука не готова к использованию, предмет не закреплен");
        }

        this.isTaskRunning = true;
        this.logger('T')

        setTimeout(() =>
            task().then(() => {
                this.isTaskRunning = false;
            })
        );
    }

    async grabItem() {
        if (this.status === STATUSES.off) {
            throw new Error("Рука не иницилизирована");
        }
        if (this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }

        return this.getRandomResult(() => (this.status = STATUSES.grabed), 10, 100);
    }

    async dropItem() {
        if (this.status !== STATUSES.grabed) {
            throw new Error("В руке нет предмета");
        }
        if (this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }

        return this.getRandomResult(() => { this.status = STATUSES.inited; this.logger('S') }, 10, 100);
    }

    async reset() {
        if (this.status !== STATUSES.inited) {
            throw new Error("Этот метод не может использоваться здесь");
        }

        return this.getRandomResult(() => { this.status = STATUSES.inited; this.result.textContent += "| "; this.logger('R') });
    }

    async moveForward() {
        if (!this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }
        if (
            this.status !== STATUSES.grabed &&
            this.status !== STATUSES.moving
        ) {
            throw new Error("Предмет не обнаружен");
        }

        this.status = STATUSES.moving;

        return this.getRandomResult(() => {
            this.status = STATUSES.grabed;
            return this.logger("F");
        });
    }

    async moveDown() {
        if (!this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }
        if (
            this.status !== STATUSES.grabed &&
            this.status !== STATUSES.moving
        ) {
            throw new Error("Предмет не обнаружен");
        }

        this.status = STATUSES.moving;

        return this.getRandomResult(() => {
            this.status = STATUSES.grabed;
            return this.logger("D");
        });
    }

    async moveBack() {
        if (!this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }
        if (
            this.status !== STATUSES.grabed &&
            this.status !== STATUSES.moving
        ) {
            throw new Error("Предмет не обнаружен");
        }

        this.status = STATUSES.moving;

        return this.getRandomResult(() => {
            this.status = STATUSES.grabed;
            return this.logger("B");
        });
    }

    async moveUp() {
        if (!this.isTaskRunning) {
            throw new Error("Этот метод не может использоваться здесь");
        }
        if (
            this.status !== STATUSES.grabed &&
            this.status !== STATUSES.moving
        ) {
            throw new Error("Предмет не обнаружен");
        }

        this.status = STATUSES.moving;

        return this.getRandomResult(() => {
            this.status = STATUSES.grabed;
            return this.logger("U");
        });
    }
}
