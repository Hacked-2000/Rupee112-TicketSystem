const { validationResult } = require('express-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/loginModel');

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failure',
                status_code: 400,
                message: 'Validation failed',
                data: null,
                errors: errors.array().map(err => ({
                    type: 'field',
                    msg: err.msg,
                    path: err.param,
                    location: err.location
                }))

            })
        }

        const { user_email, user_password } = req.body;
        const hashedPassword = crypto.createHash('sha256').update(user_password).digest('hex');

        // Check if email exists
        const emailExists = await AuthModel.checkEmailExists(user_email);
        if (!emailExists) {
            return res.status(200).json({
                status: 'failure',
                status_code: 404,
                message: "Email not found",
                data: null,
                errors: {
                    type: 'field',
                    msg: 'Email not found',
                }
            });
        }

        // Authenticate credentials
        const user = await AuthModel.authenticateUser(user_email, hashedPassword);
        if (!user) {
            return res.status(200).json({
                status: 'failure',
                status_code: 401,
                message: "Invalid Password",
                data: null,
                errors: {
                    type: 'field',
                    msg: 'Invalid Password',
                }
            });
        }
        // console.log({user});


        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role_id: user.role_id, role_name: user.role_name, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_SECRET_EXPIRATION }
        );

        return res.status(200).json({
            status: "success",
            status_code: 200,
            message: 'Login successful',
            data: {

                token
            },
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(200).json({
            status: "failure",
            status_code: 500,
            message: "Internal server error",
            data: null,
            errors: err.message
        });
    }
};



exports.resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                status: 'failure',
                status_code: 400,
                message: 'Validation failed',
                data: null,
                errors: errors.array().map(err => ({
                    type: 'field',
                    msg: err.msg,
                    path: err.param,
                    location: err.location
                }))

            })
        }
        const { email, old_password, new_password } = req.body;

        // Check if email exists
        const emailExists = await AuthModel.checkEmailExists(user_email);
        if (!emailExists) {
            return res.status(200).json({
                status: 'failure',
                status_code: 404,
                message: "Email not found",
                data: null,
                errors: {
                    type: 'field',
                    msg: 'Email not found',
                }
            });
        }

        const hashedOldPassword = crypto.createHash('sha256').update(old_password).digest('hex');
        const hashedNewPassword = crypto.createHash('sha256').update(new_password).digest('hex');

        // Authenticate user with old credentials
        const user = await AuthModel.authenticateUser(email, hashedOldPassword);
        if (!user) {
            return res.status(200).json({
                status: 'failure',
                status_code: 401,
                message: "Invalid Password",
                data: null,
                errors: {
                    type: 'field',
                    msg: 'Invalid Password',
                }
            });
        }
        // console.log({ user });


        // Update password
        const updated = await AuthModel.updatePassword(email, hashedNewPassword);
        if (!updated) {
            return res.status(200).json({
                status: 'failure',
                status_code: 500,
                message: "Failed to update password",
                data: null,
                errors: {
                    type: 'field',
                    msg: 'Failed to update password',
                }
            });
        }

        return res.status(200).json({
            status: 'success',
            status_code: 200,
            message: 'Password updated successfully',
            data: null,
            errors: null
        });

    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(200).json({
            status: "failure",
            status_code: 500,
            message: "Internal server error",
            data: null,
            errors: err.message
        });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await AuthModel.getAllRoles();
        return res.status(200).json({
            status: 'success',
            status_code: 200,
            message: 'Roles fetched successfully',
            data: roles,
            errors: null
        });
    } catch (err) {
        console.error('Get Roles Error:', err);
        return res.status(200).json({
            status: "failure",
            status_code: 500,
            message: "Internal server error",
            data: null,
            errors: err.message
        });
    }
};
