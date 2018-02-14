import uuid from '../../src/util/uuid';


export default function () {
    describe('getNext Method', function () {
        it('should return numbers sequentially starting from 1', function () {
            expect(uuid.getNext()).toEqual(1);
            expect(uuid.getNext()).toEqual(2);
            expect(uuid.getNext()).toEqual(3);
        });
    });

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
