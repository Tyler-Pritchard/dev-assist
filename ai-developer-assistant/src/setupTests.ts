// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

class MockDataTransfer {
    files = [];
    items = [];
    setFiles(files) {
        this.files = files;
        this.items = files.map(file => ({
            kind: 'file',
            type: file.type,
            getAsFile: () => file,
        }));
    }
}
global.DataTransfer = MockDataTransfer;
