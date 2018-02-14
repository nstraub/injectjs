import injector from '../instantiate.injector';
export default  function() {
    beforeEach(function() {
        this.fake_type = function() {};
        return injector.fakes = {
            test_fake: {
                type: this.fake_type,
                lifetime: 'singleton'
            },
            test_fake_two: {
                type() {},
                lifetime: 'transient'
            }
        };
    });

    return it('removes requested fake', function() {
        injector.removeFake('test_fake_two');

        return expect(injector.fakes).toEqual({test_fake: {
            type: this.fake_type,
            lifetime: 'singleton'
        }
        });
    });
};

