import { Manager, Player } from ".."


export async function request(url: string, options: any): Promise<any> {
    const request = await fetch(url, options).then(res => res.json())
    return request
}

export async function wait(time: number): Promise<void> {
    setTimeout(() => {
        return
    }, time * 1000)
}

export const sources = {
    youtube: "ytsearch",
    soundcloud: "scsearch",
    youtubemusic: "ytmsearch",
    local: "local",
}