module.exports = function(RED) {
	const XLSX = require('xlsx');

	function CellNode(config) {
		RED.nodes.createNode(this,config);
		var node = this;
		node.on('input', function(msg) {
			var address = config.address || msg.selectAddress;
			delete msg.selectAddress;
			if (!address) {
				return node.error(RED._("cell.errors.no-address"));
			} else if (!/[A-Z]+[1-9][0-9]*/.test(address)) {
				return node.error(RED._("cell.errors.invalid-address") + ": " + address);
			}

			var cell = msg.payload && msg.payload[address];
			msg.payload = cell && config.dataType
				? cell[config.dataType]
				: cell;
			msg.selectedAddress = address;
			node.send(msg);
		});
	}
	RED.nodes.registerType("cell",CellNode);
}
