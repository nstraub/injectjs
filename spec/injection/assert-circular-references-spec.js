import {assertCircularReferences} from '../../src/injection';


export default function () {
    it('should fail on a circular reference 1-level deep', function () {
        let spec = {
                parent: {descriptor: {name: 'level1'}},
                descriptor: {name: 'level2'}
            },
            dependencies = ['level1'];
        expect(() => assertCircularReferences(spec, dependencies, [])).toThrow('Circular Reference Detected: level1 -> level2 -> level1');

    });

    it('should fail on a circular reference 10-levels deep', function () {
        let spec = {
                parent: {descriptor: {name: 'level1'}},
                descriptor: {name: 'level2'}
            },
            dependencies = ['level1'];

        for(let i = 3; i < 11; i++) {
            spec = {
                parent: spec,
                descriptor: {name: `level${i}`}
            };
        }
        expect(() => assertCircularReferences(spec, dependencies, [])).toThrow('Circular Reference Detected: level1 -> level2 -> level3 -> level4 -> level5 -> level6 -> level7 -> level8 -> level9 -> level10 -> level1');

    });
}
