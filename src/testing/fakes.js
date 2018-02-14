export function removeFake(stores, name) {
    delete stores.fakes[name];
}

export function flushFakes(stores) {
    stores.fakes = {};
}
