const lifetimes = ['singleton', 'transient', 'root', 'parent', 'state'];

export default function (lifetime) {
    if (!~lifetimes.indexOf(lifetime)) {
        throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent';
    }
}
