/**
 * Created by Damien on 8/19/2016.
 */
export interface Serializer<T>{
    serialize(key:string, value:any):any;
    deserialize(inVal:string):T;
}