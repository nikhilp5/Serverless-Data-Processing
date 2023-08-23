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

router.post("/register", async (req, res) => {
  const db = getFirestore();
  const data = req.body;
  const checkEmailExists = await db
    .collection(register_collection)
    .where("email", "==", data.email);
  checkEmailExists.get().then(async (snapshot) => {
    if (!snapshot.empty) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      await db
        .collection(register_collection)
        .add(data)
        .then(async (ref) => {
          const userId = ref.id;
          await db
            .collection(state_collection)
            .doc(userId)
            .set({ state: "offline", timestamp: new Date() })
            .then(() => {
              return res
                .status(200)
                .json({ message: "User Registered Successfully" });
            })
            .catch((error) => {
              return res
                .status(500)
                .json({ message: "Error adding user state" });
            });
        })
        .catch((error) => {
          return res.status(400).json({ message: "Failed to Register" });
        });
    }
  });
});

module.exports = router;
