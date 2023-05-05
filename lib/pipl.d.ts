export declare class PiplClient {
    static BASE_URL: string;
    apiKey: string;
    constructor({ apiKey }: {
        apiKey: any;
    });
    search(o: any): Promise<any>;
    personSearch(o: any): Promise<any>;
}
