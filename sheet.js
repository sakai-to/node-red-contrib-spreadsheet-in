module.exports = function(RED) {
	const util = require('util');

	function SheetNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {
			var sheetName = config.sheetName || msg.selectSheetName;
			delete msg.selectSheetName;
			msg.payload = msg.payload.Sheets && msg.payload.Sheets[sheetName];
			msg.selectedSheetName = sheetName;
			node.send(msg);
		});
	}
	RED.nodes.registerType("sheet",SheetNode);
}
