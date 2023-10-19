import Parse from 'rss-parser'
import NodeCache from 'node-cache'

const FeedsCache = new NodeCache()
const PushFeed = new NodeCache()

export class RSS {

    private url: string
    private refreshTime?: number
    private eventName: string

    constructor(url: string, eventName: string, refreshTime?: number) {
        this.url = url
        this.eventName = eventName

        if (refreshTime == undefined) {
            this.refreshTime = 600000
        }
        else {
            this.refreshTime = refreshTime
        }

        parser(this.url, this.eventName)

    }

    public onListen(callback: Function) {
        parser(this.url, this.eventName)
        setInterval(() => {
            callback(parser(this.url, this.eventName))
        }, this.refreshTime)
    }
}


function parser(url: string, eventName: string) {
    type Feed = { foo: string }
    type Item = { bar: number }

    const parser: Parse<Feed, Item> = new Parse({
        customFields: {
            feed: ['foo'],
            item: ['bar']
        }
    });
    (async () => {
        const feed = await parser.parseURL(url)
        PushFeed.set(eventName, feedFilter(feed.items, FeedsCache.get(eventName)))
        FeedsCache.set(eventName, feed.items)
    })()

    return PushFeed.get(eventName)
}

function feedFilter (newArray: any, oldArray: any) {
    const output: any = []
    if (oldArray == undefined) {
        oldArray = []
    }
    for (const newItem of newArray) {
        const existItem = oldArray.some((oldItem: any) => oldItem.guid === newItem.guid)

        if(!existItem) {
            output.push(newItem)
        }
    }
    return output
}