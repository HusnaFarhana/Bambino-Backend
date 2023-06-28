const jwt = require("jsonwebtoken");
const Staff = require("../model/staffModel");
const Kids = require("../model/babyModel");
const Plan = require("../model/subscriptonModel");
const User = require("../model/userModel");
const { log } = require("console");
const postAdminLogin = async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    const verifyEmail = req.body.email;
    const verifyPass = req.body.password;

    if (verifyEmail !== adminEmail || verifyPass !== adminPass) {
      res.status(401).json({ message: "invalid Credentials" });
    } else {
      const admintoken = jwt.sign({ name: "admin" }, process.env.JWT_CODE, {
        expiresIn: "1h",
      });
      res.status(200).json({ admintoken });
    }
  } catch (error) {
    console.log(error);
  }
};

const addTutor = async (req, res) => {
  try {
    const result = await Staff({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      dob: req.body.dob,
      address: req.body.address,
      contact: req.body.contact,
      adharNo: req.body.adhar,
      image:req.body.image
    });
    const tutorData = await result.save();

    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};
const viewStaffs = async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.status(200).json({ staffs });
  } catch (error) {
    console.log(error.message);
  }
};
const getKids = async (req, res) => {
  try {
    const kids = await Kids.find().populate("staff");
    res.status(200).json({ kids });
  } catch (error) {
    console.log(error.message);
  }
};
const addPlan = async (req, res) => {
  try {
    const result = await Plan({
      name: req.body.name,
      ageGroup: req.body.agegroup,
      description: req.body.description,
      price: req.body.price,
      athome: req.body.athome,
    });
    await result.save();
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};
const tutorProfile = async (req, res) => {
  try {
    const id = req.params.data;
    const tutor = await Staff.findOne({ _id: id }).populate("kids");
    res.status(200).json({ tutor });
  } catch (error) {
    console.log(error.message);
  }
};
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json({ plans });
  } catch (error) {
    console.log(error.message);
  }
};
const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
};
const getDash = async (req, res) => {
  try {
    const data = {};
    data.users = await User.countDocuments();
    data.kids = await Kids.countDocuments();
    data.plans = await Plan.countDocuments();
    data.staffs = await Staff.countDocuments();
    res.status(200).json({ data });
  } catch (error) {
    console.log(error.message);
  }
};
const getBabyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Kids.findOne({ _id: id }).populate("parent");
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error.message);
  }
};
const allot = async (req, res) => {
  try {
    await Kids.findByIdAndUpdate(req.body.babyid, {
      $unset: { staff: 1 },
    });
    await Kids.findByIdAndUpdate(req.body.babyid, {
      $set: { staff: req.body.staffid },
    });

    const exist = await Staff.findOne({ kids: { $in: [req.body.babyid] } });
    if (exist) {
      await Staff.findByIdAndUpdate(exist._id, {
        $pull: { kids: req.body.babyid },
      });
    }
    await Staff.findByIdAndUpdate(req.body.staffid, {
      $push: { kids: req.body.babyid },
    });
    res.status(200).json({ message: "hi" });
  } catch (error) {
    console.log(error.message);
  }
};

const editTutor = async (req, res) => {
  try {
    const upd = await Staff.findByIdAndUpdate(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          dob: req.body.dob,
          password: req.body.password,
          address: req.body.address,
          contact: req.body.contact,
          adharNo: req.body.adharNo,
        },
      }
    );
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const getAPlan = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Plan.findById(id);
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error.message);
  }
};
const editPlan = async (req, res) => {
  try {
    await Plan.findByIdAndUpdate(req.body.id, {
      $set: {
        name: req.body.name,
        ageGroup: req.body.agegroup,
        description: req.body.description,
        price: req.body.price,
        athome: req.body.athome,
      },
    });
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.deleteOne({_id:req.params.id});
    const result = await Kids.updateMany(
      { staff: req.params.id },
      { staff: null }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  postAdminLogin,
  addTutor,
  viewStaffs,
  getKids,
  addPlan,
  tutorProfile,
  getPlans,
  getUsers,
  getDash,
  getBabyProfile,
  allot,
  editTutor,
  getAPlan,
  editPlan,
  deleteStaff,
};
