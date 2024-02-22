import fs from "fs";
import yaml from "yaml";

const swaggerYaml = fs.readFileSync("src/libs/docs/swagger.yaml", "utf8");
const swaggerDocument = yaml.parse(swaggerYaml);

export default swaggerDocument;
