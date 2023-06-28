const User = require("../model/userModel");
const Baby = require("../model/babyModel");
const Plan = require("../model/subscriptonModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { ObjectId } = require("mongodb");
const {
  DialogueListInstance,
} = require("twilio/lib/rest/autopilot/v1/assistant/dialogue");
const accountSID = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const serviceId = process.env.SERVICE_ID;
const Razorpay = require("razorpay");
const client = require("twilio")(accountSID, authToken);
const razorpay = new Razorpay({
  key_id: "rzp_test_JDlClODKCsuMM1",
  key_secret: "onv9R6x8O5zCnps1qvRvGu7T",
});

cloudinary.config({
  cloud_name: "doao8efwv",
  api_key: "745623332482954",
  api_secret: "toFw3Po1H343ma43DqRubJ9XAd4",
});

const userRegister = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) {
      return res.json({
        message: "The email already exists",
        emailExists: true,
      });
    }

    const mobile = req.body.contactnum;
    const result = {
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      password: hashedPassword,
      contact: req.body.contactnum,
      adhar: req.body.adhar,
    };

    client.verify.v2
      .services(serviceId)
      .verifications.create({ to: `+91${mobile}`, channel: "sms" })
      .then((verification) => {
        console.log(verification.status);
        res.status(200).json({
          status: "true",
          message: "new User waiting for verification",
          result,
        });
      })
      .catch((error) => {
        console.error("Twilio verification request error:", error);
        res
          .status(500)
          .json({ status: "error", message: "Verification request failed" });
      });
  } catch (error) {
    console.error("User registration error:", error);
    res
      .status(500)
      .json({ status: "error", message: "User registration failed" });
  }
};

const logout = async (req, res) => {
  try {
    const id = req.body.data;
    const user = await User.findByIdAndUpdate(id, { token: null });
    if (user) {
      res.status(200).json({ status: true });
    }
  } catch (error) {}
};

const registerKid = async (req, res) => {
  try {
    const imageFile = req.body.image;

    const uploadResult = await cloudinary.uploader.upload(imageFile, {
      folder: "kid-images",
    });

    const imageUrl = uploadResult.secure_url;
    const result = await Baby({
      name: req.body.name,
      dob: req.body.dob,
      gender: req.body.gender,
      medications: req.body.medical,
      relation: req.body.relation,
      subscription: {
        id: req.body.plan.id,
        date: new Date(),
        expDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
      image: imageUrl,
      parent: req.body.user,
    });

    const babyData = await result.save();
    await User.findByIdAndUpdate(req.body.user, {
      $push: { mykids: babyData._id },
    });

    res.status(200).json({ data: "hi" });
  } catch (error) {
    console.log(error.message);
  }
};

const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(401).json({ message: "cannot find user" });
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(
        { name: user.name, userid: user._id },
        process.env.JWT_CODE,
        {
          expiresIn: "1h",
        }
      );
      const upd = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          $set: { token: token },
        }
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "wrong password" });
    }
  } catch (err) {
    console.log(err);
  }
};
const userProfile = async (req, res) => {
  try {
    const data = req.params;
    const userid = data.data;
    const user = await User.find({ _id: userid });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};

const myKids = async (req, res) => {
  try {
    const data = req.params;
    const userid = data.data;
    const kid = await Baby.find({ parent: userid, active: true }).populate(
      "parent"
    );
    res.status(200).json({ kid });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          dob: req.body.dob,
          contact: req.body.contact,
          adhar: req.body.adhar,
        },
      }
    );
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error.message);
  }
};
const babyprofile = async (req, res) => {
  try {
    const id = req.params.data;
    const baby = await Baby.findOne({ _id: id })
      .populate("parent")
      .populate("subscription.id");
    res.status(200).json({ baby });
  } catch (error) {
    console.log(error.message);
  }
};

