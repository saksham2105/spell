import config from "../../package.conf.json";

export class SpellServerUtil {
    constructor() {
    }
     getPort() {
        return config.port;
     }
}
  