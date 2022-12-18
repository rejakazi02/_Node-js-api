// Require Main Modules..
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Require Post Schema from Model..
const Admin = require('../models/admin');


/**
 * Admin Registration
 * Admin Login
 */

exports.adminSignUp = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error! Please complete required information.');
        error.statusCode = 422;
        error.data = errors.array();
        next(error)
        return;
    }

    try {
        const bodyData = req.body;

        delete bodyData.confirmPassword;

        const password = bodyData.password;
        const hashedPass = bcrypt.hashSync(password, 8);

        // const user = new Admin({...bodyData, ...{password: hashedPass}});
        const user = new Admin({...bodyData, ...{password: hashedPass}});


        const usernameExists = await Admin.findOne({username: bodyData.username}).lean();

        if (usernameExists) {
            const error = new Error('A admin with this username already registered!');
            error.statusCode = 406;
            next(error)
        } else {
            const emailExists = await Admin.findOne({email: bodyData.email}).lean();
            if (emailExists) {
                const error = new Error('A admin with this phone number already registered!');
                error.statusCode = 406;
                next(error)
            } else {
                const newUser = await user.save();
                res.status(200).json({
                    message: 'Admin Registration Success!',
                    userId: newUser._id
                });
            }
        }

    } catch (err) {
        console.log(err)
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

// Login Admin..
exports.adminLogin = async (req, res, next) => {

    const credential = req.body.credential;
    const password = req.body.password;

    let loadedAdmin;
    let token;

    try {
        const query = {
            $or: [
                {
                    username: credential
                },
                {
                    email: credential
                }
            ]
        }
        const admin = await Admin.findOne(query);

        if (!admin) {
            const error = new Error('A Admin with this phone or email could not be found!');
            error.statusCode = 404;
            next(error);
        } else if(admin.hasAccess === false) {
            const error = new Error('Permission Denied. Please contact higher authorize person.');
            error.statusCode = 401;
            next(error);
        } else {
            loadedAdmin = admin;
            const isEqual = bcrypt.compareSync(password, admin.password);

            if (!isEqual) {
                const error = new Error('You entered a wrong password!');
                error.statusCode = 401;
                next(error)
            } else {
                // For Json Token Generate..
                token = jwt.sign({
                        username: loadedAdmin.username,
                        email: loadedAdmin.email,
                        userId: loadedAdmin._id
                    },
                    process.env.JWT_PRIVATE_KEY_ADMIN, {
                        expiresIn: '24h'
                    }
                );

                res.status(200).json({
                    token: token,
                    expiredIn: 86400
                })
            }
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        console.log(err)
        next(err);
    }
}

exports.getLoginAdminInfo = async (req, res, next) => {

    try {
        // User Shop ID from check-user-auth token..
        const loginUserId = req.adminData.userId;
        const result = await Admin.findOne({_id: loginUserId}).select('-password')

        res.status(200).json({
            data: result,
            message: 'Successfully Get Admin info.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}


exports.getAdminLists = async (req, res, next) => {

    try {
        const result = await Admin.find().select('-password')

        res.status(200).json({
            data: result,
            message: 'Successfully Get Admin info.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}

exports.getSingleAdminById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const query = {_id: id};
        const data = await Admin.findOne(query)

        res.status(200).json({
            data: data,
            message: 'Data fetch Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.editAdmin = async (req, res, next) => {

    const updatedData = req.body;

    try {
        await Admin.findOneAndUpdate(
            {_id: updatedData._id},
            {$set: updatedData}
        );
        res.status(200).json({
            message: 'Data Updated Success!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}

exports.updateAdminImageField = async (req, res, next) => {

    try {
        const id = req.body.id;
        const query = req.body.query;

        await Admin.findOneAndUpdate({_id: id}, {
            "$set": query
        })
        res.status(200).json({
            message: 'Image Field Updated Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }
}


exports.deleteAdminById = async (req, res, next) => {

    const itemId = req.params.id;

    try {
        const query = {_id: itemId}
        await Admin.deleteOne(query)

        res.status(200).json({
            message: 'Data deleted Successfully!'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
            err.message = 'Something went wrong on database operation!'
        }
        next(err);
    }

}


/**
 COUNTER
 **/

// exports.countsCollectionsDocuments= async (req, res, next) => {
//
//     try {
//         const courseCount = await Course.countDocuments();
//         const serviceCount = await Service.countDocuments();
//         const contactUsCount = await ContactUs.countDocuments();
//         const countsAdmin = await Admin.countDocuments();
//         const countsCourseApplication= await CourseApplication.countDocuments();
//         const countsInternApplication = await InternApplication.countDocuments();
//
//         res.status(200).json({
//             data : {
//                 courses: courseCount,
//                 services: serviceCount,
//                 contacts: contactUsCount,
//                 admins: countsAdmin,
//                 courseApplication: countsCourseApplication,
//                 internApplication: countsInternApplication,
//             }
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//             err.statusCode = 500;
//             err.message = 'Something went wrong on database operation!'
//         }
//         next(err);
//     }
//
// }
