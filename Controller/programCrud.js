const Program = require("../Model/program");
const Teams = require("../Model/teams");
const path = require("path");
const fs = require("fs");

module.exports = {
  // addProgram: async (req, res) => {
  //   const { value, label } = req.body;

  //   console.log("value", value);
  //   console.log("label", label);

  //   const newProgram = new Program({ value, label });

  //   try {
  //     await newProgram.save();
  //     res.status(201).json(newProgram);
  //   } catch (error) {
  //     console.error("Error saving program:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

  addProgram: async (req, res) => {
    try {
      const { value, label } = req.body;

      // Create a new program
      const newProgram = new Program({
        value,
        label,
        teams: [], // Empty teams initially
      });

      await newProgram.save();
      res.status(200).json({
        message: "Program created successfully!",
        program: newProgram,
      });
    } catch (error) {
      console.error("Error creating program:", error);
      res.status(500).json({ message: "Error creating program." });
    }
  },

  addTeamToProgram: async (req, res) => {
    
    try {
      const { teamId, programId, score,rank } = req.body;

      // Find team and program by their IDs
      const team = await Teams.findById(teamId);
      const program = await Program.findById(programId);

      if (!team || !program) {
        return res.status(404).json({ message: "Team or Program not found." });
      }

      // Check if the team already participated in the program
      const existingParticipation = team.programs.find(
        (p) => p.programId.toString() === programId
      );

      if (existingParticipation) {
        return res
          .status(400)
          .json({ message: "Team has already participated in this program." });
      }

      // Add the team to the program with a score
      team.programs.push({ programId, score,rank });
      program.teams.push({ teamId, score,rank });

      // Update the total score of the team
      team.totalScore += score;

      await team.save();
      await program.save();

      res.status(200).json({ message: "Team added to program successfully!" });
    } catch (error) {
      console.error("Error adding team to program:", error);
      res.status(500).json({ message: "Error adding team to program." });
    }
  },

  getAllPrograms: async (req, res) => {
    try {
      const programs = await Program.find();

      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteProgramById: async (req, res) => {
    try {
      const program = await Program.findById(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "program not found" });
      }

      const imageUrl = program.image;

      // Delete the image file from the folder
      if (imageUrl) {
        const imagePath = path.join(
          __dirname,
          "../public/programImg",
          imageUrl
        );

        fs.unlinkSync(imagePath);
      }

      await program.deleteOne();

      res.status(200).json({ message: "program deleted successfully" });
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: error.message });
    }
  },

  updateProgramById: async (req, res) => {
    const { value, label } = req.body;

    console.log(req.body);

    try {
      const foundProgram = await Program.findOne({ value: value });

      if (foundProgram) {
        foundProgram.value = value;
        foundProgram.label = label;

        await foundProgram.save();
        res.json(foundProgram);
      } else {
        res.status(404).json({ error: "Program Not Found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
