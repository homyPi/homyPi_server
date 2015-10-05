module.exports = function(app) {
	var AlarmMiddleware = require(__base + "middleware/alarm");
	var UserMiddleware = require(__base + "middleware/user");

	app.post('/api/alarms/', UserMiddleware.isLoggedIn, AlarmMiddleware.post);
	app.get('/api/alarms/', UserMiddleware.isLoggedIn, AlarmMiddleware.getAll);
	app.get('/api/alarms/:id', UserMiddleware.isLoggedIn, AlarmMiddleware.getOne);
	app.delete('/api/alarms/:id', UserMiddleware.isLoggedIn, AlarmMiddleware.remove);

	app.put('/api/alarms/:alarmId', UserMiddleware.isLoggedIn, AlarmMiddleware.edit);

	app.get("/api/alarms/:alarmId/history", UserMiddleware.isLoggedIn, AlarmMiddleware.getHistory)
	app.post("/api/alarms/:alarmId/history", UserMiddleware.isLoggedIn, AlarmMiddleware.addHistory)
};