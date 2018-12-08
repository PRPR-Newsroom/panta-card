"use strict";

/**
 * Serializes/Deserializes the entities using a JSON representation
 */
class JsonSerialization {

    serialize(obj) {
        if (obj == null) {
            return null;
        }
        let serialized = {};
        let properties = this.getAllProperties(obj);
        for (let index in properties) {
            let property = properties[index];
            // check if object
            let proptype = typeof obj[property];
            if (proptype === 'object') {
                serialized[this.normalize(property)] = this.serialize(obj[property]);
            } else {
                serialized[this.normalize(property)] = obj[property];
            }
        }
        return JSON.stringify(serialized);
    }

    deserialize(jsonObj, type) {
        return Artikel.create(jsonObj);
    }

    static normalize(name) {
        if (name.toString().startsWith("_")) {
            return name.toString().substr(1);
        } else {
            return name.toString();
        }
    }

    static denomalize(propertyName) {
        return "_" + propertyName;
    }

    static getProperty(json, propertyName) {
        if (json) {
            return json[JsonSerialization.denomalize(propertyName)];
        } else {
            return null;
        }
    }

    getAllProperties(obj) {
        return Object.getOwnPropertyNames(obj);
    }
}