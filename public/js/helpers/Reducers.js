
class Reducers {

    static asKeyValue(prev, cur) {
        Object.entries(cur).forEach(it => {
            prev[JsonSerialization.denomalize(it[0])] = it[1];
        });
        return prev;
    }

}
