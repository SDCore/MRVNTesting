const dotenv = require('dotenv');
const Database = require('better-sqlite3');

dotenv.config();

// Connect to the SQLite database
const db = new Database(`${__dirname}/../../databases/vcOwnerList.sqlite`);
const db2 = new Database(`${__dirname}/../../databases/memberDecay.sqlite`);

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}`);

		if (process.env.DEBUG == true) {
			// In dev environment, delete all rows to
			// avoid conflicts on bot restart
			// db.prepare('DELETE FROM vcOwnerList').run();
			// db2.prepare('DELETE FROM memberDecay1').run();
			// db2.prepare('DELETE FROM memberDecay2').run();
			// db2.prepare('DELETE FROM memberDecay3').run();
		}

		db.prepare('DELETE FROM vcOwnerList').run();
		db2.prepare('DELETE FROM memberDecay1').run();
		db2.prepare('DELETE FROM memberDecay2').run();
		db2.prepare('DELETE FROM memberDecay3').run();
	},
};
