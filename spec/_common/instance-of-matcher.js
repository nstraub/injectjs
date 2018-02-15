export default function () {
    jasmine.addMatchers({
        toBeInstanceOf() {
            return {
                compare(actual, expected) {
                    let result = undefined;
                    result =
                        {pass: actual instanceof expected};
                    if (result.pass) {
                        result.message = `Expected ${actual} not to be an instance of ${expected}`;
                    } else {
                        result.message = `Expected ${actual} to be an instance of ${expected}`;
                    }
                    return result;
                }
            };
        }
    });
}
