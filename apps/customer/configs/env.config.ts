type TEnvConfig = {
    [key: string]: string;
}

export class ConfigLoader<T extends {}> {
    private env = {};
    constructor(requiteEnv?: string[]) {
        const envList = process?.env;
    }
}