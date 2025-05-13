// @ts-check

document.head.insertAdjacentHTML(
    "beforeend",
    `<style>
.toast {
    max-width: 80vw;
    height: fit-content;
    min-height: auto;
    top: auto;
    bottom: 10px;
    background-color: var(--pico-primary-background);
    --pico-color: var(--pico-primary-inverse);
    opacity: 0.95;
}

.toast p {
    margin-top: var(--pico-typography-spacing-vertical);
}
</style>`
)

class XToaster extends HTMLDialogElement {
    constructor() { super() }

    connectedCallback() {
        let timeout = +(this.dataset.timeout || 3e3)
        this.timeoutId = setTimeout(() => {
            this.remove()
        }, timeout)
    }

    disconnectedCallback() {
        clearTimeout(this.timeoutId)
    }
}

customElements.define("x-toaster", XToaster, { extends: "dialog" })