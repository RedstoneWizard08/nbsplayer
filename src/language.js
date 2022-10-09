export class Language {
  constructor(lang) {
    this.lang = {};
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
  getTranslationKey(key) {
    return this.lang[key] == undefined ? key : this.lang[key];
  }
  setLanguage(lang) {
    return new Promise((resolve, reject) => {
      try {
        // I hate vue :(
        const languageFile = "./lang/" + lang + ".json";
        fetch(languageFile).then((r) => {
          r.json()
            .then((json) => {
              for (let key of Object.keys(json)) this.lang[key] = json[key];
              resolve();
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
