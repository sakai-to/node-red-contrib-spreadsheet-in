module.exports = function(RED) {
	const util = require('util');

	function SheetNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg, send, done) {
			send = send || function() { node.send.apply(node, arguments); };
			var sheetNameType = config.sheetNameType || 'str';

			RED.util.evaluateNodeProperty(config.sheetName, sheetNameType, node, msg, function(err, value) {
				if (err) {
					if (done) { done(err); } else { node.error(err, msg); }
					return;
				}
				
				var sheetName = msg.sheetName || value || msg.selectSheetName;
				delete msg.selectSheetName;
				delete msg.sheetName; // delete if provided directly via msg.sheetName
				msg.payload = msg.payload.Sheets && msg.payload.Sheets[sheetName];
				msg.selectedSheetName = sheetName;
				send(msg);
				if (done) { done(); }
			});
		});
	}
	RED.nodes.registerType("sheet",SheetNode);
}
