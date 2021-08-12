const fs = require("fs");
const path = require("path");

const answerFilepath = path.resolve(process.cwd(), ".answers");

class AnswersHelper {
  cached = null;
  getAll() {
    if (this.cached) return this.cached;
    try {
      const json =
        (fs.existsSync(answerFilepath) &&
          JSON.parse(fs.readFileSync(answerFilepath).toString())) ||
        {};
      this.cached = json;
      return json;
    } catch (error) {
      const json = {};
      return json;
    }
  }
  get(key) {
    const json = this.getAll();
    return json[key];
  }
  save(toSave) {
    const json = this.getAll();
    const output = JSON.stringify({ ...json, ...toSave });
    fs.writeFileSync(answerFilepath, output);
  }
}

module.exports = new AnswersHelper();
