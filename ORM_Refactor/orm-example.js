/* You'll need to
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */

var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "");
/* TODO this constructor takes the database name, username, then password.
 * Modify the arguments if you need to */

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = sequelize.define('User', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  user_name: Sequelize.STRING
});

var Room = sequelize.define('Room', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING
});

var Message = sequelize.define('Message', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  message: Sequelize.STRING
});

Message.belongsTo(User);
Message.belongsTo(Room);
User.hasMany(User, {as: 'Friends'});
User.hasMany(User, {as: 'Blocked'});


/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */
User.sync().success(function() {
  /* This callback function is called once sync succeeds. */
  console.log("created User table");
  // now instantiate an object and save it:
  // var newUser = User.build({user_name: "Jean Valjean"});
  // newUser.save().success(function() {

  //   /* This callback function is called once saving succeeds. */

  //   // Retrieve objects from the database:
  //   User.findAll({ where: {user_name: "Jean Valjean"} }).success(function(usrs) {
  //     // This function is called back with an array of matches.
  //     for (var i = 0; i < usrs.length; i++) {
  //       console.log(usrs[i].user_name + " exists");
  //     }
    // });
  // });
});

Room.sync();
Message.sync();
