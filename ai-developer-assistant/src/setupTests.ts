import '@testing-library/jest-dom';

// Mock implementation of FileList
function createFileList(files: File[]): FileList {
  const fileList: File[] & Partial<FileList> = [...files];

  Object.defineProperty(fileList, 'item', {
    value: (index: number): File | null => files[index] || null,
    enumerable: false,
  });

  Object.defineProperty(fileList, Symbol.iterator, {
    value: files[Symbol.iterator].bind(files),
    enumerable: false,
  });

  return fileList as FileList;
}

// Mock implementation of DataTransfer
class MockDataTransfer implements DataTransfer {
  files: FileList = createFileList([]);
  items: DataTransferItemList;
  data: Record<string, string> = {};
  types: string[] = [];
  dropEffect: 'none' | 'copy' | 'link' | 'move' = 'none';
  effectAllowed: 'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized' =
    'uninitialized';

  private _items: DataTransferItem[] = [];

  constructor() {
    this.items = {
      length: this._items.length,
      add: (data: string | File, type?: string): DataTransferItem | null => {
        const item: DataTransferItem = {
          kind: typeof data === 'string' ? 'string' : 'file',
          type: type || (data as File).type || '',
          getAsFile: () => (typeof data === 'string' ? null : (data as File)),
          getAsString: (callback: (data: string) => void) => {
            if (typeof data === 'string') {
              callback(data);
            }
          },
          webkitGetAsEntry: () => null, // Add mock implementation
        };
        this._items.push(item);
        return item;
      },
      remove: (index: number) => {
        this._items.splice(index, 1);
      },
      clear: () => {
        this._items = [];
      },
      [Symbol.iterator]: () => this._items[Symbol.iterator](),
    };
  }

  setFiles(files: File[]) {
    this.files = createFileList(files);
    this.types = files.map((file) => file.type);
    this._items = files.map((file) => ({
      kind: 'file',
      type: file.type,
      getAsFile: () => file,
      getAsString: () => null,
      webkitGetAsEntry: () => null, // Add mock implementation
    }));
  }

  setDragImage(_image: Element, _x: number, _y: number): void {}

  getData(format: string): string {
    return this.data[format] || '';
  }

  setData(format: string, data: string): void {
    this.data[format] = data;
    if (!this.types.includes(format)) {
      this.types.push(format);
    }
  }

  clearData(format?: string): void {
    if (format) {
      delete this.data[format];
      this.types = this.types.filter((type) => type !== format);
    } else {
      this.data = {};
      this.types = [];
    }
  }
}

// Mock DataTransfer globally
Object.defineProperty(global, 'DataTransfer', {
  value: MockDataTransfer,
  writable: true,
  configurable: true,
});
