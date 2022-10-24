export class LinkedList {
    constructor() {
        this.next = null
    }

    add(node) {
        if (!this.next) {
            this.next = node
        } else {
            this.next.add(node)
        }
    }
}
