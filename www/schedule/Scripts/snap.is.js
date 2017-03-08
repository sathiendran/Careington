var snap = snap || {};

/**
 * Use instead of typeof
 * typeof new Boolean(4) //Object
 * snap.is(new Boolean(4)).a(Boolean) //true
 * 
 * typeof null //Object
 * snap.is(null).an(Object) //false
 * 
 * typeof NaN //Number
 * snap.is(NaN).a(Number) //false
 * 
 * typeof [] //Object
 * snap.is([]).an(Array) //true
 * 
 * var months = ['January', 'February'];
 * var name = 'John'; 
 * 
 * snap.is(months).an(Array); //true
 * snap.is(name).an(Object); //false
 * snap.is(name).a(String); //true
 * var $div = $('div');
 * snap.is($div[0]).an(Element); //true
 */
 
snap.is = (function(o){
    
    var an = function(type) {
        return !!(
            (o !== undefined && o !== null && o === o && o.constructor === type && type) ||
            (type && toString.call(o).indexOf(type.name) > -1 && o instanceof type) ||
            (!type && type === o)
        );
    }
    
    return {
        a: an,
        an: an
    }
    
});
