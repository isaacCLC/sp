export class CommonUtils {

    static isNullOrWhiteSpace(str: any): boolean {
        if (str === null)
            return true;
        else if (typeof str == 'undefined')
            return true;
        else if (typeof str == "undefined")
            return true;
        else if (typeof str == 'string')
            return !/\S/.test(str); // returns true if string is empty or just whitespace
        else
            return true;
    }

    static containsWhiteSpace(str):boolean{
        if(/\s/.test(str)) return true;
    }

    static createGuid(): string {
        let S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }
}
