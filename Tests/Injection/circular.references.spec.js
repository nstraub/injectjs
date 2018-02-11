import injector from '../instantiate.injector';
import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';


export default function () {
    it('guards against simple circular references', function () {
        setup.reset_injector();
        setup.make_descriptor({name: 'circular1', dependencies: ['circular2']});
        setup.make_descriptor({name: 'circular2', dependencies: ['circular1']});

        return expect(() => injector.inject('circular1')).toThrow('Circular Reference Detected: circular1 -> circular2 -> circular1');
    });

    it('guards against 2-deep circular references', function () {
        setup.reset_injector();
        setup.make_descriptor({name: 'circular1', dependencies: ['circular2']});
        setup.make_descriptor({name: 'circular2', dependencies: ['circular3']});
        setup.make_descriptor({name: 'circular3', dependencies: ['circular1']});

        return expect(() => injector.inject('circular1')).toThrow('Circular Reference Detected: circular1 -> circular2 -> circular3 -> circular1');
    });

    return it('guards against n-deep circular references', function () {
        let i;
        setup.reset_injector();
        for (i = 0; i < 10; i++) {
            setup.make_descriptor({name: `circular${i}`, dependencies: [`circular${i + 1}`]});
        }
        setup.make_descriptor({name: `circular${i}`, dependencies: ['circular1']});

        return expect(() => injector.inject('circular1')).toThrow('Circular Reference Detected: circular1 -> circular2 -> circular3 -> circular4 -> circular5 -> circular6 -> circular7 -> circular8 -> circular9 -> circular10 -> circular1');
    });
};
