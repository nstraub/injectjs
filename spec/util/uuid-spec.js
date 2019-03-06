import uuid from '../../src/util/uuid';


export default function () {
    describe('reset Method', function () {
        it('should reset internal counter to 0', function () {
            uuid.getNext();
            uuid.getNext();
            uuid.getNext();
            uuid.reset();
            expect(uuid.getNext()).toEqual(1);
        });
    });
}
