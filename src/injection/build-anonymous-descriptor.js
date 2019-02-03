import {getDependencyNames}   from '../util';
/**
 * @description When inject is called with an anonymous function, build a descriptor to add it to the container
 * @param {Array|Function} name: When array, last element is function, rest are function's parameters
 */
export default function (name) { // for when inject is called with an anonymous function
    if (typeof name === 'function') {
        return {
            type: name,
            dependencies: getDependencyNames(name)
        };
    }
    return {
        type: name[name.length - 1],
        dependencies: name.slice(0, name.length - 1)
    };
}
