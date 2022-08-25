const express = require("express");
const Hospital = require("../schemas/hospital");
const Bads = require("../schemas/bad");
const atob = require("atob");
const verify = require("../middleware/auth");
const router = new express.Router();


// get id by post
router.post("/badbyid", async (req, res) => {
  try {
      const id = req.body.id;
      const findBad = await Bads.findById(id);
      const relatedHospital = await Hospital.findById(findBad.hospitalId);
      const HospitalName = relatedHospital.name;

      const data = {findBad, HospitalName };
      res
          .status(200)
          .send(
              data
          );
      return;
  } catch (err) {
      res.status(400).send(`err ${err}`);
      return;
  }
});

router.get("/bad/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const findBad = await Bads.findById(id);
        const relatedHospital = await Hospital.findById(findBad.hospitalId);
        const HospitalName = relatedHospital.name;

        const data = {findBad, HospitalName };
        res
            .status(200)
            .send(
                data
            );
        return;
    } catch (err) {
        res.status(400).send(`err ${err}`);
        return;
    }
});

// update bad
router.patch("/bad/:id", verify, async (req, res) => {
    try {
      const id = req.params.id;
      const isVerified = true;
      const token = req.body.cookie_token;
      const dec = token.split(".")[1];
      const decode = JSON.parse(atob(dec)); //contains hospitalid
      console.log(decode._id);
    const findbad = await Bads.findById(id);
     console.log(findbad.hospitalId);
      if(findbad.hospitalId == decode._id){
      const data = await Bads.findOneAndUpdate( {
        _id: id
      },{
        $set: req.body
      });
        res.status(200).send("Bad data Updated");
    }
    else{
        res.send("Ids mis match");
    }
  }catch (err) {
      res.status(400).send("err"+err);
    }
  });
  
  router.delete("/bad/:id", verify, async (req, res) => {
    try {
      const isVerified = true;
      const token = req.body.cookie_token;
      const dec = token.split(".")[1];
      const decode = JSON.parse(atob(dec)); //contains Userid
      console.log(dec);
  
      const id = req.params.id;
      const findbad = await Bads.findById(id);
      if(!findbad)
      {
        res.status(404).send("data not found");  
        return;
      }
     console.log(findbad.hospitalId);
      if(findbad.hospitalId == decode._id){
      const data = await Bads.findByIdAndDelete({
        _id: id
      });
        res.status(200).send("Bad data deleted");
    }else{
    res.send("Ids mis match");   
    }
    } catch (err) {
      res.status(400).send(err);
    }
  });


router.get("/bads", async (req, res) => {
    try {
        const findBads = await Bads.find();
        //   console.log( findBads );
        res.status(200).send(findBads);
        return;
    } catch (err) {
        res.status(400).send(`err ${err}`);
        return;
    }
});

router.get("/bads/:type", async (req, res) => {
  try {
    let type = req.params.type;
if(type=="General"){
      const findBads = await Bads.find()
      .sort({ "generalType.availbility": -1 });
      res.status(200).send(findBads);
}
else{
   findBads = await Bads.find()
      .sort({ "specialType.availbility": -1 });
      res.status(200).send(findBads);
}
      return;
  } catch (err) {
      res.status(400).send(`err ${err}`);
      return;
  }
});

module.exports = router;
