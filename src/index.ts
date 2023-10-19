import { ArgumentParser } from "argparse"
import { readFileSync } from "fs"

import { RSS } from "./utils/feeds"
import { Webhook } from "./utils/webhook"
import { RssHandler } from "./utils/rsshandler"

const parser = new ArgumentParser({
    description: "RSS"
})

parser.add_argument('-f', '--conf_file', {
    help: 'path to rss.json',
    default: './parameters/rss.json'
})

let args = parser.parse_args()
let parameters = JSON.parse(readFileSync(args.conf_file, {encoding: 'utf-8'}))

const rss_handler = new RssHandler()

let flux: Map<string, RSS> = new Map<string, RSS>()

for (let f of parameters['flux']) {
    flux.set(f.name, new RSS(f.url, f.name, f.refreshTime))
}

for (let wh of parameters['webhooks']) {
    let webhook = new Webhook(wh.url);
    for (let fluxName of wh.flux) {
        if (!flux.has(fluxName))
            throw new Error(`Flux ${fluxName} doesn't exist`)
        
        rss_handler.pair(<RSS>flux.get(fluxName), webhook)
    }
}

//const rss = new RSS().onListen
//rss()
