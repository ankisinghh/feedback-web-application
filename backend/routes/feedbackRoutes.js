const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  deleteFeedback,
} = require("../controllers/feedbackController");

router.post("/", createFeedback);
router.get("/", getFeedbacks);
router.delete("/:id", deleteFeedback);

module.exports = router;
router.put("/:id", async (req, res) => {

  console.log("PUT route hit");
  try {
    const { name, message, rating } = req.body;

    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      { name, message, rating },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.put("/test/:id", (req, res) => {
  res.json({ message: "Test route works" });
});