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

    deserialize(raw, type) {
        let that = this;
        let properties = this.getAllProperties(type);
        console.log(raw);
        JSON.parse(raw, function(key, value) {
            let propertyName = that.denomalize(key);
            if (properties.indexOf(propertyName)!=-1) {
                type[key] = value;
            }
        })
    }

    normalize(name) {
        return name.toString().substr(1);
    }

    denomalize(propertyName) {
        return "_" + propertyName;
    }

    getAllProperties(obj) {
        return Object.getOwnPropertyNames(obj);
    }
}