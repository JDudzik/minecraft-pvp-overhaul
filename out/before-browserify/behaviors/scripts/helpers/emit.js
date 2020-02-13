const system = server.registerSystem(0, 0);


/**
* Simplifies broadcasting events
* @param {string} identifier   The event identifier in the format 'namespace:name'
* @param {Object} properties   The event properties
* @returns {(boolean|null)}    Returns 'true' if event broadcast was successful or 'null' when event broadcast failed
*/

const emit = function(identifier, properties) {
	const data = system.createEventData(identifier);
	data.data = Object.assign({}, data.data, properties);

	return system.broadcastEvent(identifier, data);
}


export default emit;
