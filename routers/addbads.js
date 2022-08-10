const express = require("express");
const router = new express.Router();
const Bad = require("../schemas/bads");
const atob = require("atob");
const verify = require("../middleware/auth");

router.put("/bads", verify, async (req, res) => {
  try {
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains Userid
    console.log(dec);

    const { roomNum, price } = await req.body;
    let bads_creat = new Bad({
      hospitalId: decode,
      roomNum,
      price
    });
    await bads_creat.save();
    let msg = "bad add successfully";
    await res.status(201).send({ msg });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/seebads", async(req,res)=>{

try {
  const hospitalId = req.body.hospitalId;

  const badData = await Bad.find({ hospitalId : hospitalId }).populate(
    "hospitalId",
    "name email mobileNum state district hospitalType"
  );
  res.status(201).send(badData);
} catch (err) {
  res.status(400).send(err);
}
});

module.exports = router;
