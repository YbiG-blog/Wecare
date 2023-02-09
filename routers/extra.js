// //hospital

// router.put("/bookingbyhospital", verify, async ({ body }, res) => {
//     try {
//       const token = body.cookie_token;
//       const decode = jwtDecode(token); // hospitalId
//       const findBed = await Bed.findOne({ hospitalId: decode });
//       const otp = Math.floor(100000 + Math.random() * 900000);
  
//       const { patientName, Adhar, email, age, type } = body;
//       let bed_allot = new bookingBed({
//         hospitalId: decode,
//         patientName,
//         Adhar,
//         email,
//         age,
//         type,
//         otp: otp,
//       });
//       bed_allot.save();
//       const text = `Please verify with below otp \n ${otp}`,
//         subject = "otp vefication",
//         userEmail = bed_allot.email;
//       /// otp sent
//       sendEmail(userEmail, subject, text);
  
//       const msg = "Otp has been sent";
//       const bedAllotId = bed_allot._id,
//         bedId = findBed._id;
//       res.status(201).send({ msg, bedAllotId, bedId, otp });
//     } catch (err) {
//       res.status(400).send(`err ${err}`);
//     }
//   });
  
//   router.put("/bookingbyhospital/verify", verify, async ({ body }, res) => {
//     try {
//       const token = body.cookie_token;
//       const decode = jwtDecode(token);
//       const { _id } = decode; // hospitalId
//       const { bedAllotId, bedId, otp } = body;
//       const findbedAllot = await bookingBed.findById(bedAllotId);
//       const findbed = await Bed.findById(bedId);
//       const findHospital = await Hospital.findById(_id);
//       const hosName = findHospital.name,
//         hosEmail = findHospital.email,
//         emailpatient = findbedAllot.email;
  
//       let bedUpdateNum = 0,
//         priceperbad = 0,
//         type = "";
//       if (otp === findbedAllot.otp) {
//         if (findbedAllot.bookingFlag === false) {
//           if (findbedAllot.type == "General") {
//             (bedUpdateNum = findbed.generalType.availbility - 1),
//               (priceperbad = findbed.generalType.pricePerbad),
//               (type = findbed.generalType.type);
//             await Bed.findOneAndUpdate(
//               {
//                 _id: bedId,
//               },
//               {
//                 $set: {
//                   specialType: {
//                     type: type,
//                     availbility: bedUpdateNum,
//                     pricePerbad: priceperbad,
//                   },
//                 },
//               }
//             );
//           } else if (findbedAllot.type == "Special") {
//             (bedUpdateNum = findbed.specialType.availbility - 1),
//               (priceperbad = findbed.specialType.pricePerbad),
//               (type = findbed.specialType.type);
//             await Bed.findOneAndUpdate(
//               {
//                 _id: bedId,
//               },
//               {
//                 $set: {
//                   specialType: {
//                     type: type,
//                     availbility: bedUpdateNum,
//                     pricePerbad: priceperbad,
//                   },
//                 },
//               }
//             );
//           }
  
//           await bookingBed.findByIdAndUpdate(bedAllotId, {
//             $set: {
//               bookingFlag: true,
//               hospitalFlag: true,
//             },
//           });
//           const text = `Your bed has been booked via WeCare. \n Booking Details:\n  Bed Type : ${type} \n Bed Price : ${priceperbad}Rs \n Hospital Name : ${hosName} \n Bed Id: ${bedAllotId}\n For any help, contact the hospital at ..\n ${hosEmail}`,
//             subject = "booking confirmation",
//             userEmail = emailpatient;
//           /// confirmationn email sent
//           sendEmail(userEmail, subject, text);
//           res.status(200).send("your bed has been booked");
//         } else {
//           res.status(400).send("go to booking page and try to book again");
//         }
//       } else {
//         res.status(400).send("otp is not verified");
//       }
//     } catch (err) {
//       res.status(400).send(`err ${err}`);
//     }
//   });
  