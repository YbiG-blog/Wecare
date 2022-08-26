const express = require("express");
const Hospital = require("../schemas/hospital");
const Beds = require("../schemas/bad");
const atob = require("atob");
const verify = require("../middleware/auth");
const router = new express.Router();

router.get("/hospitals", async (req, res) => {
  try {
    const allHospital = await Hospital.find();
    res.status(200).send(allHospital);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});
router.get("/hospitals/:city", async (req, res) => {
  try {
    let citywise = req.params.city;
    const allHospital = await Hospital.find({ city : citywise });
   if(allHospital.length === 0 ){ res.status(404).send("No bad available in this area");
   return;}
    res.status(200).send(allHospital);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});
router.get("/hospitalsby/:pincode", async (req, res) => {
  try {
    let pinwise = req.params.pincode;
    const allHospital = await Hospital.find();
    let hosdata = [];
    for (let i = 0; i < allHospital.length; i++) {
      if(allHospital[i].pincode== pinwise){
hosdata.push(allHospital[i]);
      }
    }
   if(hosdata.length === 0 ){ res.status(404).send("No bad available in this area");
   return;
  }
    res.status(200).send(hosdata);
  } catch (err) {
    res.status(500).send(`err ${err}`);
  }
});
router.get("/datadistrict", async(req,res)=>{
  let bedsj=0,numhj=0;
  const findbedJ = await Hospital.find({ city : "jaipur"});
for (let i = 0; i < findbedJ.length; i++) {
let id = findbedJ[i]._id ;
  const availableBeds = await Beds.find({HospitalId : id});
 bedsj+= availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility;
 numhj+=1;
}
let bedsk=0, numhk=0;
const findbedk = await Hospital.find({ city : "kota"});
for (let i = 0; i < findbedk.length; i++) {
let id = findbedk[i]._id ;
const availableBeds = await Beds.find({HospitalId : id});
bedsk+= availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility;
numhk+=1;
}
let bedsa=0, numha=0;
const findbeda = await Hospital.find({ city : "ajmer"});
for (let i = 0; i < findbeda.length; i++) {
let id = findbeda[i]._id ;
const availableBeds = await Beds.find({HospitalId : id});
bedsa+= availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility;
numha+=1;
}
const result ={bedsj,bedsk,bedsa,numhj,numhk,numha};
  res.status(200).send(result);
})
router.put("/pichart", verify,async(req,res)=>{
try {
  const id = req.params.id;
      const isVerified = true;
      const token = req.body.cookie_token;
      const dec = token.split(".")[1];
      const decode = JSON.parse(atob(dec)); //contains hospitalid

let total = 0, general =0, special =0;

const findbed = await Hospital.findById(decode._id);
const availableBeds = await Beds.find();
for (let i = 0; i < availableBeds.length; i++) {
if(availableBeds[i].hospitalId== decode._id)
{
  total=availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility;
  general=availableBeds[i].generalType.availbility;
  special=availableBeds[i].specialType.availbility;
}
}

const result={ total, general, special};
  res.status(200).send(result);
} catch (err) {
  res.status(400).send(err); 
}
})

module.exports = router;
