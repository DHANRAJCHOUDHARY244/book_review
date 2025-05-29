import { CustomEmailContent, OtpContentData } from "@constants/common.interface";
import { customContent, otpContent, registrationContent } from "@template/contentEmail";
import { emailTemplate } from "@template/emailTemplate";
import { sendEmail } from "@utils/email";
import logger from "@utils/pino";

export const sendEmailRegistration = async (email:string) => {
    try {
        const template = emailTemplate(registrationContent(email));
        const resp =await sendEmail(email, 'Enrolled new course', template);
        logger.info(JSON.stringify(resp));
        return { ...resp };
    } catch (error) {
        logger.error(`${error}`)
        throw new Error(`'Internal Server Error!😞'+ ${error}`)
    }
}



export const sendEmailOtp = async (email:string, content:OtpContentData) => {
    try {
        const template =emailTemplate(otpContent(email, content));
        const resp = await sendEmail(email, content.title, template);
        return { ...resp };
    } catch (error) {
        logger.error(`${error}`);
        throw new Error(`Internal Server Error! 😞 ${error}`);
    }
};


export const sendCustomEmail=async(email:string,content:CustomEmailContent,subject:string)=>{
    try {
        const template = emailTemplate(customContent(email, content));
        const resp = await sendEmail(email, subject, template);
        logger.info(JSON.stringify(resp));
        return { ...resp }
    } catch (error) {
        logger.error(`${error}`)
        throw new Error(`'Internal Server Error!😞'+ ${error}`)
    }
}