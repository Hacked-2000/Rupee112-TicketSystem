const UserModel = require('../models/userModel');
const { validationResult } = require('express-validator');
const crypto = require('crypto');


exports.createUser = async (req, res) => {
    try {

        const { email, password } = req.body;

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


        // Check if email already exists
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(200).json({
                status: 'failure',
                status_code: 409,
                message: 'Email already exists',
                data: null,
                errors: {
                    type: 'field',
                    msg: 'Email already exists',
                }
            });
        }

        // Hash the password using SHA-256
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        req.body.password = hashedPassword;

        // Create the user
        const newUserId = await UserModel.createUser(req.body);
        res.status(200).json({
            status: 'success',
            status_code: 200,
            message: 'User created successfully',
            id: newUserId
        });
    } catch (err) {
        console.error(err);
        return res.status(200).json({
            status: "failure",
            status_code: 500,
            message: "Internal server error",
            data: null,
            errors: err.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {
            lms_user_id,
            role_id,
            name,
            updated_by,
            reporting,
            is_active,
            is_deleted,
            email,
            password
        } = req.body;

        // Prevent update of email or password
        if (email || password) {
            return res.status(200).json({
                status: 'failure',
                status_code: 400,
                message: "Email and password cannot be updated",
                data: null,
                errors: {
                    type: 'field',
                    msg: 'Email and password cannot be updated',
                }
            });
        }

        const updateData = {
            lms_user_id,
            role_id,
            name,
            updated_by,
            reporting,
            is_active,
            is_deleted
        };

        const result = await UserModel.updateUser(userId, updateData);

        if (result.error) {
            return res.status(200).json({
                status: 'failure',
                status_code: 400,
                message: result.error,
                data: null,
                errors: {
                    type: 'field',
                    msg: result.error,
                }
            });
        }

        return res.status(200).json({
            status: "success",
            status_code: 200,
            message: 'User updated successfully',
            data: null,
            errors: null
        });
    } catch (err) {
        console.error('Update User Controller Error:', err);
        return res.status(200).json({
            status: "failure",
            status_code: 500,
            message: "Internal server error",
            data: null,
            errors: err.message
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const deleted = await UserModel.deleteUser(req.params.id);
        if (deleted) {
            return res.status(200).json({
                status: "success",
                status_code: 200,
                message: 'User deleted',
                data: null,
                errors: null
            });
        } else {
            return res.status(200).json({
                status: 'failure',
                status_code: 404,
                message: 'User not found',
                data: null,
                errors: {
                    type: 'field',
                    msg: 'User not found',
                }
            });
        }
    } catch (err) {
        return res.status(200).json({
            status: "failure",
            status_code: 500,
            message: "Internal server error",
            data: null,
            errors: err.message
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 100, role_id } = req.query;

        const result = await UserModel.getUsers({
            page: parseInt(page),
            limit: parseInt(limit),
            role_id: role_id ? parseInt(role_id) : null
        });
        // console.log({result});

        res.status(200).json({
            status: 'success',
            status_code: 200,
            message: 'Users fetched successfully',
            data: result,
            errors: null
        });
    } catch (err) {
        return res.status(200).json({
            status: "failure",
            status_code: 500,
            message: "Internal server error",
            data: null,
            errors: err.message
        });
    }
};
