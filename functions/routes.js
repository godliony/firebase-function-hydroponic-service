const HydroponicController = require('./controllers/HydroponicController')
const verifyJWT = require('./middleware/verifyJWT')
const ROLES_LIST = require('./config/roles_list')
const verifyRoles = require('./middleware/verifyRoles')
module.exports = (app) => {
    // RESFUL Api for users management

    // Create user
    app.post('/hydroponic', HydroponicController.create)
    // Edit user
    app.put('/hydroponic/:hydroponicId',HydroponicController.put)
    // Delete user
    app.delete('/hydroponic/:hydroponicId',HydroponicController.remove)
    // Get user by id
    
    app.get('/hydroponic/:hydroponicId',HydroponicController.show)
    
    //Below this line need jwtToken (Login)
    //app.use(verifyJWT) 
    // Get all user
    //app.get('/users',verifyRoles(ROLES_LIST.User),UserController.index)
    app.get('/hydroponics/:ownerID',HydroponicController.index)
    
    app.patch('/hydroponic/:hydroponicId',HydroponicController.binding)
}