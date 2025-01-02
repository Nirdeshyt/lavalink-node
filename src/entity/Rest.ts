import { RestRequest, SearchResult, version } from "../..";
import { Manager, Player, Node, request, sources } from "../..";
import { WebSocket } from "ws";


export class Rest {
    public manager: Manager;
    public node: Node;
    public ws: WebSocket | undefined;
    constructor (manager: Manager, node: Node){
      this.manager = manager
      this.node = node
    }
  public async update(data: RestRequest): Promise<any> {
    const response = await request(
      `http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/v4/sessions/${this.node.sessionId}/players/${data.guildId}?noReplace=true`,
      {
        method: "PATCH",
        body: JSON.stringify(data.data) as any,
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.node.password
        }
      }
    )
    return response
  }
  public async loadTracks(query: string, source: string): Promise<SearchResult> {
    return new Promise(async (resolve, reject) => {
      let identifier;
      if(query.startsWith("http://") || query.startsWith("https://")){
        identifier = query
      } else {
        identifier = `${sources[source as keyof typeof sources] ?? source}:${query}`
      }
      const response = await request(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/v4/loadtracks?identifier=${identifier}`, { headers: {
        Authorization: this.node.password,
      } })
      const data = new SearchResult(response)
      resolve(data)
    })
  }
  public async destroy(guildId: string): Promise<void> {
    await request(`http${this.node.secure ? "s" : ""}://${this.node.host}:${this.node.port}/v4/sessions/${this.node.sessionId}/players/${guildId}`, {
      method: "DELETE",
      headers: {
        "Authorization": this.node.password
      }
    })
  }
}