import { Log } from '../logs/log';


export class LogPaginacaoDto{
    public logs: Array<Log>;
    public continuationToken: any;
}