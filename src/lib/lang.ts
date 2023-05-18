export interface Language {
    name: string;
    code: string;
}

export class Language {
    public lang: Record<string, string>;
    public available: Language[];

    constructor(lang: string) {
        this.lang = {};
        this.available = [];
        this.setLanguage(lang);

        fetch("./lang/list.json")
            .then((r) => r.json())
            .then((r) => {
                this.available = r;
            });
    }

    /*
     * Get translation key.
     */
    getTranslationKey(key: string) {
        return this.lang[key] == undefined ? key : this.lang[key];
    }

    setLanguage(lang: string) {
        return new Promise((resolve, reject) => {
            try {
                // I hate vue :(
                const languageFile = "./lang/" + lang + ".json";
                fetch(languageFile).then((r) => {
                    r.json()
                        .then((json) => {
                            for (const key of Object.keys(json)) this.lang[key] = json[key];

                            resolve(true);
                        })
                        .catch(reject);
                }, reject);
            } catch (e) {
                reject(e);
                console.log("Faild to loading language.");
                console.log(e);
            }
        });
    }
}
