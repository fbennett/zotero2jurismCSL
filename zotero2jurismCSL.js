var jurism2cslMap = require('./jurism2cslMap')

// Encoding of names set single-field names as "name" in encoded data
// at some point. This recovers from that glitch.
function convertName(obj, fieldMode) {
    var ret = {};
    if (obj.fieldMode || obj.name || fieldMode) {
        ret.literal = obj.lastName ? obj.lastName : obj.name;
    } else {
        ret.given = obj.firstName;
        ret.family = obj.lastName;
    }
    return ret;
}


function convert(obj) {
    var extradata = null;
    var zObj = obj.pristineData;
    var cObj = obj.cslItem();
    cObj.multi = {
        main: {},
        _keys: {}
    }
    if (cObj.note) {
        var m = cObj.note.match(/mlzsync1:([0-9][0-9][0-9][0-9])(.*)/);
        if (m) {
            offset = parseInt(m[1], 10);
            extradata = JSON.parse(m[2].slice(0, offset))
            cObj.note = cObj.note.slice((offset+13));
        }
    }
    if (extradata) {
        if (extradata.extracreators) {
            for (var j=0,jlen=extradata.extracreators.length;j<jlen;j++) {
                var zCreator = extradata.extracreators[j];
                zObj.creators.push(zCreator);
                var cslVarname = jurism2cslMap.fields[cObj.type][zCreator.creatorType];
                cCreator = convertName(zCreator, zCreator.fieldMode);
                if (!cObj[cslVarname]) {
                    cObj[cslVarname] = [];
                }
                cObj[cslVarname].push(cCreator);
            }
        }
    }
    if (extradata) {
        creatorMap = {};
        creatorCounts = {};
        for (var j=0,jlen=zObj.creators.length;j<jlen;j++) {
            if (zObj.creators[j].creatorType === 'author') {
                var cslVarname = 'author';
            } else {
                var cslVarname = jurism2cslMap.fields[cObj.type][zObj.creators[j].creatorType];
            }
            if (!creatorCounts[cslVarname]) {
                creatorCounts[cslVarname] = 0;
            }
            creatorMap[j] = {
                cslVarname: cslVarname,
                cslPos: creatorCounts[cslVarname]
            }
            creatorCounts[cslVarname]++;
        }
        // FIX-UPS
        if (extradata.xtype) {
            cObj.type = extradata.xtype;
            delete extradata.xtype;
            delete extradata.type;
        }
        if (extradata.extrafields) {
            for (var key in extradata.extrafields) {
                cObj[jurism2cslMap[cObj.type][key]] = extradata.extrafields[key];
                delete extradata.extrafields[key];
            }
        }
        if (extradata.multifields) {
            for (zFieldName in extradata.multifields.main) {
                cFieldName = jurism2cslMap.fields[cObj.type][zFieldName];
                cObj.multi.main[cFieldName] = extradata.multifields.main[zFieldName];
            }
            for (zFieldName in extradata.multifields._keys) {
                cFieldName = jurism2cslMap.fields[cObj.type][zFieldName];
                cObj.multi._keys[cFieldName] = extradata.multifields._keys[zFieldName];
            }
        }
        if (extradata.multicreators) {
            for (var pos in extradata.multicreators) {
                var creatorData = extradata.multicreators[pos];
                for (var lang in creatorData._key) {
                    creatorData._key[lang] = convertName(creatorData._key[lang], creatorData.fieldMode);
                }
                delete creatorData.fieldMode;
                cObj[creatorMap[pos].cslVarname][creatorMap[pos].cslPos].multi = creatorData;
                
                delete extradata.multicreators[pos]
            }
        }
    }
    return cObj;
}

module.exports = {
    convert: convert
}
