export default function (injector, name) {
    const type = injector.fakes[name] || injector.types[name];

    if (type) {
        return type.type;
    }
    return undefined;
}
