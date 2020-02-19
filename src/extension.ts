// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import jsbeautify = require('js-beautify');

export function format(document: vscode.TextDocument, range: vscode.Range | null, defaultOptions: vscode.FormattingOptions) {
    const settings = vscode.workspace.getConfiguration('formate');
    const enable = settings.get('enable', true);

    if (!enable) return;

    const verticalAlignProperties = settings.get('verticalAlignProperties', true);

    // Set range if the range isn't set.
    if (range === null) {
        range = initRange(document);
    }

    const result: vscode.TextEdit[] = [];
    const content = document.getText(range);
    console.log('TCL: format -> content', content)

    if (!defaultOptions) {
        defaultOptions = {
            insertSpaces: true,
            tabSize: 4,
            newline_between_rules: true,
        };
    }

    const beutifyOptions: CSSBeautifyOptions = {
        indent_char: defaultOptions.insertSpaces ? ' ' : '\t',
        indent_size: defaultOptions.insertSpaces ? defaultOptions.tabSize : 1,
        newline_between_rules: defaultOptions.newline_between_rules ? <boolean>defaultOptions.newline_between_rules : true,
    };

    let formatted = jsbeautify.css_beautify(content, beutifyOptions);

    if (verticalAlignProperties) {
        const additionalSpaces = settings.get('additionalSpaces', 0);
        formatted = verticalAlign(formatted, additionalSpaces);
    }

    if (formatted) {
        result.push(new vscode.TextEdit(range, formatted));
    }

    return result;
}


/**
 * Creates a new range from begin to end of the document
 *
 * @param {vscode.TextDocument} document
 * @returns {vscode.Range}
 */
function initRange(document: vscode.TextDocument): vscode.Range {
    const lastLine = document.lineCount - 1;
    const start = new vscode.Position(0, 0);
    const end = new vscode.Position(lastLine, document.lineAt(lastLine).text.length);

    return new vscode.Range(start, end);
}

/**
 * Checks to see if the current line matches a css property.
 *
 * @export
 * @param {string} line
 * @returns {boolean}
 */
export function isProperty(line: string): boolean {
    const isPropertyRegex = new RegExp(/(([A-z]-*)*\s*:\s*).*;?[^,|{]$/);
    /*
    (
    ([A-z]-*)   Matches any characters between a-z or A-Z and zero or more -
    \s*         Optional space
    :           Matches colon
    \s*         Optional space
    )
    .*          zero or more character
    ;?          Optional end with ;
    [^,|{]$     Not end with comma or {
    */

    return isPropertyRegex.test(line);
}


/**
 * Runs the property alignment.
 *
 * @export
 * @param {string} css
 * @returns {string}
 */
export function verticalAlign(css: string, additionalSpaces: number = 0): string {
    const cssLines = css.split('\n');
    let firstProperty: number = -1;
    let lastProperty: number = -1;

    cssLines.forEach((line: string, lineNumberIndex: number) => {
        line = line.trim();

        // Set the start of the property group
        if (isProperty(line) && firstProperty === -1) {
            firstProperty = lineNumberIndex;
        }
        // Last property group line.
        if ((!isProperty(line) && firstProperty >= 0) || cssLines.length - 1 === lineNumberIndex) {
            lastProperty = lineNumberIndex;
        }

        // Format the selected group
        if (firstProperty !== -1 && lastProperty !== -1) {
            const properyGroup = cssLines.slice(firstProperty, lastProperty);
            const furthestColon = findIndexOfFurthestColon(properyGroup) + additionalSpaces;

            // Format the group
            while (firstProperty <= lastProperty) {
                const colonIndex = cssLines[firstProperty].indexOf(':');

                if (colonIndex < furthestColon) {
                    let diff = furthestColon - colonIndex;
                    cssLines[firstProperty] = insertExtraSpaces(cssLines[firstProperty], diff);
                }

                firstProperty++;
            }

            // Prepare for the next loop.
            firstProperty = -1;
            lastProperty = -1;
        }

    });

    return cssLines.join('\n');
}


/**
 * Replaces a colon : with needed spaces AND colon. example: "     : "
 *
 * @param {string} cssLine Line to do the replace in.
 * @param {number} numberOfSpaces Number of spaces to add.
 * @returns {string} cssLine with added spaces.
 */
export function insertExtraSpaces(cssLine: string, numberOfSpaces: number): string {
    return cssLine.replace(':', ' '.repeat(numberOfSpaces) + ':');
}

/**
 * Find the property where the : is the furthest 
 * @param properties 
 */
export function findIndexOfFurthestColon(properties: string[]): number {
    if (!properties || properties.length === 0) return 0;

    return Math.max.apply(null, properties.map(p => p.indexOf(':')));
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const provideDocumentFormattingEdits = <vscode.DocumentFormattingEditProvider>{
        provideDocumentFormattingEdits: (document: vscode.TextDocument, options: vscode.FormattingOptions) => format(document, null, options)
    };
    const provideDocumentRangeFormattingEdits = <vscode.DocumentRangeFormattingEditProvider>{
        provideDocumentRangeFormattingEdits: (document: vscode.TextDocument, ranges: vscode.Range, options: vscode.FormattingOptions) => format(document, ranges, options)
    };

    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('css', provideDocumentFormattingEdits));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('less', provideDocumentFormattingEdits));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('scss', provideDocumentFormattingEdits));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('sass', provideDocumentFormattingEdits));

    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('css', provideDocumentRangeFormattingEdits));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('less', provideDocumentRangeFormattingEdits));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('scss', provideDocumentRangeFormattingEdits));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider('sass', provideDocumentRangeFormattingEdits));
}

// this method is called when your extension is deactivated
export function deactivate() { }
