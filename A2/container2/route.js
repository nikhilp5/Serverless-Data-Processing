const express = require("express");
const router = express.Router();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const register_collection = "Reg";
const state_collection = "state";

const serviceAccount = require("./parabolic-wall-391500-fa07ad8db38d.json");
initializeApp({
  credential: cert(serviceAccount),
});

router.post("/login", async (req, res) => {
  const data = req.body;
  const db = getFirestore();
  await db
    .collection(register_collection)
    .where("email", "==", data.email)
    .where("password", "==", data.password)
    .get()
    .then(async (snapshot) => {
      if (snapshot.empty) {
        return res
          .status(401)
          .json({ message: "Error in validation.Check email and password" });
      } else {
        const userId = snapshot.docs[0].id;
        const userName = snapshot.docs[0].data().name;
        await db
          .collection(state_collection)
          .doc(userId)
          .update({ state: "online", timestamp: new Date() })
          .then(() => {
            return res.status(200).json({
              message: "Login Successful",
              id: userId,
              name: userName,
            });
          })
          .catch((error) => {
            return res
              .status(500)
              .json({ message: "Error updating user state" });
          });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error while logging in" });
    });
});

module.exports = router;
