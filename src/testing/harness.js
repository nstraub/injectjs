export default function (injector, func) {
    return function (adhoc_dependencies) {
        return injector.inject(func)(adhoc_dependencies);
    };
}
