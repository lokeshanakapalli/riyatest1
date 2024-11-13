const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the merged User schema with LocationDetails schema fields added
const userSchema = new Schema(
  {
    // General User Information
    gender: { type: String, required: false },
    createdBy: { type: String, required: false },
    paymentStatus: { type: String, required: false },
    image: { type: String, required: false }, // Assuming image URL will be stored as a string
    imagePrivacy: { type: String, required: false },
    countryCode: { type: String, required: false },
    mobileNumber: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: false },
    bureauId: { type: String, required: false },
    martialId: { type: String, required: false },

    step1: { type: String, required: false },
    step2: { type: String, required: false },
    step3: { type: String, required: false },
    step4: { type: String, required: false },
    step5: { type: String, required: false },
    step6: { type: String, required: false },
    step7: { type: String, required: false },
    step8: { type: String, required: false },
    step9: { type: String, required: false },

    // Personal Details Information
    fullName: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    time: { type: String, required: false }, // Assuming time is stored as a string (HH:MM)
    maritalStatus: {
      type: String,
      enum: ["neverMarried", "awaitingDivorce", "divorced", "widow"],
      required: false,
    },
    maleKids: { type: Number, min: 0, max: 10, default: 0, required: false },
    femaleKids: { type: Number, min: 0, max: 10, default: 0, required: false },
    hasRelatives: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    height: { type: String, required: false }, // Storing height as a string (e.g., '5.5')
    weight: { type: Number, min: 30, max: 200, required: false },
    physicalState: {
      type: String,
      enum: [
        "slim",
        "normal",
        "athletic",
        "average",
        "heavy",
        "physicallyChallenged",
      ],
      required: false,
    },
    eatingHabits: {
      type: String,
      enum: ["vegetarian", "nonVegetarian", "eggetarian"],
      required: false,
    },
    smokingHabits: {
      type: String,
      enum: ["yes", "no", "occasionally"],
      required: false,
    },
    drinkingHabits: {
      type: String,
      enum: ["yes", "no", "occasionally"],
      required: false,
    },

    // Form Details (Education and Employment Information)
    education: { type: String, required: false },
    employmentStatus: { type: String, required: false },
    occupation: { type: String, required: false },
    annualIncome: { type: Number, required: false },
    jobLocation: { type: String, required: false },
    otherBusiness: {
      type: String,
      enum: ["1", "2", "3", "4", "null"],
      required: false,
      default: "null",
    },
    businessLocation: { type: String, required: false },
    otherBusinessIncome: { type: Number, required: false },
    extraTalentedSkills: { type: String, required: false },

    // Form Details (Cultural & Religious Information)
    religion: {
      type: String,
      enum: ["buddhist", "christian", "hindu", "muslim", "sikh", "islam"],
      required: false,
    },
    motherTongue: {
      type: String,
      enum: [
        "bengali",
        "english",
        "hindi",
        "kannada",
        "marathi",
        "tamil",
        "telugu",
      ],
      required: false,
    },
    languagesKnown: {
      type: [String],
      enum: [
        "Bengali",
        "English",
        "Hindi",
        "Kannada",
        "Marathi",
        "Tamil",
        "Telugu",
      ],
      required: false,
    },
    caste: {
      type: String,
      enum: ["general", "obc", "sc", "st"],
      required: false,
    },
    subcaste: {
      type: String,
      enum: ["kshatriya", "brahmin", "vaishya", "sudra"],
      required: false,
    },
    gotram: {
      type: String,
      enum: ["vashistha", "kanva", "gargya", "bharadwaja", "atreyas"],
      required: false,
    },
    raasi: {
      type: String,
      enum: [
        "mesha",
        "vrishabha",
        "mithuna",
        "karka",
        "simha",
        "kanya",
        "tula",
        "vrischika",
        "dhanu",
        "makara",
        "kumbha",
        "meena",
      ],
      required: false,
    },
    star: {
      type: String,
      enum: [
        "ashwini",
        "bharani",
        "krittika",
        "rohini",
        "mrigashira",
        "ardra",
        "punarvasu",
        "pushya",
        "ashlesha",
        "magha",
      ],
      required: false,
    },

    // Family Details Information
    fatherEmployee: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    fatherOccupied: {
      type: String,
      enum: ["full-time", "part-time", "freelancer", "retired"],
      required: function () {
        return this.fatherEmployee === "yes";
      }, // Only required if father is employed
    },
    motherEmployee: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    motherOccupied: {
      type: String,
      enum: ["full-time", "part-time", "freelancer", "retired"],
      required: function () {
        return this.motherEmployee === "yes";
      }, // Only required if mother is employed
    },
    totalBrothers: {
      type: Number,
      min: 0,
      max: 10,
      required: false,
    },
    marriedBrothers: {
      type: Number,
      min: 0,
      max: 10,
      required: function () {
        return this.totalBrothers > 0;
      }, // Only required if total brothers is greater than 0
    },
    totalSisters: {
      type: Number,
      min: 0,
      max: 10,
      required: false,
    },
    marriedSisters: {
      type: Number,
      min: 0,
      max: 10,
      required: function () {
        return this.totalSisters > 0;
      }, // Only required if total sisters is greater than 0
    },
    familyValue: {
      type: String,
      enum: ["orthodox", "traditional"],
      required: false,
    },
    familyType: {
      type: String,
      enum: ["joint", "nuclear"],
      required: false,
    },
    originalLocation: {
      type: String,
      enum: ["location1", "location2", "location3"],
      required: false,
    },
    selectedLocation: {
      type: String,
      enum: ["selectedLocation1", "selectedLocation2"],
      required: false,
    },

    // Family Property Details (from your earlier schema)
    houseType: { type: String, required: false },
    houseSqFeet: { type: Number, required: false },
    houseValue: { type: Number, required: false },
    monthlyRent: { type: Number, required: false },
    houseLocation: { type: String, required: false },
    openPlots: { type: String, required: false },
    openPlotsSqFeet: { type: Number, required: false },
    openPlotsValue: { type: Number, required: false },
    openPlotsLocation: { type: String, required: false },

    // Apartment/Flat Details (added fields from the first schema)
    numberOfApartments: { type: String, required: false },
    flatValue: { type: Number, required: false },
    flatLocation: { type: String, required: false },
    agricultureLand: { type: String, required: false },
    agricultureLandValue: { type: Number, required: false },
    agricultureLandLocation: { type: String, required: false },
    anyMoreProperties: { type: String, required: false },
    totalPropertiesValue: { type: Number, required: false },

    // Location Details (Country, State, District, Citizenship)
    country: { type: String, required: false },
    state: { type: String, required: false },
    district: { type: String, required: false },
    citizenship: { type: String, required: false },
  },
  { timestamps: true }
);

// Create the User model with the merged schema
const User = mongoose.model("User", userSchema);

module.exports = User;