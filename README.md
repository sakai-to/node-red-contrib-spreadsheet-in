# node-red-contrib-spreadsheet

Enhanced Node-RED nodes to read data from spreadsheet (Excel, ODS, etc.) files with dynamic sheet name selection via `msg.sheetName`.

This is a continuation of the original `node-red-contrib-spreadsheet-in` package with additional features and improvements.

[![Run tests](https://github.com/lordnetro/node-red-contrib-spreadsheet/actions/workflows/tests.yml/badge.svg)](https://github.com/lordnetro/node-red-contrib-spreadsheet/actions/workflows/tests.yml)

## Features

- Read data from Excel, ODS, and other spreadsheet formats
- **Dynamic sheet selection**: Use `msg.sheetName` to select sheets dynamically at runtime
- Improved logging for better debugging
- Support for multiple sheet selection methods

## Usage

See the following screenshot:

![example flow](https://raw.githubusercontent.com/lordnetro/node-red-contrib-spreadsheet/master/examples/example.png "Example flow")

You can also import the example flow from `examples/example.json` to your Node-RED.

### Dynamic Sheet Selection

The `sheet` node now supports dynamic sheet name selection through `msg.sheetName`:

```javascript
msg.sheetName = "Sheet2"; // Select sheet by name
return msg;
```

This allows you to change which sheet to read at runtime based on your flow logic.
