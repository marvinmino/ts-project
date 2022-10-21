class Note{
    public title: string;
    public content: string;
    public order: number;
    public categoryName: string;

    constructor(title: string, content: string, categoryName: string, order: number = 0) {
        this.title = title;
        this.content = content;
        this.categoryName = categoryName;
        this.order = order;
    }

    public getTitle() {
        return this.title
    }

    public setTitle(title: string) {
        this.title = title;
    }

    public getOrder() {
        return this.order
    }

    public setOrder(order: number) {
        this.order = order;
    }

    public getContent() {
        return this.content;
    }

    public setContent(content: string) {
        this.content = content;
    }


    public getCategoryName(){
        return this.categoryName
    }

    public setCategoryName(categoryName: string){
        this.categoryName = categoryName;
    }
}

export{Note}