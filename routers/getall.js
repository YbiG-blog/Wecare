const express = require("express");
const Hospital = require("../schemas/hospital");
const Beds = require("../schemas/bad");
const _ = require('lodash');
const { find } = require("lodash");
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
    let citywise = _.lowerCase(req.params.city);
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
  // const availableBeds = await Beds.find({

  // }).countDocuments()
  // let s = 0;
  // const availableBeds = await Beds.find();
  // for (let i = 0; i < availableBeds.length; i++) {
  //   let d= availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility;
  //   s+=d;
  // }
  // console.log(s);
  let bedsj=0;
  const findbedJ = await Hospital.find({ city : "jaipur"});
for (let i = 0; i < findbedJ.length; i++) {
let id = findbedJ[i]._id ;
  const availableBeds = await Beds.find({HospitalId : id});
 bedsj+= availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility
}
let bedsk=0;
const findbedk = await Hospital.find({ city : "kota"});
for (let i = 0; i < findbedk.length; i++) {
let id = findbedk[i]._id ;
const availableBeds = await Beds.find({HospitalId : id});
bedsk+= availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility
}
let bedsa=0;
const findbeda = await Hospital.find({ city : "ajmer"});
for (let i = 0; i < findbeda.length; i++) {
let id = findbeda[i]._id ;
const availableBeds = await Beds.find({HospitalId : id});
bedsa+= availableBeds[i].generalType.availbility+availableBeds[i].specialType.availbility
}
const result ={bedsj,bedsk,bedsa};
  res.status(200).send(result);
})

module.exports = router;
