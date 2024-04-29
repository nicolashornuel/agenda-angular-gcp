// https://en.wikipedia.org/wiki/Special:ApiSandbox
export interface QueryWikipedia {
    origin: string,
    action: string,
    format: string,
    uselang: string,
    prop: string,
    titles: string,
    redirects: number,
    converttitles: number,
    exintro: number,
    explaintext: number,
}
