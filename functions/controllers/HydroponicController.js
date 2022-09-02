const admin = require('firebase-admin');
const config = require('../config/firebase.json')
admin.initializeApp({
    credential: admin.credential.cert(config)
});
const db = admin.firestore();
const Device = db.collection('devices');
module.exports = {
    //get all device
    async index(req, res) {
        try{
            const devices = await Device.where("owner","==",req.params.ownerID).get().then((querySnapshot) => {
                return querySnapshot.docs.map(doc => Object.assign({ data: doc.data() }, { id: doc.id }))
            })
            res.send(devices)
        }catch(err){
            res.status(500).send(err)
        }
    },
    // create device
    async create(req, res) {
        try {
            const {hardwareId} = req.body
            if(!hardwareId) return res.status(400).json({'message': 'HardwareId is required'})
            
            const duplicate = await Device.where("hardwareId","==",hardwareId).get();
            if(!duplicate.empty) return res.sendStatus(409) // Conflict

            //store the new device
            await Device.add({"name": "New hydroponic", "desc": "", "ownerId": "", "type": "hydroponic", "hardwareId": hardwareId});
            res.send({'success': `New hydroponic device ${hardwareId} created!`})
        } catch (err) {
            res.status(500).send(err)
        }

    },

    // edit device
    async put(req, res) {
        try{
            const device = await Device.doc(req.params.hydroponicId).get()
            if(!device.exists){
                return res.status(403).send({
                    error: 'The device information was incorrect'
                })
            }

            const hardwareId = device.data().hardwareId
            req.body.hardwareId = hardwareId

            await Device.doc(req.params.hydroponicId).set(req.body)
            res.send(req.body)
        }catch(err){
            res.status(500).send(err)
        }
    },

    // delete device
    async remove(req, res) {
        try{
            const device = await Device.doc(req.params.hydroponicId).get()
            if(!device.exists){
                return res.status(403).send({
                    error: 'The device information was incorrect'
                })
            }
            await Device.doc(req.params.hydroponicId).delete()
            res.send({"hardwareId": device.data().hardwareId})
        }catch(err){
            return res.status(500).send(err)
        }
    },

    // show device
    async show(req, res) {
        try{
            const device = await Device.doc(req.params.hydroponicId).get()
            if(!device.exists){
                return res.status(403).send({
                    error: 'The hydroponic information was incorrect'
                })
            }
            res.send(device.data())
        }catch(err){
            res.status(500).send(err)
        }
    },
    // binding device with owner
    async binding(req, res) {
        try{
            const {ownerId} = req.body
            if(!ownerId) return res.status(400).json({'message': 'ownerId is required!'}) 

            const device = await Device.doc(req.params.hydroponicId).get()
            
            if(!device.exists){
                return res.status(403).send({
                    error: 'The device information was incorrect'
                })
            }

            await Device.doc(req.params.hydroponicId).update({
                "ownerId": ownerId,
              });
            res.send(req.body)
        }catch(err){
            res.status(500).send(err)
        }
    }

}