const verifyotp = async (req, res) => {
  try {
    const otp = req.body.otp;
    const mob = req.body.details.contact;

    client.verify.v2
      .services(serviceId)
      .verificationChecks.create({ to: `+91${mob}`, code: otp })
      .then(async (verification_check) => {
        console.log(verification_check.status);
        if (verification_check.status === "approved") {
          const user = new User({
            name: req.body.details.name,
            email: req.body.details.email,
            dob: req.body.details.dob,
            password: req.body.details.password,
            contact: req.body.details.contact,
            adhar: req.body.details.adhar,
            verified: true,
          });

          const userData = await user.save();
          const token = jwt.sign(
            { name: userData.name, userid: userData._id },
            "DRmyHrN7NoMuXD2JUmpr4snPAODVP4fWitxmwFdEdo9nLra4YZm3Z3NZAWXGcMZ7xbvOGzFSZYrg5D2YvsXR9WNTfuPvsYcWpA2y",
            {
              expiresIn: "1h",
            }
          );

          await User.findByIdAndUpdate(
            { _id: userData._id },
            {
              $set: { token: token },
            }
          );

          userData.token = token;

          res.status(200).json({ success: true, data: userData });
        } else {
          res.status(400).json({ success: false, message: "invalid otp" });
        }
      })
      .catch((error) => {
        console.error("Twilio verification check error:", error);
        res
          .status(500)
          .json({ success: false, message: "Verification check failed" });
      });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Verify OTP failed" });
  }
};

const getHome = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json({ plans: plans });
  } catch (error) {
    console.log(error.message);
  }
};
const editBaby = async (req, res) => {
  try {
    await Baby.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          dob: req.body.dob,
          medications: req.body.medical,
          gener: req.body.gender,
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {}
};
const deleteBaby = async (req, res) => {
  try {
    await Baby.findByIdAndUpdate(req.body.id, {
      active: false,
    });
    res.status(200).json({ success: true });
  } catch (error) {}
};

// const registerKid=async(req,res)=>{
//   try {
//      const kidData = {
//        name: payment.notes.name,
//        dob: payment.notes.dob,
//        gender: payment.notes.gender,
//        relation: payment.notes.relation,
//        medical: payment.notes.medical,
//        plan: payment.notes.plan,
//        user: payment.notes.user,
//      };
//      const result = await Baby(kidData).save();
//      await User.findByIdAndUpdate(payment.notes.user, {
//        $push: { mykids: result._id },
//      });

//   } catch (error) {

//   }
// }

const verifyPayment = async (req, res) => {
  try {
    // console.log(req.body);
    // const { razorpay_payment_id, razorpay_signature } = req.body;

    // // Verify the payment signature
    // const generatedSignature = generateSignature(razorpay_payment_id);
    // if (generatedSignature !== razorpay_signature) {
    //   return res.status(400).json({ error: "Invalid payment signature" });
    // }

    // // Fetch payment details from Razorpay
    // const payment = await razorpay.payments.fetch(razorpay_payment_id);
    // if (payment.status !== "captured") {
    //   return res.status(400).json({ error: "Payment not captured" });
    // }

    // // Payment is successful, register the kid

    res.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// Generate the payment signature using your key secret
function generateSignature(razorpay_payment_id) {
  const hmac = crypto.createHmac("sha256", "onv9R6x8O5zCnps1qvRvGu7T");
  hmac.update(razorpay_payment_id);
  return hmac.digest("hex");
}

const removeExpiredSubscriptions = async () => {
  try {
    const currentDate = new Date();

    // Find all babies with expired subscriptions
    const expiredBabies = await Baby.find({
      "subscription.expDate": { $lt: currentDate },
    });

    // Remove the subscription from each expired baby
    for (const baby of expiredBabies) {
      baby.subscription = null;
      await baby.save();
    }
  } catch (error) {
    console.log(error.message);
  }
};
setInterval(removeExpiredSubscriptions, 6 * 60 * 60 * 1000);

module.exports = {
  getHome,
  userRegister,
  userLogin,
  userProfile,
  myKids,
  registerKid,
  updateUser,
  babyprofile,
  verifyotp,
  logout,
  editBaby,
  deleteBaby,
  verifyPayment,
};
