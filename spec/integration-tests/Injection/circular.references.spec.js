import {setup} from '../_setup';


let injector;
export default function () {
    it('guards against simple circular references', function () {
        injector = setup.reset_injector();
        setup.make_descriptor({name: 'circular1', type: function (circular2){}});
        setup.make_descriptor({name: 'circular2', type: function (circular1){}});

        return expect(() => injector.inject('circular1'))
            .toThrow('Circular Reference Detected: circular1 -> circular2 -> circular1');
    });

    it('guards against 2-deep circular references', function () {
        injector = setup.reset_injector();
        setup.make_descriptor({name: 'circular1', type: function (circular2){}});
        setup.make_descriptor({name: 'circular2', type: function (circular3){}});
        setup.make_descriptor({name: 'circular3', type: function (circular1){}});

        return expect(() => injector.inject('circular1'))
            .toThrow('Circular Reference Detected: circular1 -> circular2 -> circular3 -> circular1');
    });

    return it('guards against n-deep circular references', function () {
        let i;
        injector = setup.reset_injector();

        setup.make_descriptor({name: 'circular1', type: function (circular2){}});
        setup.make_descriptor({name: 'circular2', type: function (circular3){}});
        setup.make_descriptor({name: 'circular3', type: function (circular4){}});
        setup.make_descriptor({name: 'circular4', type: function (circular5){}});
        setup.make_descriptor({name: 'circular5', type: function (circular6){}});
        setup.make_descriptor({name: 'circular6', type: function (circular7){}});
        setup.make_descriptor({name: 'circular7', type: function (circular8){}});
        setup.make_descriptor({name: 'circular8', type: function (circular9){}});
        setup.make_descriptor({name: 'circular9', type: function (circular10){}});
        setup.make_descriptor({name: 'circular10', type: function (circular1){}});

        return expect(() => injector.inject('circular1'))
            .toThrow('Circular Reference Detected: circular1 -> circular2 -> circular3 -> circular4 -> circular5 -> circular6 -> circular7 -> circular8 -> circular9 -> circular10 -> circular1');
    });
};
