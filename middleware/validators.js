import {body, validationResult} from 'express-validator'

const rules = [

body("email").isEmail().withMessage("please enter valid email").normalizeEmail(), 
body("password").isString().withMessage("password should be string").isLength({min:4}).withMessage("password is too short"), 
//this is a custom middleware
// here we are checking through the validationResult if there is any error in the request body
(req,res,next)=>{

    //custom middleware
    //extracting the errors from the request body
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false, data: errors.array().map((err=>(
           
            {
            // here we are returning an object with the key as the parameter name and the value as the error message 
            // for example if the email is not valid then the key will be email and the value will be "please enter valid email"
            
            [err.param]: err.msg

         

            
            
            })
        ))})
            
    }else

    next()
}
]

export default rules