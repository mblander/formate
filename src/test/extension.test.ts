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
    test("commentLineWithoutSpaces", () => {
        assert.equal(extension.isCommentLine('// color: red;'), true);
    });

    test("commentLineWithPrefixSpaces", () => {
        assert.equal(extension.isCommentLine('    // color: red;'), true);
    });

    test("commentLineWithPreAndStufixSpaces", () => {
        assert.equal(extension.isCommentLine('    //        color: red;'), true);
    });


});