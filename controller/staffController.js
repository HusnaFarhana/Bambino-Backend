const Staff = require("../model/staffModel");
const User = require("../model/userModel");
const Baby = require("../model/babyModel");
const Plan = require("../model/subscriptonModel");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const staffLogin = async (req, res) => {
  try {
    const staff = await Staff.findOne({ email: req.body.email });
    if (!staff) {
      res.status(401).json({ message: "cannot find staff" });
      }
    if (req.body.password === staff.password) {
      const token = jwt.sign(
        { name: staff.name, staffid: staff._id },
        process.env.JWT_CODE,
        {
          expiresIn: "1h",
        }
      );
      const upd = await Staff.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: { token: token },
        }
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "wrong password" });
    }
  } catch (error) {}
};


const myProfile=async(req,res)=>{
  try {
    const id=req.params.data
    const staff = await Staff.findOne({ _id: id })
    res.status(200).json({staff:staff})
  } catch (error) {
    
  }
}

const getPupils = async (req, res) => {
  try {

    const id = req.params.id;
    const data=await Baby.find({staff:id,active:true}).populate('parent')
    res.status(200).json({ data: data });
  } catch (error) {}
};
const singleKid = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Baby.findById(id).populate('parent')
    res.status(200).json({ data: data });
  } catch (error) {}
};
module.exports = {
  staffLogin,
  myProfile,
  getPupils,
  singleKid,
};
