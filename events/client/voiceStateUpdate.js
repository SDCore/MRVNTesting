const Database = require('better-sqlite3');

// Connect to the SQLite database
const db = new Database(`${__dirname}/../../databases/vcOwnerList.sqlite`);

var categoryList = ['542557896731394060', '762813514154639360', '762813602901000202', '820067698318770216', '839645354429513728', '542564750706475008', '543046676491927567'];

module.exports = {
	name: 'voiceStateUpdate',
	once: false,
	execute(oldState, newState) {
		const guild = newState.guild;
		const voiceChannel = newState.channel;
		const member = newState.member;
		const previousChannel = oldState.channel;
		const newChannel = newState.channel;
		const memberId = newState.member.id;

		// Check if the user joined an empty voice channel
		if (voiceChannel && voiceChannel.members.size === 1) {
			// if voiceChannel category is not in categoryList, return
			if (!categoryList.includes(voiceChannel.parent.id)) return;

			console.log(`User ${newState.member.user.tag} joined empty VC ${voiceChannel.name}`);

			// Check if id already exists in db
			const selectQuery = 'SELECT id FROM vcOwnerList WHERE id = ?';
			const selectResult = db.prepare(selectQuery).get(memberId);

			// If id exists delete it
			if (selectResult) {
				const deleteQuery = 'DELETE FROM vcOwnerList WHERE id = ?';
				db.prepare(deleteQuery).run(memberId);
			}

			// Insert the row into the 'vcOwnerList' table
			const insertQuery = 'INSERT INTO vcOwnerList (id) VALUES (?)';
			db.prepare(insertQuery).run(memberId);

			const channelId = '1117695511147851776';
			const channel = guild.channels.cache.get(channelId);
			channel.send(`<@${member.user.id}> joined an empty voice channel <#${voiceChannel.id}> and is the owner.`);
		}
		// Check if a member left a voice channel
		if (previousChannel && !newChannel) {
			// if voiceChannel category is not in categoryList, return
			if (!categoryList.includes(previousChannel.parent.id)) return;

			// Check if id already exists in db
			const selectQuery = 'SELECT id FROM vcOwnerList WHERE id = ?';
			const selectResult = db.prepare(selectQuery).get(memberId);

			console.log(`Member ${member.user.tag} left voice channel ${previousChannel.name}`);

			// If id exists delete it
			if (selectResult) {
				const deleteQuery = 'DELETE FROM vcOwnerList WHERE id = ?';
				db.prepare(deleteQuery).run(memberId);

				const channelId = '1117695511147851776';
				const channel = guild.channels.cache.get(channelId);
				channel.send(`<@${member.user.id}> was removed as owner of <#${previousChannel.id}> as they left the channel.`);
			}

			// const deleteQuery = 'DELETE FROM vcOwnerList WHERE id = ?';
			// db.prepare(deleteQuery).run(memberId);

			// set the user limit of the voice channel back to 3
			// previousChannel.setUserLimit(3);
		}

		// Check if a member moved to a different voice channel
		if (previousChannel && newChannel && previousChannel.id !== newChannel.id) {
			console.log(`Member ${member.user.tag} moved from ${previousChannel.name} to ${newChannel.name}`);
			const deleteQuery = 'DELETE FROM vcOwnerList WHERE id = ?';
			db.prepare(deleteQuery).run(memberId);

			// set the user limit of the previous channel to 3 (just in case)
			// previousChannel.setUserLimit(3);

			// Check if a member moved to an empty voice channel
			if (newChannel && newChannel.members.size === 1) {
				console.log(`User ${newState.member.user.tag} moved to an empty VC ${newChannel.name}`);

				// Insert the row into the 'vcOwnerList' table
				const insertQuery = 'INSERT INTO vcOwnerList (id) VALUES (?)';
				db.prepare(insertQuery).run(memberId);
			}
		}
	},
};
