import getDependencyNames from '../../src/util/get-dependency-names';


function createTest(fn) {
    return function () {
        expect(getDependencyNames(fn)).toEqual(resultingArgs);
    };
}

const resultingArgs = ['a', 'b', 'c', 'd'];
export default function () {
    it('should get arguments out of anonymous function without whitespace', createTest('function(a,b,c,d){}'));
    it('should get arguments out of anonymous function without extraneous whitespace', createTest('function (a, b, c, d){}'));
    it('should get arguments out of anonymous function with 3 spaces between `function` and parentheses', createTest('function   (a,b,c,d){}'));

    it('should get arguments out of anonymous function with 1 spaces between opening parenthesis and first parameter', createTest('function( a,b,c,d){}'));
    it('should get arguments out of anonymous function with 2 spaces between opening parenthesis and first parameter', createTest('function(  a,b,c,d){}'));
    it('should get arguments out of anonymous function with 3 spaces between opening parenthesis and first parameter', createTest('function(   a,b,c,d){}'));

    it('should get arguments out of anonymous function with 1 spaces between first and second parameters', createTest('function(a, b,c,d){}'));
    it('should get arguments out of anonymous function with 2 spaces between first and second parameters', createTest('function(a,  b,c,d){}'));
    it('should get arguments out of anonymous function with 3 spaces between first and second parameters', createTest('function(a,   b,c,d){}'));

    it('should get arguments out of anonymous function with 1 spaces between last parameter and closing parenthesis', createTest('function(a,b,c,d ){}'));
    it('should get arguments out of anonymous function with 2 spaces between last parameter and closing parenthesis', createTest('function(a,b,c,d  ){}'));
    it('should get arguments out of anonymous function with 3 spaces between last parameter and closing parenthesis', createTest('function(a,b,c,d   ){}'));

    it('should get arguments out of named function without whitespace', createTest('function named(a,b,c,d){}'));
    it('should get arguments out of named function without extraneous whitespace', createTest('function named(a, b, c, d){}'));

    it('should get arguments out of named function with 3 spaces between `function` and name', createTest('function   named(a,b,c,d){}'));
    it('should get arguments out of named function with 3 spaces between name and parentheses', createTest('function named   (a,b,c,d){}'));

    it('should get arguments out of named function with 1 spaces between opening parenthesis and first parameter', createTest('function named( a,b,c,d){}'));
    it('should get arguments out of named function with 2 spaces between opening parenthesis and first parameter', createTest('function named(  a,b,c,d){}'));
    it('should get arguments out of named function with 3 spaces between opening parenthesis and first parameter', createTest('function named(   a,b,c,d){}'));

    it('should get arguments out of named function with 1 spaces between first and second parameters', createTest('function named(a, b,c,d){}'));
    it('should get arguments out of named function with 2 spaces between first and second parameters', createTest('function named(a,  b,c,d){}'));
    it('should get arguments out of named function with 3 spaces between first and second parameters', createTest('function named(a,   b,c,d){}'));

    it('should get arguments out of named function with 1 spaces between last parameter and closing parenthesis', createTest('function named(a,b,c,d ){}'));
    it('should get arguments out of named function with 2 spaces between last parameter and closing parenthesis', createTest('function named(a,b,c,d  ){}'));
    it('should get arguments out of named function with 3 spaces between last parameter and closing parenthesis', createTest('function named(a,b,c,d   ){}'));

    it('should return undefined if function has no parameters', function () {
        expect(getDependencyNames('function(){}')).toBeUndefined();
    });
}
