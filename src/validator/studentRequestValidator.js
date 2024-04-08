const Joi = require('joi');

class StudentRequestValidator {
    static validateStudentSaveRequest(requestBody) {
        const schema = Joi.object({
            studentName: Joi.string().required().messages({
                'any.required': 'StudentName is required'
            }),
            department: Joi.string().required().messages({
                'any.required': 'Class is required'
            }),
            parentMobile1: Joi.string().pattern(/^\d{10}$/).required().messages({
                'any.required': 'ParentMobile1 is required',
                'string.pattern.base': 'Mobile number must be a 10-digit number'
            }),
            parentMobile2: Joi.string().pattern(/^\d{10}$/).allow('').optional().messages({
                'string.pattern.base': 'Mobile number must be a 10-digit number'
            }),
            studentEmail: Joi.string().email().required().messages({
                'string.email': 'Invalid Email Format'
            }),
            address: Joi.object().required().messages({
               'any.required': 'Address is required' 
            })
        });

        // Validate requestBody against schema
        const { error } = schema.validate(requestBody, { abortEarly: false });

        // Return validation result
        return error ? error.details.map((err) => err.message) : true;
    }
}

module.exports = StudentRequestValidator;
