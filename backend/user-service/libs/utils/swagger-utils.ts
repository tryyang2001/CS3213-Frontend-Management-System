import fs from "fs";
import yaml from "yaml";

const swaggerYaml = fs.readFileSync("docs/swagger.yaml", "utf8");
const swaggerDocument = yaml.parse(swaggerYaml);

export default swaggerDocument;
