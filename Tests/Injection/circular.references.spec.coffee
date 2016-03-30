circular_reference_spec = () ->
    it 'guards against simple circular references', () ->
        setup.reset_injector()
        setup.make_descriptor(name: 'circular1', dependencies: ['circular2'])
        setup.make_descriptor(name: 'circular2', dependencies: ['circular1'])

        expect(() -> injector.inject('circular1')).toThrow 'Circular Reference Detected: circular1 -> circular2 -> circular1'

    it 'guards against 2-deep circular references', () ->
        setup.reset_injector()
        setup.make_descriptor(name: 'circular1', dependencies: ['circular2'])
        setup.make_descriptor(name: 'circular2', dependencies: ['circular3'])
        setup.make_descriptor(name: 'circular3', dependencies: ['circular1'])

        expect(() -> injector.inject('circular1')).toThrow 'Circular Reference Detected: circular1 -> circular2 -> circular3 -> circular1'

    it 'guards against n-deep circular references', () ->
        setup.reset_injector()
        for i in [0...10]
            setup.make_descriptor(name: 'circular' + i, dependencies: ['circular' + (i+1)])
        setup.make_descriptor(name: 'circular' + (i), dependencies: ['circular1'])

        expect(() -> injector.inject('circular1')).toThrow 'Circular Reference Detected: circular1 -> circular2 -> circular3 -> circular4 -> circular5 -> circular6 -> circular7 -> circular8 -> circular9 -> circular10 -> circular1'
