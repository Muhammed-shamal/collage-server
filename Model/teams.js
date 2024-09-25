// const mongoose = require("mongoose");

// const teamSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   ranking: { type: Number, required: true },
//   score: { type: Number, required: true },
//   program: { type: String, required: true },
//   image: { type: String }, // URL or file path for the image

//   // For the checkbox data
//   isSingle: { type: Boolean, default: false },
//   isGroup: { type: Boolean, default: false },
//   reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
//   createdAt: { type: Date, default: Date.now },
// });

// const Team = mongoose.model("Team", teamSchema);

// module.exports = Team;

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  isSingle: { type: Boolean, default: false },
  isGroup: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  programs: [
    {
      programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program", // Reference to the Program model
        required: true,
      },
      score: { type: Number, default: 0 },
    },
  ],
  totalScore: { type: Number, default: 0 },
});

const Teams = mongoose.model("Team", teamSchema);
module.exports = Teams;
