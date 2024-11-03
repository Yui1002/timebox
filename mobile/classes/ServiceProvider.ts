import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ServiceProvider")
export class ServiceProvider {

    @JsonProperty("countryName", String)
    name: string = "";

}