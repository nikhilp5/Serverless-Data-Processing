const express = require("express");
const router = express.Router();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldPath } = require("firebase-admin/firestore");
const register_collection = "Reg";
const state_collection = "state";

const serviceAccount = require("./parabolic-wall-391500-fa07ad8db38d.json");
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

router.post("/details", async (req, res) => {
  const loggedInUserId = req.body.id;
  await db
    .collection(state_collection)
    .where("state", "==", "online")
    .where(FieldPath.documentId(), "!=", loggedInUserId)
    .get()
    .then(async (stateSnapshot) => {
      let onlineUserIds = ["empty"];
      if (stateSnapshot.docs.length > 0) {
        onlineUserIds = stateSnapshot.docs.map((doc) => doc.id);
      }
      await db
        .collection(register_collection)
        .where(FieldPath.documentId(), "in", onlineUserIds)
        .get()
        .then((regSnapshot) => {
          const onlineUsers = [];
          regSnapshot.docs.map((doc) => {
            let userId = doc.id;
            let userData = doc.data();
            onlineUsers.push({ userId, userData });
          });
          return res.status(200).json(onlineUsers);
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ message: "Error in fetching User Details" });
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: "Error in fetching User State" });
    });
});

router.post("/logout", async (req, res) => {
  const userId = req.body.id;
  await db
    .collection(state_collection)
    .doc(userId)
    .update({ state: "offline", timestamp: new Date() })
    .then(() => {
      return res.status(200).json({ message: "Successfully Logged Out" });
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error while logging out" });
    });
});

module.exports = router;
