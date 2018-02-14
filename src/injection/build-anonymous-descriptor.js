import {getDependencyNames}   from 'util';

export default function (name) { // for when inject is called with an anonymous function
    if (typeof name === 'function') {
        return {
            type: name,
            dependencies: getDependencyNames(name)
        };
    } else {
        return {
            type: name[name.length-1],
            dependencies: name.slice(0, name.length-1)
        };
    }
}
