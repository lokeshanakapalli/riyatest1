const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../Models/user-register'); // Import your User model
const router = express.Router();

// Create 'uploads' folder if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save the files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
  }
});

// Filter to accept only image files (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type, only JPEG, PNG, or JPG are allowed'), false); // Reject file
  }
};

// Multer middleware to handle image upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
});

// Register user (POST)
router.post('/register', upload.single('image'), async (req, res) => {
  const { 
    gender, createdBy, paymentStatus, imagePrivacy, countryCode, mobileNumber, email, password, bureauId, step1, step2, step3, step4, 
    step5, step6, step7, step8, step9, martialId, fullName, dateOfBirth, time, maritalStatus, maleKids, femaleKids, hasRelatives, 
    height, weight, physicalState, eatingHabits, smokingHabits, drinkingHabits, religion, motherTongue, languagesKnown, caste, subcaste, 
    gotram, raasi, star,

    // New fields for education and employment
    education, employmentStatus, occupation, annualIncome, jobLocation, otherBusiness, businessLocation, otherBusinessIncome, extraTalentedSkills,
    
    // Family Details fields
    fatherEmployee, fatherOccupied, motherEmployee, motherOccupied, totalBrothers, marriedBrothers, totalSisters, marriedSisters, 
    familyValue, familyType, originalLocation, selectedLocation,

    // Newly added Family Property Details fields
    houseType, houseSqFeet, houseValue, monthlyRent, houseLocation, openPlots, openPlotsSqFeet, openPlotsValue, openPlotsLocation,

    // Newly added Apartment/Flat details
    numberOfApartments, flatValue, flatLocation, agricultureLand, agricultureLandValue, agricultureLandLocation, anyMoreProperties, totalPropertiesValue,

    // Location Details fields (country, state, district, citizenship)
    country, state, district, citizenship
  } = req.body;

  const image = req.file ? req.file.filename : null; // Get the filename from Multer

  // Ensure all necessary fields are provided
  if (!email || !password || !mobileNumber) {
    return res.status(400).json({ message: 'Email, password, and mobile number are required' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the newly added fields
    const newUser = new User({
      gender,createdBy,paymentStatus,image,imagePrivacy,countryCode,mobileNumber,email,password: hashedPassword,bureauId,martialId,

      step1,step2, step3, step4, step5, step6, step7, step8, step9, 

      // Personal Details fields
      fullName,dateOfBirth,time,maritalStatus,maleKids,femaleKids,hasRelatives,height,weight,physicalState,eatingHabits,smokingHabits,drinkingHabits,

      // Cultural & Religious Information
      religion,motherTongue,languagesKnown,caste,subcaste,gotram,raasi,star,

      // Education and Employment Details
      education,employmentStatus,occupation,annualIncome,jobLocation,otherBusiness,businessLocation,otherBusinessIncome,extraTalentedSkills,

      // Family Details fields
      fatherEmployee,fatherOccupied,motherEmployee,motherOccupied,totalBrothers,marriedBrothers,totalSisters,marriedSisters,familyValue,familyType,originalLocation,selectedLocation,

      // Family Property Details fields
      houseType,houseSqFeet,houseValue,monthlyRent,houseLocation,openPlots,openPlotsSqFeet,openPlotsValue,openPlotsLocation,

      // Apartment/Flat details
      numberOfApartments,flatValue,flatLocation,agricultureLand,agricultureLandValue,agricultureLandLocation,anyMoreProperties, totalPropertiesValue,

      // Location Details fields
      country,state,district,citizenship
    });

    // Save the new user to the database
    await newUser.save();

    // Return only the user ID (_id)
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all users (GET)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    // Get the gender query parameter from the request
    const gender = req.query.gender;

    // Build the query object
    let query = {};
    if (gender) {
      query.gender = gender; // Only add the gender filter if it's provided
    }

    // Find users based on the query
    const users = await User.find(query);

    // Respond with the found users
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get user by ID (GET /user/:id)
router.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user by ID (PUT /user/:id)
router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    gender, createdBy, paymentStatus, image, imagePrivacy, countryCode, mobileNumber, email, bureauId, step1, step2, step3, step4, 
    step5, step6, step7, step8, step9, martialId, fullName, dateOfBirth, time, maritalStatus, maleKids, femaleKids, 
    hasRelatives, height, weight, physicalState, eatingHabits, smokingHabits, drinkingHabits, religion, motherTongue, 
    languagesKnown, caste, subcaste, gotram, raasi, star,

    // New fields for education and employment
    education, employmentStatus, occupation, annualIncome, jobLocation, otherBusiness, businessLocation, otherBusinessIncome, extraTalentedSkills,

    // Family Details fields
    fatherEmployee, fatherOccupied, motherEmployee, motherOccupied, totalBrothers, marriedBrothers, totalSisters, marriedSisters, 
    familyValue, familyType, originalLocation, selectedLocation,

    // Newly added Family Property Details fields
    houseType, houseSqFeet, houseValue, monthlyRent, houseLocation, openPlots, openPlotsSqFeet, openPlotsValue, openPlotsLocation,

    // Newly added Apartment/Flat details
    numberOfApartments, flatValue, flatLocation, agricultureLand, agricultureLandValue, agricultureLandLocation, anyMoreProperties, totalPropertiesValue,

    // Location Details fields (country, state, district, citizenship)
    country, state, district, citizenship
  } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details, only if new values are provided
    user.gender = gender || user.gender;
    user.createdBy = createdBy || user.createdBy;
    user.paymentStatus = paymentStatus || user.paymentStatus;
    user.image = image || user.image;
    user.imagePrivacy = imagePrivacy || user.imagePrivacy;
    user.countryCode = countryCode || user.countryCode;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.email = email || user.email;
    user.bureauId = bureauId || user.bureauId;
    user.martialId = martialId || user.martialId;

    // Steps fields
    user.step1 = step1 || user.step1;
    user.step2 = step2 || user.step2;
    user.step3 = step3 || user.step3;
    user.step4 = step4 || user.step4;
    user.step5 = step5 || user.step5;
    user.step6 = step6 || user.step6;
    user.step7 = step7 || user.step7;
    user.step8 = step8 || user.step8;
    user.step9 = step9 || user.step9;

    // Personal details fields
    user.fullName = fullName || user.fullName;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.time = time || user.time;
    user.maritalStatus = maritalStatus || user.maritalStatus;
    user.maleKids = maleKids !== undefined ? maleKids : user.maleKids;
    user.femaleKids = femaleKids !== undefined ? femaleKids : user.femaleKids;
    user.hasRelatives = hasRelatives || user.hasRelatives;
    user.height = height || user.height;
    user.weight = weight !== undefined ? weight : user.weight;
    user.physicalState = physicalState || user.physicalState;
    user.eatingHabits = eatingHabits || user.eatingHabits;
    user.smokingHabits = smokingHabits || user.smokingHabits;
    user.drinkingHabits = drinkingHabits || user.drinkingHabits;

    // Form details fields
    user.religion = religion || user.religion;
    user.motherTongue = motherTongue || user.motherTongue;
    user.languagesKnown = languagesKnown || user.languagesKnown;
    user.caste = caste || user.caste;
    user.subcaste = subcaste || user.subcaste;
    user.gotram = gotram || user.gotram;
    user.raasi = raasi || user.raasi;
    user.star = star || user.star;

    // Education and Employment fields
    user.education = education || user.education;
    user.employmentStatus = employmentStatus || user.employmentStatus;
    user.occupation = occupation || user.occupation;
    user.annualIncome = annualIncome !== undefined ? annualIncome : user.annualIncome;
    user.jobLocation = jobLocation || user.jobLocation;
    user.otherBusiness = otherBusiness || user.otherBusiness;
    user.businessLocation = businessLocation || user.businessLocation;
    user.otherBusinessIncome = otherBusinessIncome !== undefined ? otherBusinessIncome : user.otherBusinessIncome;
    user.extraTalentedSkills = extraTalentedSkills || user.extraTalentedSkills;

    // Family Details fields
    user.fatherEmployee = fatherEmployee || user.fatherEmployee;
    user.fatherOccupied = fatherOccupied || user.fatherOccupied;
    user.motherEmployee = motherEmployee || user.motherEmployee;
    user.motherOccupied = motherOccupied || user.motherOccupied;
    user.totalBrothers = totalBrothers !== undefined ? totalBrothers : user.totalBrothers;
    user.marriedBrothers = marriedBrothers !== undefined ? marriedBrothers : user.marriedBrothers;
    user.totalSisters = totalSisters !== undefined ? totalSisters : user.totalSisters;
    user.marriedSisters = marriedSisters !== undefined ? marriedSisters : user.marriedSisters;
    user.familyValue = familyValue || user.familyValue;
    user.familyType = familyType || user.familyType;
    user.originalLocation = originalLocation || user.originalLocation;
    user.selectedLocation = selectedLocation || user.selectedLocation;

    // Family Property Details fields
    user.houseType = houseType || user.houseType;
    user.houseSqFeet = houseSqFeet !== undefined ? houseSqFeet : user.houseSqFeet;
    user.houseValue = houseValue !== undefined ? houseValue : user.houseValue;
    user.monthlyRent = monthlyRent !== undefined ? monthlyRent : user.monthlyRent;
    user.houseLocation = houseLocation || user.houseLocation;
    user.openPlots = openPlots !== undefined ? openPlots : user.openPlots;
    user.openPlotsSqFeet = openPlotsSqFeet !== undefined ? openPlotsSqFeet : user.openPlotsSqFeet;
    user.openPlotsValue = openPlotsValue !== undefined ? openPlotsValue : user.openPlotsValue;
    user.openPlotsLocation = openPlotsLocation || user.openPlotsLocation;

    // Apartment/Flat details
    user.numberOfApartments = numberOfApartments !== undefined ? numberOfApartments : user.numberOfApartments;
    user.flatValue = flatValue !== undefined ? flatValue : user.flatValue;
    user.flatLocation = flatLocation || user.flatLocation;
    user.agricultureLand = agricultureLand !== undefined ? agricultureLand : user.agricultureLand;
    user.agricultureLandValue = agricultureLandValue !== undefined ? agricultureLandValue : user.agricultureLandValue;
    user.agricultureLandLocation = agricultureLandLocation || user.agricultureLandLocation;
    user.anyMoreProperties = anyMoreProperties || user.anyMoreProperties;
    user.totalPropertiesValue = totalPropertiesValue !== undefined ? totalPropertiesValue : user.totalPropertiesValue;

    // Location Details fields
    user.country = country || user.country;
    user.state = state || user.state;
    user.district = district || user.district;
    user.citizenship = citizenship || user.citizenship;

    // Save updated user to the database
    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete user by ID (DELETE /user/:id)
router.delete('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
