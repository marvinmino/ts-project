import {Note} from "./Note"

class Category{
    public name: string;
    public order: number;
    public notes: Note[];

    constructor(name: string, notes: Note[], order: number = 0) {
        this.name = name;
        this.order = order;
        this.notes = notes;
    }

    public getName() {
        return this.name
    }

    public setName(name: string) {
        this.name = name;
    }

    public getOrder() {
        return this.order
    }

    public setOrder(order: number) {
        this.order = order;
    }

    public getNotes() {
        return this.notes;
    }

    public setNotes(notes: Note[]) {
        this.notes = notes;
    }

}

export{Category}