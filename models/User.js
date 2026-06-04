import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* -------------------------------------------------------------------------- */
/*                               IMAGE SCHEMA                                 */
/* -------------------------------------------------------------------------- */

const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
  },

);

/* -------------------------------------------------------------------------- */
/*                              TIMELINE SCHEMA                               */
/* -------------------------------------------------------------------------- */

const timelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { _id: true }
);

/* -------------------------------------------------------------------------- */
/*                               PROJECT SCHEMA                               */
/* -------------------------------------------------------------------------- */

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    techStack: {
      type: String,
      required: true,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    image: imageSchema,
  },
  { _id: true }
);

/* -------------------------------------------------------------------------- */
/*                                USER SCHEMA                                 */
/* -------------------------------------------------------------------------- */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Prevents accidental leakage in queries
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    timeline: [timelineSchema],
    skills: [imageSchema],
    projects: [projectSchema],
    about: {
      name: {
        type: String,
        trim: true,
      },
      title: {
        type: String,
        trim: true,
      },
      subtitle: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      quote: {
        type: String,
        trim: true,
      },
      avatar: imageSchema,
    },
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------------------------------------- */
/*                           HASH PASSWORD BEFORE SAVE                        */
/* -------------------------------------------------------------------------- */

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const saltRounds =
    parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

  this.password = await bcrypt.hash(
    this.password,
    saltRounds
  );
});
/* -------------------------------------------------------------------------- */
/*                           COMPARE PASSWORD METHOD                          */
/* -------------------------------------------------------------------------- */

userSchema.methods.comparePassword = async function (password) {
  // Since select: false is on password, ensure password exists when executing
  if (!this.password) {
    throw new Error("Password field not selected or loaded in query context");
  }
  return await bcrypt.compare(password, this.password);
};

/* -------------------------------------------------------------------------- */
/*                             GENERATE JWT TOKEN                             */
/* -------------------------------------------------------------------------- */


export const User = mongoose.model("User", userSchema);
