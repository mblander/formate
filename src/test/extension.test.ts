//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as extension from '../extension';
import cssProperties from './cssProperties';



suite("findIndexOfFurthestColon", function () {
    test("correctPropertyGroup_succesfull", () => {
        // Arrange
        const properties = [
            '    color: #333;',
            '    display: block;',
            '    text-align: center;',
        ];

        // Act
        const result = extension.findIndexOfFurthestColon(properties);

        // Assert
        assert.equal(result, 14);
    });
    test("correctPropertyGroup_succesfull2", () => {
        // Arrange
        const properties = [
            " margin: 0;",
            " padding: 0;",
        ];

        // Act
        const result = extension.findIndexOfFurthestColon(properties);

        // Assert
        assert.equal(result, 8);
    });

    test("emptyPropertyGroup_false", () => {
        // Arrange
        const properties: string[] = [];

        // Act
        const result = extension.findIndexOfFurthestColon(properties);

        // Assert
        assert.equal(result, false);
    });
});

suite('isIgnoreLine', function () {
    test("withoutSpaces", () => {
        assert.equal(extension.isLineIgnoreLine('// formate-ignore'), true);
    });

    test("withPrefixSpaces", () => {
        assert.equal(extension.isLineIgnoreLine('    // formate-ignore;'), true);
    });

    test("withPreAndStufixSpaces", () => {
        assert.equal(extension.isLineIgnoreLine('    // formate-ignore      '), true);
    });
});

suite('insertExtraSpaces', function () {
    test("insertExtraSpaces_noSpaces_noExtraSpacesAdded", () => {
        // Arrange
        const property = 'text-align: center;';

        // Act
        const result = extension.insertExtraSpaces(property, 0, true);

        // Assert
        assert.equal((result.match(/\s/g) || []).length, 1);
    });

    test("insertExtraSpaces_fiveSpaces_fiveSpacesSpacesAdded", () => {
        // Arrange
        const property = 'text-align: center;';

        // Act
        const result = extension.insertExtraSpaces(property, 5, true);

        // Assert
        assert.equal((result.match(/\s/g) || []).length, 6);
    });

    test("insertExtraSpaces_fiveSpaces_fiveSpacesBeforeColonAdded", () => {
        // Arrange
        const property = 'text-align: center;';

        // Act
        const result = extension.insertExtraSpaces(property, 5, true);

        // Assert
        assert.equal(result.indexOf('    : ') >= 0, true);
    });


    test("insertExtraSpaces_fiveSpaces_fiveSpacesAfterColonAdded", () => {
        // Arrange
        const property = 'text-align: center;';

        // Act
        const result = extension.insertExtraSpaces(property, 5, false);

        // Assert
        assert.equal(result.indexOf(':     ') >= 0, true);
    });
});

suite('isProperty', function () {
    test("validProperties_true", () => {
        cssProperties.forEach(property => assert.equal(extension.isProperty(property), true, `property: "${property}" failed..`));
    });

    test("emptyLine_false", () => {
        assert.equal(extension.isProperty(''), false);
    });

    test("invalidSelector_a:hover,_false", () => {
        assert.equal(extension.isProperty('a:hover,'), false);
    });

    test("invalidSelector_a:hover{_false", () => {
        assert.equal(extension.isProperty('a:hover {'), false);
    });
});

suite('isCommentLine', function () {
    test("withoutSpaces", () => {
        assert.equal(extension.isLineCommentLine('// color: red;'), true);
    });

    test("withPrefixSpaces", () => {
        assert.equal(extension.isLineCommentLine('    // color: red;'), true);
    });

    test("withPreAndStufixSpaces", () => {
        assert.equal(extension.isLineCommentLine('    //        color: red;'), true);
    });
});

suite('verticalAlign', function () {
    test("normal align", () => {
        // arange
        const css = `.testclass{
            color: red; 
            background-color: green;
        }`;

        // act
        const actual = extension.verticalAlign(css, 0, true)

        // assert
        assert.equal(actual.includes('color           : red;'), true);
    });

    test("verticalAlign properties with additional spaces", () => {
        // arange
        const css = `.testclass{
            color: red; 
            background-color: green;
        }`;

        // act
        const actual = extension.verticalAlign(css, 5, true)

        // assert
        assert.equal(actual.includes('color                : red;'), true);
        assert.equal(actual.includes('background-color     : green;'), true);
    });

    test("verticalAlign properties with colon false", () => {
        // arange
        const css = `.testclass{
            color: red; 
            background-color: green;
        }`;

        // act
        const actual = extension.verticalAlign(css, 0, false)

        // assert
        assert.equal(actual.includes('color:            red;'), true);
        assert.equal(actual.includes('background-color: green;'), true);
    });

    test("verticalAlign properties with a line ignored", () => {
        // arange
        const css = `.testclass{
            // formate-ignore
            display: flex;
            color: red; 
            background-color: green;
        }`;

        // act
        const actual = extension.verticalAlign(css, 0, true)

        // assert
        assert.equal(actual.includes('display: flex;'), true);
        assert.equal(actual.includes('color           : red;'), true);
        assert.equal(actual.includes('background-color: green;'), true);
    });
});