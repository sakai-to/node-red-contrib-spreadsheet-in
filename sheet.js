module.exports = function(RED) {
	const util = require('util');

	function SheetNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {
			var selectSheetName=config.sheetName;
			if(msg.selectSheetName)
			{
				selectSheetName=msg.selectSheetName;
				delete msg.selectSheetName;
			}
			selectSheetName=msg.selectSheetName;
			msg.payload = msg.payload.Sheets && msg.payload.Sheets[config.sheetName];
			msg.selectedSheetName = selectSheetName;	
			node.send(msg);
		});
	}
	RED.nodes.registerType("sheet",SheetNode);
}
