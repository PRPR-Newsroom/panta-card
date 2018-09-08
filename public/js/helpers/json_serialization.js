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
        //
        // let that = this;
        // let properties = this.getAllProperties(type);
        // let json = raw + "";
        // console.log(json);
        // let parsed = JSON.parse(json, function(key, value) {
        //     let propertyName = that.denomalize(key);
        //     if (properties.indexOf(propertyName) !== -1) {
        //         // when the property exists on the target
        //         let sample = type.getSampleOf(key);
        //         if (sample === null) {
        //             return value;
        //         } else {
        //             return that.deserialize.call(that, value, sample);
        //         }
        //     } else {
        //         console.log("invalid property: " + propertyName);
        //         return value;
        //     }
        // });
        // console.log("Parsed: " + parsed);
        // return parsed;
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
        return json[JsonSerialization.denomalize(propertyName)];
    }

    getAllProperties(obj) {
        return Object.getOwnPropertyNames(obj);
    }
}