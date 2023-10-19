import { RSS } from "./feeds"
import { Webhook } from "./webhook"

export class RssHandler {
    private data = new Map<RSS, Webhook[]>()

    constructor() {

    }

    public pair(flux: RSS, webhook: Webhook) {
        let webhook_list = this.data.get(flux)
        if (webhook_list === undefined)
            webhook_list = new Array<Webhook>()
        
        webhook_list.push(webhook)
        this.data.set(flux, webhook_list)
        function f(): Function {
            function g(data: any) {
                if (data !== undefined) {
                    for (const item of data) {
                        webhook.send(item).then(() => {})
                    }
                }
            }
            return g;
        }
        flux.onListen(f())
    }
}